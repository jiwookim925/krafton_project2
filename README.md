# 티스토리 클론

Next.js(프론트) + FastAPI(카카오 로그인) + Django REST(블로그 API) + PostgreSQL 로 만든 티스토리 클론.

## 구성

```
브라우저 → 프론트(Next.js, 3000)
             ├─ 블로그 데이터 → Django REST (8001, /api/v1)
             └─ 로그인       → FastAPI (8000, /api/auth)
Django · FastAPI → PostgreSQL (5432)  ← users 테이블은 FastAPI가, 블로그 테이블은 Django가 관리
```

- **FastAPI**(`backend/`): 카카오 OAuth 로그인, JWT 발급. `users` 테이블 생성.
- **Django**(`backend/tistory-backend/`): 글/카테고리/태그/댓글/이미지 업로드 API. FastAPI가 발급한 JWT를 같은 시크릿으로 검증.
- **프론트**(`frontend/`): App Router 기반 화면.

## 사전 준비

- Docker / Docker Compose
- Node.js (프론트 dev용)
- 카카오 개발자 앱 (로그인 테스트 시): [developers.kakao.com](https://developers.kakao.com)
  - REST API 키 발급
  - Redirect URI 등록: `http://localhost:8000/api/auth/kakao/callback`
  - 사이트 도메인: `http://localhost:8000`, `http://localhost:3000`

## 셋업

### 1. 환경변수 파일 만들기 (git에 안 올라가므로 각자 생성)

```bash
cp backend/.env.example backend/.env
cp backend/tistory-backend/.env.example backend/tistory-backend/.env
cp frontend/.env.local.example frontend/.env.local
```

- `backend/.env` 의 `KAKAO_REST_API_KEY`(+ 필요시 `KAKAO_CLIENT_SECRET`)를 채우세요.
- **중요**: `backend/.env` 와 `backend/tistory-backend/.env` 의 `JWT_SECRET_KEY`는 **반드시 동일**해야 합니다. (FastAPI가 발급 → Django가 검증)

### 2. 백엔드 실행 (DB 마이그레이션 자동 수행)

```bash
docker compose up -d --build
```

- `db`, `backend`(FastAPI), `django` 세 컨테이너가 뜹니다.
- Django 컨테이너가 시작 시 **`migrate`를 자동 실행**해 블로그 테이블을 만듭니다. (users 테이블은 FastAPI가 자동 생성)

### 3. (선택) 샘플 데이터 넣기

빈 DB로 시작하므로, 화면에서 바로 보고 싶으면 시드 데이터를 넣으세요.

```bash
docker compose exec -T django python manage.py shell < backend/tistory-backend/seed_data.py
```

### 4. 프론트 실행

```bash
cd frontend
npm install
npm run dev
```

→ http://localhost:3000

## 접속 주소

| 서비스 | 주소 |
|--------|------|
| 프론트 | http://localhost:3000 |
| Django API | http://localhost:8001/api/v1/ |
| FastAPI | http://localhost:8000/ |
| PostgreSQL | localhost:5432 (dev/devpass) |

## 참고

- **DB 데이터는 git에 포함되지 않습니다.** 클론하면 빈 DB로 시작하니 위 3번(시드) 또는 로그인 후 직접 글쓰기로 채우세요.
- 업로드 이미지(`backend/tistory-backend/media/`)도 git에 올라가지 않습니다.
- DB 완전 초기화: `docker compose down -v` (볼륨 삭제)
- 종료: `docker compose down` (데이터 보존)
