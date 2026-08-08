"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/types/blog";

interface HeroCarouselProps {
  posts: Post[];
  authorMap: Record<number, string>;
}

export default function HeroCarousel({ posts, authorMap }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const post = posts[index];

  // 슬라이드가 2개 이상이면 4초마다 자동으로 다음 글로 넘어감
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (!post) return null;

  return (
    <div className="hero">
      {/* 슬라이드를 옆으로 전부 나열해두고, translateX로 트랙 자체를 밀어서 넘기는 방식 */}
      <div
        className="hero-track"
        style={{
          width: `${posts.length * 100}%`,
          transform: `translateX(-${index * (100 / posts.length)}%)`,
        }}
      >
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/posts/${p.id}`}
            className="hero-image"
            style={{ width: `${100 / posts.length}%` }}
          >
            <Image
              src={p.thumbnail || `https://picsum.photos/seed/hero-${p.id}/800/450`}
              alt={p.title}
              fill
              sizes="(max-width: 900px) 100vw, 760px"
              priority={p.id === post.id}
            />
            <span className="hero-badge">오늘의 티스토리</span>
            <div className="hero-caption">
              <p className="hero-title">&ldquo; {p.title}</p>
              <div className="hero-author">
                <span className="hero-avatar" />
                <span>{authorMap[p.authorId] ?? ""}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="hero-dots">
        {posts.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`${i + 1}번째 슬라이드`}
            className={i === index ? "hero-dot hero-dot--active" : "hero-dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}