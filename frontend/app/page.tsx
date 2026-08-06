import { getBlog, getCategories, getPosts, getTags, getUsers } from "@/lib/api";
import TopNav from "@/components/TopNav";
import BlogHeader from "@/components/BlogHeader";
import CategoryTabs from "@/components/CategoryTabs";
import PostCard from "@/components/PostCard";
import HomeAccountCard from "@/components/HomeAccountCard";
import BlogProfileCard from "@/components/BlogProfileCard";
import CategorySidebar from "@/components/CategorySidebar";
import TagCloud from "@/components/TagCloud";
import RecentFeed from "@/components/RecentFeed";
import VisitorStats from "@/components/VisitorStats";

interface HomePageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

  const [blog, categories, tags, users, allPosts] = await Promise.all([
    getBlog(),
    getCategories(),
    getTags(),
    getUsers(),
    getPosts(),
  ]);

  const activeCategory = categories.find(
    (category) => category.slug === resolvedSearchParams.category
  );

  const posts = await getPosts({
    categoryId: activeCategory ? Number(activeCategory.id) : undefined,
    query: resolvedSearchParams.q,
  });

  const owner = users.find((user) => Number(user.id) === blog.ownerId);

  const categoryMap: Record<number, string> = {};
  categories.forEach((category) => {
    categoryMap[category.id] = category.name;
  });

  const authorMap: Record<number, string> = {};
  users.forEach((user) => {
    authorMap[user.id] = user.nickname;
  });

  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="page">
      <TopNav />
      <div className="content-layout">
        <main className="content-main">
          <BlogHeader blog={blog} postCount={allPosts.length} />
          <CategoryTabs categories={categories} activeSlug={resolvedSearchParams.category} />
          {posts.length === 0 ? (
            <p className="empty-state">조건에 맞는 글이 없습니다.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  categoryName={categoryMap[post.categoryId] ?? ""}
                  authorNickname={authorMap[post.authorId] ?? ""}
                />
              ))}
            </div>
          )}
        </main>
        <aside className="content-sidebar">
          <HomeAccountCard />
          <BlogProfileCard blog={blog} owner={owner} postCount={allPosts.length} />
          <CategorySidebar
            categories={categories}
            activeSlug={resolvedSearchParams.category}
            totalCount={allPosts.length}
          />
          <TagCloud tags={tags} />
          <RecentFeed posts={recentPosts} />
          <VisitorStats blog={blog} />
        </aside>
      </div>
    </div>
  );
}
