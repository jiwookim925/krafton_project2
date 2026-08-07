"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { deletePost, getMyPosts } from "@/lib/api";
import { Post } from "@/types/blog";
import TopNav from "@/components/TopNav";
import HomeAccountCard from "@/components/HomeAccountCard";

function formatDate(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function statusLabel(post: Post) {
  if (post.isDraft) return "임시저장";
  if (post.visibility === "protected") return "비공개(이웃공개)";
  if (post.visibility === "private") return "비공개";
  return "공개";
}

export default function ManagePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    setLoggedIn(token !== null);

    if (token) {
      // 로그인한 본인이 쓴 글(임시저장/비공개 포함)을 백엔드에서 토큰 기준으로 받아옴
      getMyPosts(token).then(setPosts).catch(() => setPosts([]));
    }
  }, []);

  async function handleDelete(post: Post) {
    const token = getToken();
    if (!token) return;
    if (!window.confirm(`'${post.title}' 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;

    setDeletingId(post.id);
    try {
      await deletePost(post.id, token);
      // 삭제 성공하면 목록에서 즉시 제거
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch {
      window.alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <TopNav />
      <div className="manage-layout">
        <HomeAccountCard />

        {loggedIn && (
          <ul className="manage-post-list">
            {posts.length === 0 ? (
              <p className="empty-state">아직 작성한 글이 없습니다.</p>
            ) : (
              posts.map((post) => (
                <li key={post.id} className="manage-post-row">
                  <div className="manage-post-row-top">
                    <Link href={`/posts/${post.id}`} className="manage-post-title">
                      {post.title}
                    </Link>
                    <span
                      className={
                        post.isDraft
                          ? "manage-post-badge manage-post-badge--draft"
                          : "manage-post-badge"
                      }
                    >
                      {statusLabel(post)}
                    </span>
                  </div>
                  <div className="manage-post-row-meta">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>조회 {post.viewCount}</span>
                    <button
                      type="button"
                      className="manage-post-delete"
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post.id}
                    >
                      {deletingId === post.id ? "삭제 중..." : "삭제"}
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
