"""
DB랑 연결을 맺고, 각 요청마다 DB 세션(작업 단위)을 만들어주는 파일.
models 파일들이 여기서 만든 Base를 상속받아서 테이블을 정의하게 됨.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# DB에 실제로 연결하는 엔진
engine = create_engine(settings.DATABASE_URL)

# DB 세션을 만들어주는 팩토리 (요청 하나당 세션 하나)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy용 공통 부모 클래스 생성
Base = declarative_base()


def get_db():
    """
    FastAPI 라우터에서 Depends(get_db)로 주입해서 씀.
    요청 처리 끝나면 자동으로 세션을 닫아줌.
    """
    db = SessionLocal()
    try:
        yield db #세션 빌려줌
    finally:
        db.close() #닫음
        
# docker exec -it proj2-db-1 psql -U dev -d tistory_clone