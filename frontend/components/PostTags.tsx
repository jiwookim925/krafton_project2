import Link from "next/link";
import { Tag } from "@/types/blog";

interface PostTagsProps {
  tags: Tag[];
}

export default function PostTags({ tags }: PostTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className="post-tags">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link href={`/search?q=${encodeURIComponent(tag.name)}`} className="post-tag">
            #{tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
