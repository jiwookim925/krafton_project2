import Image from "next/image";
import { Fragment } from "react";
import { Post } from "@/types/blog";

interface PostContentProps {
  post: Post;
}

// 본문 한 줄이 이미지 마크다운(![alt](url))이면 URL을 뽑아냄
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

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
      <div key={index} className="post-content-paragraph">
        {lines.map((line, lineIndex) => {
          const image = line.match(IMAGE_LINE);
          if (image) {
            // 본문에 삽입된 업로드 이미지. 외부/내부 URL 모두 대응하도록 일반 img 사용
            // eslint-disable-next-line @next/next/no-img-element
            return (
              <img
                key={lineIndex}
                src={image[2]}
                alt={image[1] || ""}
                className="post-content-image"
              />
            );
          }
          return (
            <Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </Fragment>
          );
        })}
      </div>
    );
  });
}

export default function PostContent({ post }: PostContentProps) {
  // 본문에 이미지가 있으면 그 첫 이미지가 곧 썸네일이라, 상단에 또 보여주면 중복됨 → 상단 대표이미지 생략.
  // 텍스트만 있는 글은 기존처럼 상단 대표 이미지를 보여줌.
  const hasBodyImage = IMAGE_LINE.test(
    post.content.split("\n").find((line) => IMAGE_LINE.test(line)) ?? ""
  );

  return (
    <div className="post-content">
      {!hasBodyImage && (
        <div className="post-content-thumb">
          <Image
            src={post.thumbnail || `https://picsum.photos/seed/post-${post.id}/800/450`}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            priority
          />
        </div>
      )}
      <div className="post-content-body">{renderContent(post.content)}</div>
    </div>
  );
}
