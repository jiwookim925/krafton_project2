"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";
import { getCurrentUser, getMyBlog, getMyPosts } from "@/lib/api";
import { Blog, Post } from "@/types/blog";
import SidebarLoginCard from "./SidebarLoginCard";
import BlogManageCard from "./BlogManageCard";

// 이 카드가 렌더링되는 경로 기준으로 글쓰기/내 블로그/관리 중 활성 탭을 결정.
// 홈("/") 등 세 페이지가 아닌 곳에서는 어떤 탭도 활성화하지 않음("none")
function tabForPathname(pathname: string): "write" | "blog" | "manage" | "none" {
  if (pathname === "/write") return "write";
  if (pathname === "/manage") return "manage";
  if (pathname === "/my-blog") return "blog";
  return "none";
}

export default function HomeAccountCard() {
  const pathname = usePathname();

  // null = 아직 확인 전, true = 로그인됨, false = 로그인 안 됨
  // "카드를 보여줄지 말지"는 오직 이 값 하나로만 결정함
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // 아래 값들은 카드 안의 숫자를 채우는 용도일 뿐, 못 받아와도 카드 자체는 그대로 보여줌
  const [nickname, setNickname] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
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
          setNickname(currentUser.nickname ?? String(currentUser.kakao_id));
          setAvatarUrl(currentUser.profile_image);
        }
      })
      .catch((error) => {
        console.error("로그인 유저 정보를 불러오지 못했습니다:", error);
      });

    // 내 블로그 정보(로그인 필요) - 실패해도 카드는 뜨고, 숫자만 기본값(0)으로 남음
    getMyBlog(token)
      .then(setBlog)
      .catch((error) => {
        console.error("내 블로그 정보를 불러오지 못했습니다:", error);
      });

    // 내가 쓴 글 목록(로그인 필요) - 마찬가지로 실패해도 조회수만 0으로 남음
    getMyPosts(token)
      .then(setPosts)
      .catch((error) => {
        console.error("내 글 목록을 불러오지 못했습니다:", error);
      });
  }, []);

  // 아직 로그인 여부 확인 전이면 깜빡임 방지를 위해 아무것도 안 보여줌
  if (loggedIn === null) return null;

  // 로그인 안 했으면 카카오 로그인 카드
  if (!loggedIn) return <SidebarLoginCard />;

  // 여기부터는 로그인된 상태 - blog/posts가 아직 안 왔어도 카드는 바로 보여줌
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const visitorCount = blog?.visitorCountToday ?? 0;

  // 로그인했으면 블로그 관리 카드 (현재 경로에 맞는 탭을 활성 표시)
  return (
    <BlogManageCard
      blogName={nickname}
      avatarUrl={avatarUrl}
      subscriberCount={0}
      totalViews={totalViews}
      visitorCount={visitorCount}
      activeTab={tabForPathname(pathname)}
    />
  );
}