"""
User 테이블 설계도. 이 클래스 하나가 DB의 users 테이블 하나에 대응됨.
"""
from sqlalchemy import Column, Integer, BigInteger, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    kakao_id = Column(BigInteger, unique=True, nullable=False, index=True)
    nickname = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())