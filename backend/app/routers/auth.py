"""
'접수 창구' 역할. 실제 URL 주소들을 정의하고,
들어온 요청을 services한테 넘겨서 일 시킨 다음 결과를 응답으로 돌려줌.
"""
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse
from app.services import kakao_service, jwt_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/kakao/login")
def kakao_login():
    """
    1단계: 사용자를 카카오 로그인 페이지로 보내줌.
    프론트에서 '카카오 로그인' 버튼 누르면 이 주소로 오게 하면 됨.
    """
    kakao_auth_url = (
        "https://kauth.kakao.com/oauth/authorize"
        f"?client_id={settings.KAKAO_REST_API_KEY}" # 앱 식별 키
        f"&redirect_uri={settings.KAKAO_REDIRECT_URI}" #성공 후 돌아올 백엔드 주소
        "&response_type=code" #인가코드 요청
        "&scope=profile_nickname,profile_image" # 닉네임/프로필사진 동의 요청 *프로필,닉네임 받아오게수정
    )
    return RedirectResponse(url=kakao_auth_url) 
#사용자를 카카오 로그인 페이지로 보냄->로그인->카카오가 리다이렉트(+인가코드)


@router.get("/kakao/callback")
async def kakao_callback(code: str, db: Session = Depends(get_db)):
    """
    3단계: 카카오가 인가코드(code)를 들고 여기로 리다이렉트해서 옴.
    여기서 토큰 교환 -> 사용자 정보 조회 -> DB 저장/조회 -> JWT 발급까지 다 처리.
    """
    # 3-1. 인가코드로 액세스 토큰 받기
    kakao_access_token = await kakao_service.get_kakao_access_token(code)

    # 3-2. 액세스 토큰으로 사용자 정보(카카오 id, 닉네임) 받기
    kakao_user_info = await kakao_service.get_kakao_user_info(kakao_access_token)

    # 3-3. DB에서 이 kakao_id로 가입된 유저가 있는지 확인
    user = db.query(User).filter(User.kakao_id == kakao_user_info["kakao_id"]).first()

    if user is None:
        # 처음 온 사용자면 신규 가입
        user = User(
            kakao_id=kakao_user_info["kakao_id"],
            nickname=kakao_user_info["nickname"] or str(kakao_user_info["kakao_id"]),
            profile_image=kakao_user_info["profile_image"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3-4. 우리 서비스 JWT 발급
    access_token = jwt_service.create_access_token(user_id=user.id)

    # 3-5. 프론트로 JWT를 들고 리다이렉트 (쿼리파라미터 방식)
    redirect_url = f"{settings.FRONTEND_REDIRECT_URL}?token={access_token}"
    return RedirectResponse(url=redirect_url)


@router.get("/me", response_model=UserResponse) #응답시 UserResponse 모양으로 보내라.(db에서 가져온 User객체 프론트에 보낼 json모양으로 정리)
def get_my_info(current_user: User = Depends(get_current_user)): #get_current실행해서 결과 current_user에 넣음
    """
    (테스트용) 내 JWT로 내 정보 조회.
    프론트에서 Authorization: Bearer {token} 헤더 넣어서 호출하면 됨.
    """
    return current_user