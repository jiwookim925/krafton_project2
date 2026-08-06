# FastAPI 백엔드 컨테이너 이미지

# Python 3.12가 설치된 가벼운 리눅스 이미지를 기반으로 사용
FROM python:3.12-slim

# 컨테이너 안에서 명령을 실행할 기본 폴더
WORKDIR /app

# 의존성 목록만 먼저 복사해서 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 애플리케이션 코드 복사
COPY ./app ./app

# 컨테이너가 시작될 때 uvicorn으로 FastAPI 앱 실행
# app.main:app = app/main.py 파일 안의 app 객체
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
