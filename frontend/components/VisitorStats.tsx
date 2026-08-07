import { Blog } from "@/types/blog";

interface VisitorStatsProps {
  blog: Blog;
}

export default function VisitorStats({ blog }: VisitorStatsProps) {
  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">방문자</h2>
      <ul className="visitor-stats">
        <li className="visitor-stats-row">
          <span className="visitor-stats-label">오늘</span>
          <span className="visitor-stats-value">{blog.visitorCountToday}</span>
        </li>
        <li className="visitor-stats-row">
          <span className="visitor-stats-label">전체</span>
          <span className="visitor-stats-value">{blog.visitorCountTotal}</span>
        </li>
      </ul>
    </div>
  );
}
