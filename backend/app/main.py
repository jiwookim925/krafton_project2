"""
FastAPI 앱의 진짜 시작점. uvicorn이 이 파일의 'app'을 실행함.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth
from app.config import settings

# 서버 켤 때 models에 정의된 테이블들을 DB에 자동 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tistory Clone API")

# CORS 설정: 프론트(다른 포트/도메인)에서 오는 요청을 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_REDIRECT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# auth 라우터 연결 -> /api/auth/* 주소들이 이제 동작함
app.include_router(auth.router)


@app.get("/")
def health_check():
    return {"status": "ok"}