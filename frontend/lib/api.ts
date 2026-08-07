import {
  Blog,
  Category,
  Comment,
  Post,
  PostVisibility,
  RecommendedBlog,
  Tag,
  User,
} from "@/types/blog";
import { AuthUser } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// 로그인 관련은 데이터용 더미 서버(BASE_URL)가 아니라, 지우가 만든 진짜 백엔드 주소를 씀
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return res.json();
}

export function getCategories() {
  return fetchJSON<Category[]>("/categories");
}

export function getTags() {
  return fetchJSON<Tag[]>("/tags");
}

export function getUsers() {
  return fetchJSON<User[]>("/users");
}

export function getRecommendedBlogs() {
  return fetchJSON<RecommendedBlog[]>("/recommendedBlogs");
}

export function getBlog() {
  return fetchJSON<Blog>("/blog");
}

export async function getPostById(id: string): Promise<Post | null> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { cache: "no-store" });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch post ${id}`);
  }

  return res.json();
}

export function getComments(postId: number) {
  return fetchJSON<Comment[]>(`/comments?postId=${postId}`);
}

// 관리 페이지용: 공개 여부/임시저장 여부와 상관없이 해당 유저가 쓴 글을 전부 가져옴
export async function getMyPosts(authorId: number): Promise<Post[]> {
  const posts = await fetchJSON<Post[]>(`/posts?authorId=${authorId}`);
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

interface CreatePostParams {
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  authorId: number;
  categoryId: number;
  tagIds: number[];
  visibility: PostVisibility;
  isDraft: boolean;
}

export async function createPost(params: CreatePostParams): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      sympathyCount: 0,
      commentCount: 0,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create post");
  }

  return res.json();
}

// 저장해둔 토큰으로 "지금 로그인된 유저가 누구인지" 백엔드에 물어보는 함수
// TODO(확인 필요): 실제 엔드포인트 경로가 "/api/auth/me"가 맞는지 지우한테 확인하기
export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // 토큰이 만료됐거나 잘못됐으면 로그인 안 된 것으로 처리
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    // 네트워크 에러 등으로 요청 자체가 실패해도 로그인 안 된 것으로 처리
    return null;
  }
}

interface GetPostsParams {
  categoryId?: number;
  tagId?: number;
  query?: string;
}

export async function getPosts(params: GetPostsParams = {}) {
  const posts = await fetchJSON<Post[]>("/posts");
  const visiblePosts = posts.filter(
    (post) => post.visibility === "public" && !post.isDraft
  );

  return visiblePosts
    .filter((post) => {
      const matchesCategory = params.categoryId
        ? post.categoryId === params.categoryId
        : true;
      const matchesTag = params.tagId
        ? post.tagIds.includes(params.tagId)
        : true;
      const matchesQuery = params.query
        ? `${post.title} ${post.summary}`
            .toLowerCase()
            .includes(params.query.toLowerCase())
        : true;

      return matchesCategory && matchesTag && matchesQuery;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}