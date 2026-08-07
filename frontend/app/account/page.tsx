"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grip } from "lucide-react";
import { getToken } from "@/lib/auth";
import { getBlog, getUsers } from "@/lib/api";
import { Blog, User } from "@/types/blog";
import TopNav from "@/components/TopNav";
import SidebarLoginCard from "@/components/SidebarLoginCard";

// 로그인 유저와 블로그 소유자를 잇는 실제 연결이 없어서 write/manage 화면과 마찬가지로 1번 유저로 고정
const CURRENT_AUTHOR_ID = 1;

export default function AccountPage() {
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [emailOptIn, setEmailOptIn] = useState(true);

  useEffect(() => {
    const hasToken = getToken() !== null;
    setLoggedIn(hasToken);
    setChecked(true);

    if (hasToken) {
      Promise.all([getBlog(), getUsers()]).then(([blogData, users]) => {
        setBlog(blogData);
        setOwner(users.find((user) => Number(user.id) === CURRENT_AUTHOR_ID) ?? null);
      });
    }
  }, []);

  if (checked && !loggedIn) {
    return (
      <div className="page">
        <TopNav />
        <div className="write-guard">
          <p className="write-guard-text">계정관리는 로그인 후 이용할 수 있습니다.</p>
          <SidebarLoginCard />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopNav />
      {checked && blog && owner && (
        <div className="acct-layout">
          <aside className="acct-sidebar">
            <div className="acct-profile">
              <Image
                src={owner.avatar}
                alt=""
                width={100}
                height={100}
                className="acct-avatar"
              />
              <p className="acct-profile-name">{owner.nickname}</p>
              <p className="acct-profile-email">{owner.email}</p>
            </div>

            <nav className="acct-nav">
              <Link href="/account" className="acct-nav-item acct-nav-item--active">
                내 블로그
              </Link>
              <div className="acct-nav-group">
                <span className="acct-nav-group-title">내 계정</span>
                <span className="acct-nav-sub">프로필 레이어</span>
                <span className="acct-nav-sub">계정 이용</span>
              </div>
              <span className="acct-nav-item">외부 기능</span>
            </nav>
          </aside>

          <main className="acct-main">
            <section className="acct-section">
              <h2 className="acct-section-title">운영 중인 블로그</h2>
              <div className="acct-card">
                <div className="acct-blog-row">
                  <div className="acct-blog-thumb">
                    <Grip size={22} />
                  </div>
                  <div className="acct-blog-info">
                    <Link href="/" className="acct-blog-name">
                      {owner.nickname} 님의 블로그
                    </Link>
                    <span className="acct-blog-url">{owner.username}.t-story.com</span>
                  </div>
                  <span className="acct-badge">대표</span>
                </div>
                <div className="acct-card-footer">
                  <p className="acct-help-text">
                    대표 블로그는 방문한 블로그/팀블로그 활동 시 사용됩니다.
                  </p>
                  <button type="button" className="acct-save-btn">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </section>

            <section className="acct-section">
              <h2 className="acct-section-title">운영·개설 현황</h2>
              <div className="acct-card">
                <ul className="acct-stat-list">
                  <li className="acct-stat-row">
                    <p className="acct-stat-title">
                      <span className="acct-stat-num">4개</span>의 블로그를 더 운영할 수 있습니다.
                    </p>
                    <span className="acct-stat-side">운영 중인 블로그 1개</span>
                  </li>
                  <li className="acct-stat-row">
                    <p className="acct-stat-title">
                      블로그 개설 가능 횟수가 <span className="acct-stat-num">9회</span> 남았습니다.
                    </p>
                    <span className="acct-stat-side">과거 개설 횟수 1회</span>
                  </li>
                </ul>
                <div className="acct-card-footer">
                  <span />
                  <button type="button" className="acct-save-btn">
                    새 블로그 만들기
                  </button>
                </div>
              </div>
            </section>

            <section className="acct-section">
              <h2 className="acct-section-title">이메일 알림</h2>
              <div className="acct-card">
                <div className="acct-email-row">
                  서비스 관련 소식 및 마케팅 메일을
                  <select
                    className="acct-select"
                    value={emailOptIn ? "true" : "false"}
                    onChange={(event) => setEmailOptIn(event.target.value === "true")}
                  >
                    <option value="true">수신합니다.</option>
                    <option value="false">수신하지 않습니다.</option>
                  </select>
                </div>
                <div className="acct-card-footer">
                  <span />
                  <button type="button" className="acct-save-btn">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </section>

            <p className="acct-quit">
              티스토리에서 <span className="acct-quit-link">탈퇴하기</span>
            </p>
          </main>
        </div>
      )}
    </div>
  );
}
