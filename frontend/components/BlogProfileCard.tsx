"use client";

import Image from "next/image";
import { useState } from "react";
import { Blog, User } from "@/types/blog";

interface BlogProfileCardProps {
  blog: Blog;
  owner?: User;
  postCount: number;
}

export default function BlogProfileCard({ blog, owner, postCount }: BlogProfileCardProps) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="profile-card">
      {owner && (
        <div className="profile-avatar">
          <Image src={owner.avatar} alt={owner.nickname} fill sizes="72px" />
        </div>
      )}
      <p className="profile-name">{blog.title}</p>
      <p className="profile-desc">{blog.description}</p>
      <p className="profile-post-count">글 {postCount}개</p>
      <button
        type="button"
        className={
          subscribed ? "profile-subscribe profile-subscribe--active" : "profile-subscribe"
        }
        onClick={() => setSubscribed((prev) => !prev)}
      >
        {subscribed ? "구독중" : "+ 구독"}
      </button>
    </div>
  );
}
