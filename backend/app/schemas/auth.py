"""
API로 주고받는 데이터의 '모양'을 정의하는 파일.
models가 DB 테이블 설계도라면, schemas는 HTTP로 오가는 JSON의 설계도.
"""
from pydantic import BaseModel
from datetime import datetime


class UserResponse(BaseModel):
    """/api/auth/me 같은 곳에서 유저 정보 응답할 때 쓰는 형태"""
    id: int
    kakao_id: int
    nickname: str | None
    profile_image: str | None
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy 모델 객체를 그대로 변환할 수 있게 해줌


class TokenResponse(BaseModel):
    """JWT 발급 응답 형태 (리다이렉트 안 하고 JSON으로 줄 때 쓸 수 있음)"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse