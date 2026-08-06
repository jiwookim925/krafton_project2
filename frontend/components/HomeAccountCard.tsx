"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { getBlog, getCurrentUser, getPosts } from "@/lib/api";
import { Blog, Post } from "@/types/blog";
import SidebarLoginCard from "./SidebarLoginCard";
import BlogManageCard from "./BlogManageCard";

export default function HomeAccountCard() {
  // null = 아직 확인 전, true = 로그인됨, false = 로그인 안 됨
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  // 카드에 표시할 이름 - 이제 blog.title 파싱 대신 실제 로그인된 kakao_id를 씀
  const [kakaoId, setKakaoId] = useState<string>("");

  useEffect(() => {
    const token = getToken();
    const hasToken = token !== null;
    setLoggedIn(hasToken);

    if (hasToken && token) {
      // 블로그/글 데이터랑 로그인된 유저 정보(kakao_id)를 동시에 불러옴
      Promise.all([getBlog(), getPosts(), getCurrentUser(token)]).then(
        ([blogData, postsData, currentUser]) => {
          setBlog(blogData);
          setPosts(postsData);
          if (currentUser) {
            setKakaoId(currentUser.kakao_id);
          }
        }
      );
    }
  }, []);

  // 아직 로그인 여부 확인 전이면 깜빡임 방지를 위해 아무것도 안 보여줌
  if (loggedIn === null) return null;

  // 로그인 안 했으면 카카오 로그인 카드
  if (!loggedIn) return <SidebarLoginCard />;

  // 로그인은 했는데 데이터를 아직 못 받아왔으면 잠깐 대기
  if (!blog) return null;

  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);

  return (
    <BlogManageCard
      blogName={kakaoId}
      subscriberCount={0}
      totalViews={totalViews}
      visitorCount={blog.visitorCountToday}
      activeTab="blog"
    />
  );
}