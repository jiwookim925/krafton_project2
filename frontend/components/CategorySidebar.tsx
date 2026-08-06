import Link from "next/link";
import { Category, CategoryNode } from "@/types/blog";

interface CategorySidebarProps {
  categories: Category[];
  activeSlug?: string;
  totalCount: number;
}

function buildTree(categories: Category[]): CategoryNode[] {
  const nodes: Record<number, CategoryNode> = {};
  categories.forEach((category) => {
    nodes[category.id] = { ...category, children: [] };
  });

  const roots: CategoryNode[] = [];
  categories.forEach((category) => {
    const node = nodes[category.id];
    if (category.parentId && nodes[category.parentId]) {
      nodes[category.parentId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function CategorySidebar({
  categories,
  activeSlug,
  totalCount,
}: CategorySidebarProps) {
  const tree = buildTree(categories);

  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">분류 전체보기</h2>
      <ul className="category-sidebar-list">
        <li className="category-sidebar-item">
          <Link
            href="/"
            className={
              !activeSlug
                ? "category-sidebar-link category-sidebar-link--active"
                : "category-sidebar-link"
            }
          >
            전체보기
          </Link>
          <span className="category-sidebar-count">({totalCount})</span>
        </li>
        {tree.map((category) => (
          <li key={category.id} className="category-sidebar-item">
            <Link
              href={`/?category=${category.slug}`}
              className={
                category.slug === activeSlug
                  ? "category-sidebar-link category-sidebar-link--active"
                  : "category-sidebar-link"
              }
            >
              {category.name}
            </Link>
            <span className="category-sidebar-count">({category.postCount})</span>
            {category.children.length > 0 && (
              <ul className="category-sidebar-children">
                {category.children.map((child) => (
                  <li key={child.id} className="category-sidebar-item">
                    <Link
                      href={`/?category=${child.slug}`}
                      className={
                        child.slug === activeSlug
                          ? "category-sidebar-link category-sidebar-link--active"
                          : "category-sidebar-link"
                      }
                    >
                      {child.name}
                    </Link>
                    <span className="category-sidebar-count">({child.postCount})</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
