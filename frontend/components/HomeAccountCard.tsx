"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { getBlog, getPosts } from "@/lib/api";
import { Blog, Post } from "@/types/blog";
import SidebarLoginCard from "./SidebarLoginCard";
import BlogManageCard from "./BlogManageCard";

export default function HomeAccountCard() {
  // null = 아직 확인 전, true = 로그인됨, false = 로그인 안 됨
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = getToken();
    const hasToken = token !== null;
    setLoggedIn(hasToken);

    // 로그인 상태일 때만 블로그 관리 카드에 쓸 데이터를 불러옴
    if (hasToken) {
      Promise.all([getBlog(), getPosts()]).then(([blogData, postsData]) => {
        setBlog(blogData);
        setPosts(postsData);
      });
    }
  }, []);

  // 아직 로그인 여부 확인 전이면 깜빡임 방지를 위해 아무것도 안 보여줌
  if (loggedIn === null) return null;

  // 로그인 안 했으면 카카오 로그인 카드
  if (!loggedIn) return <SidebarLoginCard />;

  // 로그인은 했는데 블로그/글 데이터를 아직 못 받아왔으면 잠깐 대기
  if (!blog) return null;

  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);

  // 로그인했으면 블로그 관리 카드 (홈 화면이니까 "내 블로그" 탭을 활성 표시)
  return (
    <BlogManageCard
      blogName={blog.title.replace("의 개발 일지", "")}
      subscriberCount={0}
      totalViews={totalViews}
      visitorCount={blog.visitorCountToday}
      activeTab="blog"
    />
  );
}