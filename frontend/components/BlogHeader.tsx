import { Blog } from "@/types/blog";

interface BlogHeaderProps {
  blog: Blog;
  postCount: number;
}

export default function BlogHeader({ blog, postCount }: BlogHeaderProps) {
  return (
    <header className="blog-header">
      <h1 className="blog-header-title">{blog.title}</h1>
      <p className="blog-header-desc">{blog.description}</p>
      <p className="blog-header-count">전체 글 {postCount}</p>
    </header>
  );
}
