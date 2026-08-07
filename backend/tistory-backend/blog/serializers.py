from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Tag, Post, Comment, PostLike, UploadedImage

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)
    parent_id = serializers.IntegerField(read_only=True, allow_null=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "description", "parent_id",
            "order", "post_count", "children",
        ]
        read_only_fields = ["slug"]

    def get_children(self, obj):
        # 최상위 목록 조회시에만 하위 카테고리를 함께 내려줘서 트리로 사용 가능
        children = obj.children.all()
        return CategorySerializer(children, many=True, context=self.context).data


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "post_count"]
        read_only_fields = ["slug"]


class KakaoUserSerializer(serializers.ModelSerializer):
    avatar = serializers.CharField(source="profile_image", read_only=True)

    class Meta:
        model = User
        fields = ["id", "nickname", "avatar"]


class TagRelatedField(serializers.SlugRelatedField):
    """태그를 이름으로 주고받되, 없으면 자동 생성"""

    def to_internal_value(self, data):
        tag, _ = Tag.objects.get_or_create(name=data)
        return tag


class PostListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.nickname")
    author_id = serializers.ReadOnlyField()
    category = serializers.ReadOnlyField(source="category.name")
    category_id = serializers.ReadOnlyField()
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    sympathy_count = serializers.IntegerField(source="like_count", read_only=True)
    visibility = serializers.SerializerMethodField()
    is_draft = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "summary", "thumbnail",
            "author", "author_id", "category", "category_id",
            "tags", "tag_ids", "status", "visibility", "is_draft",
            "view_count", "sympathy_count", "comment_count", "is_liked",
            "created_at", "published_at",
        ]

    def get_tag_ids(self, obj):
        return [tag.id for tag in obj.tags.all()]

    def get_comment_count(self, obj):
        return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return obj.likes.filter(user=user).exists()

    def get_visibility(self, obj):
        # 프론트가 기대하는 public/protected/private 3단계 중,
        # 지금 모델엔 protected(비밀글) 개념이 없어서 private로 합쳐서 내려줌
        return "public" if obj.status == Post.Status.PUBLISHED else "private"

    def get_is_draft(self, obj):
        return obj.status == Post.Status.DRAFT


class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.nickname")
    author_id = serializers.ReadOnlyField()
    category = serializers.ReadOnlyField(source="category.name")
    # 프론트가 categoryId(숫자)로 카테고리를 지정/조회하므로 읽기·쓰기 모두 지원
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), required=False, allow_null=True
    )
    tags = TagSerializer(many=True, read_only=True)
    # 프론트가 tagIds(숫자 배열)로 태그를 보냄. 읽기 땐 pk 목록, 쓰기 땐 태그 지정
    tag_ids = serializers.PrimaryKeyRelatedField(
        source="tags", many=True, queryset=Tag.objects.all(), required=False
    )
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    sympathy_count = serializers.IntegerField(source="like_count", read_only=True)
    visibility = serializers.SerializerMethodField()
    is_draft = serializers.SerializerMethodField()
    # 프론트가 본문 첫 이미지 URL을 썸네일로 보냄. 우리 서버 /media/에 이미 올라간 파일이면 그 경로를 thumbnail로 저장
    thumbnail_url = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "content", "summary", "thumbnail", "thumbnail_url",
            "author", "author_id", "category", "category_id",
            "tags", "tag_ids", "status", "visibility", "is_draft", "allow_comment",
            "view_count", "sympathy_count", "comment_count", "is_liked",
            "created_at", "updated_at", "published_at",
        ]
        # thumbnail은 ImageField라 프론트가 보내는 외부 URL 문자열을 직접 쓰기하면 검증 에러가 나므로 읽기 전용.
        # 대신 thumbnail_url(write_only)로 받아서 create()에서 파일 경로로 세팅함
        read_only_fields = ["slug", "view_count", "like_count", "thumbnail"]

    def get_comment_count(self, obj):
        return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return obj.likes.filter(user=user).exists()

    def get_visibility(self, obj):
        return "public" if obj.status == Post.Status.PUBLISHED else "private"

    def get_is_draft(self, obj):
        return obj.status == Post.Status.DRAFT

    def create(self, validated_data):
        # 본문 첫 이미지 URL(thumbnail_url)을 글 썸네일로 저장.
        # 이미 /media/ 아래에 업로드된 파일이면 그 상대경로를 ImageField name으로 지정(재업로드 불필요)
        thumbnail_url = validated_data.pop("thumbnail_url", "")
        validated_data["author"] = self.context["request"].user
        post = super().create(validated_data)
        if thumbnail_url and "/media/" in thumbnail_url:
            relative_path = thumbnail_url.split("/media/", 1)[1]
            post.thumbnail.name = relative_path
            post.save(update_fields=["thumbnail"])
        return post


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.nickname")
    # 프론트 Comment 타입에 맞춘 읽기 필드 (postId/authorId/authorName)
    post_id = serializers.IntegerField(read_only=True)
    author_id = serializers.IntegerField(read_only=True, allow_null=True)
    author_name = serializers.CharField(source="guest_name", read_only=True)
    replies = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id", "post", "post_id", "author", "author_id", "author_name",
            "guest_name", "parent", "content", "is_secret", "replies",
            "created_at", "updated_at",
        ]
        read_only_fields = ["post"]

    def get_content(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if obj.is_deleted:
            return "삭제된 댓글입니다."
        if not obj.can_view(user):
            return "비밀댓글입니다."
        return obj.content

    def get_replies(self, obj):
        if obj.parent_id is not None:
            return []  # 대댓글은 한 단계까지만 (무한 중첩 방지)
        qs = obj.replies.all()
        return CommentSerializer(qs, many=True, context=self.context).data

    def create(self, validated_data):
        request = self.context["request"]
        if request.user.is_authenticated:
            validated_data["author"] = request.user
        return super().create(validated_data)


class UploadedImageSerializer(serializers.ModelSerializer):
    """글쓰기 에디터에서 이미지 업로드 시 사용. url 필드로 절대경로를 내려줌"""

    url = serializers.SerializerMethodField()

    class Meta:
        model = UploadedImage
        fields = ["id", "image", "url", "post", "created_at"]
        read_only_fields = ["url", "created_at"]
        extra_kwargs = {"image": {"write_only": True}, "post": {"required": False}}

    def get_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url

    def create(self, validated_data):
        validated_data["uploader"] = self.context["request"].user
        return super().create(validated_data)


class MyProfileSerializer(serializers.ModelSerializer):
    """마이페이지 상단에 쓰이는 최소한의 프로필 정보 + 활동 통계.
    회원 정보 자체(가입/수정)는 로그인 백엔드(FastAPI)의 카카오 유저 API 쪽 책임이라 여기선 조회 위주."""

    avatar = serializers.CharField(source="profile_image", read_only=True)
    post_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "nickname", "avatar", "created_at", "post_count", "comment_count"]
        read_only_fields = fields

    def get_post_count(self, obj):
        return obj.posts.filter(status=Post.Status.PUBLISHED).count()

    def get_comment_count(self, obj):
        return obj.comments.filter(is_deleted=False).count()
