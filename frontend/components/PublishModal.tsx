"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Category, PostVisibility, Tag } from "@/types/blog";
//카테고리 태그 추가
const TAGS_BY_CATEGORY: Record<string, string[]> = {
  "개발": ["django", "docker", "Python", "Next.js", "배포"],
  "일상": ["회고", "403교육동", "405교육동", "소소한행복", "오늘의기록"],
  "리뷰": ["제품리뷰", "영화리뷰", "맛집", "카페", "가성비템"],
};

interface PublishModalProps {
  categories: Category[];
  tags: Tag[];
  categoryId: number | null;
  selectedTagIds: number[];
  onClose: () => void;
  onPublish: (params: { categoryId: number; visibility: PostVisibility; tagIds: number[] }) => void;
  submitting: boolean;
}

export default function PublishModal({
  categories,
  tags,
  categoryId,
  selectedTagIds,
  onClose,
  onPublish,
  submitting,
}: PublishModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(categoryId);
  const [visibility, setVisibility] = useState<PostVisibility>("public");
  const [tagIds, setTagIds] = useState<number[]>(selectedTagIds);

  function toggleTag(id: number) {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]));
  }

  function handleSubmit() {
    if (!selectedCategoryId) return;
    onPublish({ categoryId: selectedCategoryId, visibility, tagIds });
  }

  return (
    <div className="publish-modal-backdrop" onClick={onClose}>
      <div className="publish-modal" onClick={(event) => event.stopPropagation()}>
        <div className="publish-modal-header">
          <h2>발행 설정</h2>
          <button type="button" className="icon-btn" aria-label="닫기" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="publish-modal-body">
          <div className="publish-field">
            <label className="publish-label" htmlFor="publish-category">
              카테고리
            </label>
            <select
              id="publish-category"
              className="publish-select"
              value={selectedCategoryId ?? ""}
              onChange={(event) => setSelectedCategoryId(Number(event.target.value))}
            >
              <option value="" disabled>
                카테고리 선택
              </option>
              {categories.map((category) => (
                <option key={category.id} value={Number(category.id)}>
                  {category.parentId ? `　ㄴ ${category.name}` : category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="publish-field">
            <span className="publish-label">공개 설정</span>
            <div className="publish-radio-group">
              <label className="publish-radio">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                />
                전체 공개
              </label>
              <label className="publish-radio">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "protected"}
                  onChange={() => setVisibility("protected")}
                />
                보호 (비공개 예정)
              </label>
              <label className="publish-radio">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                />
                비공개
              </label>
            </div>
          </div>

          <div className="publish-field">
            <span className="publish-label">태그</span>
            {(() => {
              const selectedCategory = categories.find(
                (category) => Number(category.id) === selectedCategoryId
              );
              const allowedNames = selectedCategory
                ? TAGS_BY_CATEGORY[selectedCategory.name]
                : undefined;
              const visibleTags = allowedNames
                ? tags.filter((tag) => allowedNames.includes(tag.name))
                : tags;

              if (visibleTags.length === 0) {
                return <p className="publish-tag-empty">등록된 태그가 없습니다.</p>;
              }

              return (
                <div className="publish-tag-list">
                  {visibleTags.map((tag) => {

                  const numericId = Number(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={
                        tagIds.includes(numericId)
                          ? "publish-tag-chip publish-tag-chip--active"
                          : "publish-tag-chip"
                      }
                      onClick={() => toggleTag(numericId)}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            );
            })()}  
          </div>
          {/* //태그 수정 */}

        </div>

        <div className="publish-modal-footer">
          <button
            type="button"
            className="publish-submit"
            disabled={!selectedCategoryId || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "발행 중..." : "공개 발행"}
          </button>
        </div>
      </div>
    </div>
  );
}
