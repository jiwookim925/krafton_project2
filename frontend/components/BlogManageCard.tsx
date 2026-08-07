import Link from "next/link";
import { ChevronDown, ChevronRight, Grip, Wallet } from "lucide-react";

interface BlogManageCardProps {
  blogName: string;
  subscriberCount: number;
  // 전체 글 조회수 합계 (app/manage/page.tsx에서 posts 다 더해서 계산해서 넘겨줌)
  totalViews: number;
  visitorCount: number;
  // 지금 어떤 탭이 활성화되어 있는지 (글쓰기/내 블로그/관리 중 하나, "none"이면 아무것도 강조 안 함)
  activeTab: "write" | "blog" | "manage" | "none";
}

export default function BlogManageCard({
  blogName,
  subscriberCount,
  totalViews,
  visitorCount,
  activeTab,
}: BlogManageCardProps) {
  return (
    <div className="manage-card">
      {/* 상단: 블로그 아바타 + 이름 + 구독자 수 (전체가 블로그 홈으로 가는 링크) */}
      <Link href="/" className="manage-header">
        <div className="manage-avatar">
          <Grip size={18} />
        </div>
        <div className="manage-header-text">
          <p className="manage-blog-name">{blogName} 님의 블로그</p>
          <p className="manage-subscriber">구독자 {subscriberCount}명</p>
        </div>
        <ChevronDown size={18} className="manage-chevron" />
      </Link>

      {/* 글쓰기 / 내 블로그 / 관리 탭 - activeTab이랑 이름 같은 것만 강조 스타일 적용 */}
      <div className="manage-tabs">
        <Link
          href="/write"
          className={
            activeTab === "write" ? "manage-tab manage-tab--active" : "manage-tab"
          }
        >
          글쓰기
        </Link>
        <Link
          href="/my-blog"
          className={
            activeTab === "blog" ? "manage-tab manage-tab--active" : "manage-tab"
          }
        >
          내 블로그
        </Link>
        <Link
          href="/manage"
          className={
            activeTab === "manage" ? "manage-tab manage-tab--active" : "manage-tab"
          }
        >
          관리
        </Link>
      </div>

      {/* 조회수/방문자/수익 통계 3줄 */}
      <ul className="manage-stats">
        <li className="manage-stat-row">
          <span className="manage-stat-label">조회수</span>
          <span className="manage-stat-value">
            {totalViews}회
            <ChevronRight size={16} />
          </span>
        </li>
        <li className="manage-stat-row">
          <span className="manage-stat-label">방문자</span>
          <span className="manage-stat-value">
            {visitorCount}명
            <ChevronRight size={16} />
          </span>
        </li>
        <li className="manage-stat-row">
          {/* 수익은 실제 계산 로직이 없어서 고정 텍스트로만 표시 */}
          <span className="manage-stat-label">수익</span>
          <span className="manage-stat-value">
            <Wallet size={16} />내 수익 예측해보기
            <ChevronRight size={16} />
          </span>
        </li>
      </ul>
    </div>
  );
}