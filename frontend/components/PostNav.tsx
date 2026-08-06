import Link from "next/link";
import { Post } from "@/types/blog";

interface PostNavProps {
  prevPost?: Post;
  nextPost?: Post;
}

export default function PostNav({ prevPost, nextPost }: PostNavProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="post-nav">
      {prevPost && (
        <Link href={`/posts/${prevPost.id}`} className="post-nav-link post-nav-link--prev">
          <span className="post-nav-label">이전 글</span>
          <span className="post-nav-title">{prevPost.title}</span>
        </Link>
      )}
      {nextPost && (
        <Link href={`/posts/${nextPost.id}`} className="post-nav-link post-nav-link--next">
          <span className="post-nav-label">다음 글</span>
          <span className="post-nav-title">{nextPost.title}</span>
        </Link>
      )}
    </nav>
  );
}
