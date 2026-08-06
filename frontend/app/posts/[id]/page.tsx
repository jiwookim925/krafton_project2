import { notFound } from "next/navigation";
import {
  getCategories,
  getComments,
  getPostById,
  getPosts,
  getTags,
  getUsers,
} from "@/lib/api";
import { User } from "@/types/blog";
import TopNav from "@/components/TopNav";
import PostHeader from "@/components/PostHeader";
import PostContent from "@/components/PostContent";
import PostTags from "@/components/PostTags";
import PostSympathyBar from "@/components/PostSympathyBar";
import PostAuthorCard from "@/components/PostAuthorCard";
import PostNav from "@/components/PostNav";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // json-server가 새로 만든 글에는 숫자가 아닌 임의 문자열 id를 붙이기 때문에
  // (예: "5YvSFXGiQn4") 여기서 숫자인지 검증하지 않고 그대로 조회에 사용한다.
  const post = await getPostById(id);

  if (!post || post.isDraft || post.visibility === "private") {
    notFound();
  }

  const [categories, tags, users, comments, allPosts] = await Promise.all([
    getCategories(),
    getTags(),
    getUsers(),
    getComments(post.id),
    getPosts(),
  ]);

  const categoryMap: Record<number, (typeof categories)[number]> = {};
  categories.forEach((item) => {
    categoryMap[item.id] = item;
  });

  const authorMap: Record<number, User> = {};
  users.forEach((user) => {
    authorMap[user.id] = user;
  });

  const tagMap: Record<number, (typeof tags)[number]> = {};
  tags.forEach((tag) => {
    tagMap[tag.id] = tag;
  });

  const category = categoryMap[post.categoryId];
  const author = authorMap[post.authorId];
  const postTags = post.tagIds.map((tagId) => tagMap[tagId]).filter(Boolean);

  const sameCategoryPosts = allPosts
    .filter((item) => item.id !== post.id && item.categoryId === post.categoryId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const currentIndex = allPosts.findIndex((item) => item.id === post.id);
  const prevPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  return (
    <div className="page">
      <TopNav />
      <article className="post-layout">
        <PostHeader post={post} category={category} author={author} />
        <PostContent post={post} />
        <PostTags tags={postTags} />
        <PostSympathyBar sympathyCount={post.sympathyCount} commentCount={post.commentCount} />
        {author && <PostAuthorCard author={author} />}
        <PostNav prevPost={prevPost} nextPost={nextPost} />
        <CommentSection postId={post.id} comments={comments} authorMap={authorMap} />
        <RelatedPosts posts={sameCategoryPosts} categories={categories} users={users} />
      </article>
    </div>
  );
}
