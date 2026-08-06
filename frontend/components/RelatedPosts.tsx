import PostCard from "./PostCard";
import { Category, Post, User } from "@/types/blog";

interface RelatedPostsProps {
  posts: Post[];
  categories: Category[];
  users: User[];
}

export default function RelatedPosts({ posts, categories, users }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const categoryMap: Record<number, string> = {};
  categories.forEach((category) => {
    categoryMap[category.id] = category.name;
  });

  const authorMap: Record<number, string> = {};
  users.forEach((user) => {
    authorMap[user.id] = user.nickname;
  });

  return (
    <section className="related-posts">
      <h2 className="related-heading">관련 글</h2>
      <div className="related-grid">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            categoryName={categoryMap[post.categoryId] ?? ""}
            authorNickname={authorMap[post.authorId] ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
