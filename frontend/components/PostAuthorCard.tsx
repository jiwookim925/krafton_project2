import Image from "next/image";
import { User } from "@/types/blog";

interface PostAuthorCardProps {
  author: User;
}

export default function PostAuthorCard({ author }: PostAuthorCardProps) {
  return (
    <div className="post-author-card">
      <div className="post-author-avatar">
        <Image src={author.avatar} alt={author.nickname} fill sizes="56px" />
      </div>
      <div>
        <p className="post-author-name">{author.nickname}</p>
        <p className="post-author-desc">이 글을 작성했습니다.</p>
      </div>
    </div>
  );
}
