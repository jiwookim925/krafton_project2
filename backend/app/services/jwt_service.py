"""
우리 서비스만의 JWT를 만들고(발급) 확인하는(검증) 담당 파일.
카카오 토큰이랑은 완전히 별개 - 이건 우리가 직접 서명해서 만드는 우리 토큰.
"""
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError

from app.config import settings


def create_access_token(user_id: int) -> str:
    """
    유저 id를 넣어서 JWT를 만들어줌.
    payload(내용물)에는 최소한의 정보(user_id, 만료시간)만 넣음 -
    민감한 정보는 JWT 안에 넣지 않는 게 원칙 (누구나 디코딩해서 볼 수 있어서).
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),  # sub = subject, "이 토큰의 주인이 누구냐" 표준 필드
        "exp": expire,        # exp = expiration, 만료시간 표준 필드
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token


def decode_access_token(token: str) -> int | None:
    """
    JWT를 받아서 서명이 맞는지, 만료 안 됐는지 확인하고
    맞으면 그 안에 들어있던 user_id를 꺼내줌.
    틀렸거나 만료됐으면 None 리턴.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        return int(user_id) if user_id else None
    except JWTError:
        return None