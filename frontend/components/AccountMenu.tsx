"use client";

import Link from "next/link";
// import { useRouter } from "next/navigation";
import { LayoutGrid, Pencil, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clearToken } from "@/lib/auth";
import { AuthUser } from "@/types/auth";

interface AccountMenuProps {
  // 이제 유저 정보는 하드코딩이 아니라 TopNav가 실제 로그인 상태를 확인한 뒤 넘겨줌
  user: AuthUser;
}

export default function AccountMenu({ user }: AccountMenuProps) {
  // const router = useRouter();
  // 드롭다운 열림/닫힘 상태
  const [open, setOpen] = useState(false);
  // 드롭다운 바깥 클릭 감지용 ref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 카카오 닉네임 동의 안 했으면 kakao_id로 폴백
  const displayName = user.nickname ?? String(user.kakao_id);

  // TODO: 운영중인 블로그 목록도 실제 API가 생기면 여기 하드코딩 대신 props로 받기
  const ownedBlogs = [{ id: 1, name: `${displayName}님의 블로그` }];

  useEffect(() => {
    // 드롭다운 영역 바깥을 클릭하면 자동으로 닫히게 하는 이벤트 리스너
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 로그아웃 버튼 클릭 시: 저장된 토큰 지우고 홈으로 이동 + 새로고침해서 상태 초기화
  function handleLogout() {
    clearToken();
    window.location.href = "/";
  }

  return (
    <div className="account-menu-wrap" ref={wrapperRef}>
      <button
        type="button"
        className="avatar-btn"
        aria-label="전체 메뉴"
        onClick={() => setOpen((prev) => !prev)}
      >
        <LayoutGrid size={16} />
      </button>

      {open && (
        <div className="account-dropdown">
          <div className="account-profile">
            <div>
              <p className="account-nickname">{displayName}</p>
            </div>
            <Link href="/account" className="account-manage-link">
              계정관리
            </Link>
          </div>

          <div className="account-divider" />

          <p className="account-blogs-label">운영중인 블로그</p>
          <ul className="account-blog-list">
            {ownedBlogs.map((blog) => (
              <li key={blog.id} className="account-blog-row">
                <Link href="/" className="account-blog-name">
                  {blog.name}
                </Link>
                <span className="account-blog-actions">
                  <Link href="/write" aria-label="글쓰기">
                    <Pencil size={16} />
                  </Link>
                  <Link href="/manage" aria-label="블로그 관리">
                    <Settings size={16} />
                  </Link>
                </span>
              </li>
            ))}
          </ul>

          <div className="account-divider" />

          {/* 이제 실제로 로그아웃 동작함 */}
          <button type="button" className="account-logout" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}