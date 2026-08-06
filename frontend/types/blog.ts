export interface Blog {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  skin: string;
  visitorCountToday: number;
  visitorCountTotal: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  postCount: number;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export interface Tag {
  id: number;
  name: string;
  postCount: number;
}

export interface User {
  id: number;
  nickname: string;
  avatar: string;
}

export type PostVisibility = "public" | "protected" | "private";

export interface RecommendedBlog {
  id: number;
  blogName: string;
  ownerNickname: string;
  avatar: string;
  subscriberCount: number;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  authorId: number;
  categoryId: number;
  tagIds: number[];
  visibility: PostVisibility;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  sympathyCount: number;
  commentCount: number;
}

export interface Comment {
  id: number;
  postId: number;
  // 데모 유저(users 테이블)가 작성한 시드 댓글은 authorId로 연결됨
  authorId: number | null;
  // 댓글 작성 폼으로 새로 단 댓글은 로그인 연동이 없어 닉네임을 직접 저장함
  authorName?: string;
  content: string;
  isSecret: boolean;
  createdAt: string;
}