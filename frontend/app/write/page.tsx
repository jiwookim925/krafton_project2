"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { createPost, getCategories, getTags } from "@/lib/api";
import { Category, PostVisibility, Tag } from "@/types/blog";
import TopNav from "@/components/TopNav";
import WriteEditorToolbar from "@/components/WriteEditorToolbar";
import PublishModal from "@/components/PublishModal";
import SidebarLoginCard from "@/components/SidebarLoginCard";

// 이 데모에는 로그인 유저(카카오)와 블로그 소유자(더미 users 테이블)를 잇는 실제 연결이 없어서
// 지금까지의 화면(HomeAccountCard, AccountMenu)과 마찬가지로 "내 블로그" = 1번 유저(네온)로 고정
const CURRENT_AUTHOR_ID = 1;

function deriveSummary(content: string) {
  const plain = content
    .replace(/^##\s*/gm, "")
    .replace(/[*_`>~-]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return plain.length > 80 ? `${plain.slice(0, 80)}...` : plain;
}

export default function WritePage() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const token = getToken();
    setLoggedIn(token !== null);
    setChecked(true);

    Promise.all([getCategories(), getTags()]).then(([categoryData, tagData]) => {
      setCategories(categoryData);
      setTags(tagData);
    });
  }, []);

  function handleInsert(before: string, after = "", placeholder = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;

    setContent(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + before.length + selected.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function handleSaveDraft() {
    if (!title.trim() && !content.trim()) {
      setError("제목이나 내용을 입력한 뒤 임시저장해주세요.");
      return;
    }

    setSavingDraft(true);
    setError(null);
    setMessage(null);

    try {
      await createPost({
        title: title.trim() || "제목 없음",
        summary: deriveSummary(content),
        content,
        thumbnail: `https://picsum.photos/seed/write-${Date.now()}/800/450`,
        authorId: CURRENT_AUTHOR_ID,
        categoryId: categories[0] ? Number(categories[0].id) : 1,
        tagIds: [],
        visibility: "private",
        isDraft: true,
      });
      setMessage("임시저장되었습니다.");
    } catch {
      setError("임시저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSavingDraft(false);
    }
  }

  function handleOpenPublish() {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    setError(null);
    setShowPublishModal(true);
  }

  async function handlePublish(params: {
    categoryId: number;
    visibility: PostVisibility;
    tagIds: number[];
  }) {
    setSubmitting(true);
    setError(null);

    try {
      const post = await createPost({
        title: title.trim(),
        summary: deriveSummary(content),
        content,
        thumbnail: `https://picsum.photos/seed/write-${Date.now()}/800/450`,
        authorId: CURRENT_AUTHOR_ID,
        categoryId: params.categoryId,
        tagIds: params.tagIds,
        visibility: params.visibility,
        isDraft: false,
      });
      router.push(`/posts/${post.id}`);
    } catch {
      setError("발행에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  if (checked && !loggedIn) {
    return (
      <div className="page">
        <TopNav />
        <div className="write-guard">
          <p className="write-guard-text">글을 쓰려면 로그인이 필요합니다.</p>
          <SidebarLoginCard />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopNav />
      {checked && (
        <>
          <div className="write-layout">
            <header className="write-top-bar">
              <Link href="/" className="write-back">
                내 블로그
              </Link>
              <div className="write-top-actions">
                {message && <span className="write-message">{message}</span>}
                <button
                  type="button"
                  className="write-save-btn"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                >
                  {savingDraft ? "저장 중..." : "임시저장"}
                </button>
                <button type="button" className="write-publish-btn" onClick={handleOpenPublish}>
                  발행
                </button>
              </div>
            </header>

            {error && <p className="write-error">{error}</p>}

            <input
              type="text"
              className="write-title-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <WriteEditorToolbar onInsert={handleInsert} />

            <textarea
              ref={textareaRef}
              className="write-content-textarea"
              placeholder="본문을 입력하세요."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          {showPublishModal && (
            <PublishModal
              categories={categories}
              tags={tags}
              categoryId={categories[0] ? Number(categories[0].id) : null}
              selectedTagIds={[]}
              submitting={submitting}
              onClose={() => setShowPublishModal(false)}
              onPublish={handlePublish}
            />
          )}
        </>
      )}
    </div>
  );
}
