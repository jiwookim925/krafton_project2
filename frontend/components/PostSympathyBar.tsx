"use client";

import { useState } from "react";
import { Heart, Link2, MessageCircle } from "lucide-react";

interface PostSympathyBarProps {
  sympathyCount: number;
  commentCount: number;
}

export default function PostSympathyBar({
  sympathyCount,
  commentCount,
}: PostSympathyBarProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(sympathyCount);
  const [copied, setCopied] = useState(false);

  function toggleLike() {
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근 실패는 조용히 무시
    }
  }

  return (
    <div className="post-actions">
      <button
        type="button"
        className={liked ? "post-like post-like--active" : "post-like"}
        onClick={toggleLike}
      >
        <Heart size={20} fill={liked ? "currentColor" : "none"} />
        공감 {count}
      </button>
      <a href="#comments" className="post-comment-link">
        <MessageCircle size={18} />
        댓글 {commentCount}
      </a>
      <button type="button" className="post-share" onClick={handleShare}>
        <Link2 size={16} />
        {copied ? "복사됨" : "공유"}
      </button>
    </div>
  );
}
