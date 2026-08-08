import { notFound } from "next/navigation";
import Link from "next/link";
import { getPosts, getUsers } from "@/lib/api";
import TopNav from "@/components/TopNav";

interface CreatorBlogPageProps {
  params: Promise<{ userId: string }>;
}

export default async function CreatorBlogPage({ params }: CreatorBlogPageProps) {
  const { userId } = await params;
  const authorId = Number(userId);

  if (!Number.isFinite(authorId)) {
    notFound();
  }

  const [users, posts] = await Promise.all([
    getUsers(),
    getPosts({ authorId }),
  ]);

  const owner = users.find((user) => user.id === authorId);

  if (!owner) {
    notFound();
  }

  return (
    <div className="page">
      <TopNav />
      <main className="my-blog-page">
        <header className="my-blog-header">
          <h1>{owner.nickname} 님의 블로그</h1>
        </header>

        <section className="my-blog-layout">
          <div className="my-blog-main">
            <p className="my-blog-count">
              전체 글 <strong>{posts.length}</strong>
            </p>

            {posts.length === 0 ? (
              <div className="my-blog-empty">
                <h2>아직 작성된 글이 없어요.</h2>
              </div>
            ) : (
              <ul className="my-blog-post-list">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.id}`}
                      style={{ display: "block", color: "inherit", textDecoration: "none" }}
                    >
                      <h2>{post.title}</h2>
                      <p>{post.summary}</p>
                      <div>
                        <span>조회 {post.viewCount}</span>
                        <span>공감 {post.sympathyCount}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="my-blog-sidebar">
            <div className="my-blog-profile">
              <div className="my-blog-avatar">
                {owner.avatar ? <img src={owner.avatar} alt="" /> : <span>{owner.nickname[0]}</span>}
              </div>

              <h2>{owner.nickname}</h2>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
