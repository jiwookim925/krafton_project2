"use client";

import { useEffect, useState } from "react";
import { getMyBlog, getMyPosts } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Blog, Post } from "@/types/blog";

export default function MyBlogPage() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([getMyBlog(token), getMyPosts(token)])
      .then(([blogData, postData]) => {
        setBlog(blogData);
        setPosts(postData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="my-blog-page">불러오는 중...</main>;
  }

  if (!blog) {
    return <main className="my-blog-page">로그인이 필요합니다.</main>;
  }

  return (
    <main className="my-blog-page">
      <header className="my-blog-header">
        <h1>{blog.title}</h1>
        <div className="my-blog-search">
          <input placeholder="Search..." />
          <span>⌕</span>
        </div>
      </header>

      <section className="my-blog-layout">
        <div className="my-blog-main">
          <p className="my-blog-count">
            전체 글 <strong>{posts.length}</strong>
          </p>

          {posts.length === 0 ? (
            <div className="my-blog-empty">
              <h2>아직 작성하신 글이 없어요.</h2>
              <p>내 블로그의 첫 시작이 될 오늘의 기록을 남겨보세요!</p>
              <button type="button">글쓰기</button>
            </div>
          ) : (
            <ul className="my-blog-post-list">
              {posts.map((post) => (
                <li key={post.id}>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <div>
                    <span>조회 {post.viewCount}</span>
                    <span>공감 {post.sympathyCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="my-blog-sidebar">
          <div className="my-blog-profile">
            <div className="my-blog-avatar">
              {blog.avatar ? <img src={blog.avatar} alt="" /> : <span>t</span>}
            </div>

            <h2>{blog.title}</h2>
            <p>{blog.description}</p>

            <div className="my-blog-actions">
              <button type="button">글쓰기</button>
              <button type="button">블로그 관리</button>
            </div>
          </div>

          <div className="my-blog-side-section">
            <p>분류 전체보기 ({blog.postCount ?? posts.length})</p>
          </div>

          <div className="my-blog-side-section">
            <p>Tag</p>
          </div>

          <div className="my-blog-side-section">
            <p>최근글 · 인기글</p>
          </div>

          <div className="my-blog-side-section">
            <p>최근댓글</p>
          </div>

          <div className="my-blog-side-section">
            <p>공지사항</p>
          </div>

          <div className="my-blog-side-section">
            <p>Facebook · Twitter</p>
          </div>
        </aside>
      </section>
    </main>
  );
}