"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { getBlog, getCurrentUser, getPosts } from "@/lib/api";
import { Blog, Post } from "@/types/blog";
import SidebarLoginCard from "./SidebarLoginCard";
import BlogManageCard from "./BlogManageCard";

export default function HomeAccountCard() {
  // null = 아직 확인 전, true = 로그인됨, false = 로그인 안 됨
  // "카드를 보여줄지 말지"는 오직 이 값 하나로만 결정함
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // 아래 값들은 카드 안의 숫자를 채우는 용도일 뿐, 못 받아와도 카드 자체는 그대로 보여줌
  const [kakaoId, setKakaoId] = useState<string>("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = getToken();
    const hasToken = token !== null;
    // 로그인 여부는 토큰이 있냐 없냐로 바로 결정 - 다른 데이터 기다릴 필요 없음
    setLoggedIn(hasToken);

    if (!hasToken || !token) {
      return;
    }

    // 로그인 유저 정보(진짜 백엔드, JWT) - 실패하면 콘솔에만 로그 남기고 카드는 그대로 유지
    getCurrentUser(token)
      .then((currentUser) => {
        if (currentUser) {
          setKakaoId(currentUser.kakao_id);
        }
      })
      .catch((error) => {
        console.error("로그인 유저 정보를 불러오지 못했습니다:", error);
      });

    // 블로그 정보(더미 API) - 실패해도 카드는 뜨고, 숫자만 기본값(0)으로 남음
    getBlog()
      .then(setBlog)
      .catch((error) => {
        console.error("블로그 정보를 불러오지 못했습니다 (json-server 확인):", error);
      });

    // 글 목록(더미 API) - 마찬가지로 실패해도 조회수만 0으로 남음
    getPosts()
      .then(setPosts)
      .catch((error) => {
        console.error("글 목록을 불러오지 못했습니다 (json-server 확인):", error);
      });
  }, []);

  // 아직 로그인 여부 확인 전이면 깜빡임 방지를 위해 아무것도 안 보여줌
  if (loggedIn === null) return null;

  // 로그인 안 했으면 카카오 로그인 카드
  if (!loggedIn) return <SidebarLoginCard />;

  // 여기부터는 로그인된 상태 - blog/posts가 아직 안 왔어도 카드는 바로 보여줌
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const visitorCount = blog?.visitorCountToday ?? 0;

  return (
    <BlogManageCard
      blogName={kakaoId}
      subscriberCount={0}
      totalViews={totalViews}
      visitorCount={visitorCount}
      activeTab="blog"
    />
  );
}