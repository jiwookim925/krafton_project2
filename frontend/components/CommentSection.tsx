"use client";

import { useState } from "react";
import { Comment, User } from "@/types/blog";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  authorMap: Record<number, User>;
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

export default function CommentSection({
  postId,
  comments: initialComments,
  authorMap,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);

  function handleCreated(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  return (
    <section id="comments" className="comment-section">
      <h2 className="comment-heading">댓글 {comments.length}</h2>
      {comments.length === 0 ? (
        <p className="empty-state">첫 댓글을 남겨보세요.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => {
            const author = comment.authorId != null ? authorMap[comment.authorId] : undefined;
            const displayName = comment.authorName ?? author?.nickname ?? "알 수 없음";
            return (
              <li key={comment.id} className="comment-item">
                <div className="comment-item-head">
                  <span className="comment-author">{displayName}</span>
                  <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
                </div>
                <p className="comment-body">
                  {comment.isSecret ? "🔒 비밀 댓글입니다." : comment.content}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <CommentForm postId={postId} onCreated={handleCreated} />
    </section>
  );
}
