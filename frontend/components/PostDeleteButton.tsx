"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { deletePost, getCurrentUser } from "@/lib/api";

interface PostDeleteButtonProps {
  postId: number;
  authorId: number;
}

// 상세페이지에서 "지금 로그인한 사람이 이 글의 작성자일 때만" 보이는 삭제 버튼.
// 상세페이지는 서버 컴포넌트라 토큰을 못 읽으므로, 이 클라이언트 컴포넌트가 로그인 여부/작성자 여부를 확인함.
export default function PostDeleteButton({ postId, authorId }: PostDeleteButtonProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // 토큰으로 내 정보를 받아와 작성자 id와 같은지 확인
    getCurrentUser(token).then((me) => {
      if (me && me.id === authorId) {
        setIsOwner(true);
      }
    });
  }, [authorId]);

  async function handleDelete() {
    const token = getToken();
    if (!token) return;
    if (!window.confirm("이 글을 삭제할까요? 되돌릴 수 없습니다.")) return;

    setDeleting(true);
    try {
      await deletePost(postId, token);
      // 삭제 후 홈으로 이동(목록 갱신)
      router.push("/");
      router.refresh();
    } catch {
      window.alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setDeleting(false);
    }
  }

  // 작성자가 아니면 아무것도 렌더하지 않음
  if (!isOwner) return null;

  return (
    <button
      type="button"
      className="post-delete-btn"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? "삭제 중..." : "글 삭제"}
    </button>
  );
}
