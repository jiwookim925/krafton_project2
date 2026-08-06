"use client";

import { FormEvent, useState } from "react";
import { Comment } from "@/types/blog";

interface CommentFormProps {
  postId: number;
  onCreated: (comment: Comment) => void;
}

export default function CommentForm({ postId, onCreated }: CommentFormProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nickname.trim() || !content.trim()) {
      setError("닉네임과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          authorId: null,
          authorName: nickname.trim(),
          content: content.trim(),
          isSecret: false,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("댓글 등록에 실패했습니다.");
      }

      const created: Comment = await res.json();
      onCreated(created);
      setContent("");
    } catch {
      setError("댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="comment-form-nickname"
        placeholder="닉네임"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        maxLength={20}
      />
      <textarea
        className="comment-form-textarea"
        placeholder="내용을 입력하세요."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
      />
      {error && <p className="comment-form-error">{error}</p>}
      <div className="comment-form-footer">
        <button type="submit" className="comment-form-submit" disabled={submitting}>
          {submitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
