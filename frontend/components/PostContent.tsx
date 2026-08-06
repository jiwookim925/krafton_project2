import Image from "next/image";
import { Fragment } from "react";
import { Post } from "@/types/blog";

interface PostContentProps {
  post: Post;
}

function renderContent(content: string) {
  const blocks = content.trim().split(/\n\n+/);

  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="post-content-heading">
          {block.replace(/^##\s*/, "")}
        </h2>
      );
    }

    const lines = block.split("\n");
    return (
      <p key={index} className="post-content-paragraph">
        {lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    );
  });
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <div className="post-content">
      <div className="post-content-thumb">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 760px"
          priority
        />
      </div>
      <div className="post-content-body">{renderContent(post.content)}</div>
    </div>
  );
}
