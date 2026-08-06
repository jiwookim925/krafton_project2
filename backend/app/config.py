"""
.env 파일에 적힌 값들을 파이썬 코드에서 쓸 수 있게 불러오는 파일.
pydantic-settings를 쓰면 .env 값을 자동으로 읽어서 타입 체크까지 해줌.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings): #환경변수나 .env 파일에서 값을 자동으로 읽어주는 도구
    # 카카오 관련
    KAKAO_REST_API_KEY: str
    KAKAO_REDIRECT_URI: str
    KAKAO_CLIENT_SECRET: str = ""  # 설정 안 했으면 빈 값 허용

    # JWT 관련
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440  # 토큰 유효시간 (1440분 = 24시간)

    # DB
    DATABASE_URL: str

    # 로그인 성공 후 돌려보낼 프론트 주소
    FRONTEND_REDIRECT_URL: str

    class Config:
        env_file = ".env"


# 이 settings 객체를 다른 파일에서 import해서 씀
# 예: from app.config import settings → settings.JWT_SECRET_KEY
settings = Settings()