"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { getMyPostsByAuthor } from "@/lib/api";
import { Post } from "@/types/blog";
import TopNav from "@/components/TopNav";
import HomeAccountCard from "@/components/HomeAccountCard";

// 로그인 유저와 블로그 소유자를 잇는 실제 연결이 없어서 다른 화면들과 마찬가지로 1번 유저로 고정
const CURRENT_AUTHOR_ID = 1;

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

  useEffect(() => {
    const hasToken = getToken() !== null;
    setLoggedIn(hasToken);

    if (hasToken) {
      getMyPostsByAuthor(CURRENT_AUTHOR_ID).then(setPosts);
    }
  }, []);

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
