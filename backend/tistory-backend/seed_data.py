"""
개발/테스트용 샘플 데이터 시드 스크립트.
실행: docker compose exec -T django python manage.py shell < seed_data.py
- KakaoUser(작성자) 테이블은 FastAPI가 만든 users 테이블(managed=False)이라 여기선 INSERT만 함.
- get_or_create로 여러 번 돌려도 중복 안 생기게 함.
"""
from django.utils import timezone

from accounts.models import KakaoUser
from blog.models import Category, Tag, Post

# 1) 작성자 (카카오 로그인 없이 테스트용으로 직접 생성)
author, _ = KakaoUser.objects.get_or_create(
    kakao_id=1000000001,
    defaults={"nickname": "테스트유저", "profile_image": None, "created_at": timezone.now()},
)

# 2) 카테고리
cat_dev, _ = Category.objects.get_or_create(name="개발", defaults={"order": 1, "description": "개발 이야기"})
cat_life, _ = Category.objects.get_or_create(name="일상", defaults={"order": 2, "description": "소소한 일상"})
cat_review, _ = Category.objects.get_or_create(name="리뷰", defaults={"order": 3, "description": "제품/책 리뷰"})

# 3) 태그
tag_names = ["Django", "Next.js", "Python", "TypeScript", "회고"]
tags = {name: Tag.objects.get_or_create(name=name)[0] for name in tag_names}

# 4) 게시글
posts_spec = [
    {
        "title": "Django REST Framework로 블로그 API 만들기",
        "summary": "DRF ViewSet과 Serializer로 티스토리 클론 API를 구성한 과정을 정리했습니다.",
        "content": "본문입니다. DRF의 ViewSet, Router, Serializer를 활용하면 CRUD API를 빠르게 만들 수 있습니다.",
        "category": cat_dev,
        "tags": ["Django", "Python"],
        "view_count": 152,
        "like_count": 12,
    },
    {
        "title": "Next.js 16 App Router 첫인상",
        "summary": "서버 컴포넌트와 App Router로 블로그 프론트를 구성해본 후기입니다.",
        "content": "본문입니다. App Router의 서버 컴포넌트 덕분에 데이터 패칭이 훨씬 단순해졌습니다.",
        "category": cat_dev,
        "tags": ["Next.js", "TypeScript"],
        "view_count": 231,
        "like_count": 20,
    },
    {
        "title": "프론트와 백엔드를 연결하며 배운 것들",
        "summary": "목 서버(json-server)에서 실제 Django 백엔드로 전환하며 겪은 이슈 정리.",
        "content": "본문입니다. 환경변수 BASE_URL과 URL 접두사(/api/v1), 트레일링 슬래시를 맞추는 게 핵심이었습니다.",
        "category": cat_dev,
        "tags": ["회고", "TypeScript"],
        "view_count": 88,
        "like_count": 7,
    },
    {
        "title": "요즘 개발자의 소소한 일상",
        "summary": "커피와 함께하는 평범한 개발자의 하루를 담았습니다.",
        "content": "본문입니다. 아침엔 커밋, 점심엔 코드리뷰, 저녁엔 회고를 합니다.",
        "category": cat_life,
        "tags": ["회고"],
        "view_count": 45,
        "like_count": 3,
    },
    {
        "title": "개발 서적 리뷰: 클린 아키텍처",
        "summary": "읽고 실무에 적용해본 포인트를 정리한 리뷰입니다.",
        "content": "본문입니다. 경계와 의존성 규칙에 대한 통찰이 특히 유용했습니다.",
        "category": cat_review,
        "tags": ["Python", "회고"],
        "view_count": 120,
        "like_count": 15,
    },
]

created = 0
for spec in posts_spec:
    post, is_new = Post.objects.get_or_create(
        title=spec["title"],
        defaults={
            "content": spec["content"],
            "summary": spec["summary"],
            "author": author,
            "category": spec["category"],
            "status": Post.Status.PUBLISHED,
            "view_count": spec["view_count"],
            "like_count": spec["like_count"],
        },
    )
    if is_new:
        post.tags.set([tags[t] for t in spec["tags"]])
        created += 1

print(f"seed done: users={KakaoUser.objects.count()}, categories={Category.objects.count()}, "
      f"tags={Tag.objects.count()}, posts={Post.objects.count()} (new posts this run: {created})")
