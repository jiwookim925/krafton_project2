"""
'이 요청 보낸 사람이 로그인한 사람 맞아?'를 확인하는 함수.
민채가 게시글 작성 API 만들 때도 이 함수를 그대로 가져다 쓰면
'로그인한 사람만 글쓰기 가능' 같은 제한을 걸 수 있음.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.jwt_service import decode_access_token

# Authorization: Bearer {token} 헤더에서 토큰을 자동으로 뽑아주는 도구
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), #헤더를 읽어서 credential에 토근 넣음
    db: Session = Depends(get_db),
) -> User: #성공하면 user 객체 반환
    token = credentials.credentials  # "Bearer " 뗀 순수 토큰 문자열
    user_id = decode_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않거나 만료된 토큰입니다.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다.",
        )

    return user