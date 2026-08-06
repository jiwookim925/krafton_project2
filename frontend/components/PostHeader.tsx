import Image from "next/image";
import Link from "next/link";
import { Category, Post, User } from "@/types/blog";

interface PostHeaderProps {
  post: Post;
  category?: Category;
  author?: User;
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export default function PostHeader({ post, category, author }: PostHeaderProps) {
  return (
    <header className="post-header">
      {category && (
        <Link href={`/?category=${category.slug}`} className="post-category">
          {category.name}
        </Link>
      )}
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        {author && (
          <span className="post-meta-author">
            <span className="post-meta-avatar">
              <Image src={author.avatar} alt={author.nickname} fill sizes="24px" />
            </span>
            {author.nickname}
          </span>
        )}
        <span className="post-meta-date">{formatDateTime(post.createdAt)}</span>
        <span className="post-meta-views">조회 {post.viewCount}</span>
      </div>
    </header>
  );
}
