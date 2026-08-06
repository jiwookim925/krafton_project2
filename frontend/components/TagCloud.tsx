import Link from "next/link";
import { Tag } from "@/types/blog";

interface TagCloudProps {
  tags: Tag[];
}

export default function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">태그</h2>
      {tags.length === 0 ? (
        <p className="empty-state">등록된 태그가 없습니다.</p>
      ) : (
        <div className="tag-cloud">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?q=${encodeURIComponent(tag.name)}`}
              className="tag-cloud-chip"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
