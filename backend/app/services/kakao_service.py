"""
카카오 API랑 대화하는 담당 파일.
routers는 이 함수들을 가져다 쓰기만 하고, 실제 통신 로직은 여기 다 모여있음.
"""
import httpx

from app.config import settings

KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me"


async def get_kakao_access_token(code: str) -> str:
    """
    카카오한테 인가코드(code)를 주고 액세스 토큰을 받아옴.
    """
    payload = {
        "grant_type": "authorization_code",
        "client_id": settings.KAKAO_REST_API_KEY,
        "redirect_uri": settings.KAKAO_REDIRECT_URI,
        "code": code,
    }
    # 클라이언트 시크릿을 설정했으면 같이 보냄
    if settings.KAKAO_CLIENT_SECRET:
        payload["client_secret"] = settings.KAKAO_CLIENT_SECRET

    async with httpx.AsyncClient() as client:
        response = await client.post(
            KAKAO_TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()  # 실패하면 에러 던짐
        token_data = response.json()

    return token_data["access_token"]


async def get_kakao_user_info(access_token: str) -> dict:
    """
    액세스 토큰으로 카카오한테 '이 사람이 누구야'를 물어봐서
    카카오 고유 id, 닉네임을 받아옴.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            KAKAO_USER_INFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        user_data = response.json()

    # 카카오 응답 구조에서 필요한 값만 뽑아서 정리해서 리턴
    kakao_account = user_data.get("kakao_account", {})
    profile = kakao_account.get("profile", {})

    return {
        "kakao_id": user_data["id"],  # 이건 동의 여부와 상관없이 항상 옴
        "nickname": profile.get("nickname"),  # 동의 안 했으면 None
        "profile_image": profile.get("profile_image_url"),
    }