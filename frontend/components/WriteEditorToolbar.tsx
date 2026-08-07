import { Bold, Code, Heading2, Image as ImageIcon, Italic, Link2, List, Quote, Strikethrough } from "lucide-react";

interface WriteEditorToolbarProps {
  onInsert: (before: string, after?: string, placeholder?: string) => void;
  // 이미지 버튼 클릭 시 호출(파일 선택창 열기). 부모(write 페이지)가 업로드를 처리함
  onImage?: () => void;
  // 업로드 진행 중이면 버튼 비활성화
  imageUploading?: boolean;
}

const TOOLS = [
  { icon: Heading2, label: "제목", before: "## ", after: "" },
  { icon: Bold, label: "굵게", before: "**", after: "**", placeholder: "굵은 텍스트" },
  { icon: Italic, label: "기울임", before: "*", after: "*", placeholder: "기울임 텍스트" },
  { icon: Strikethrough, label: "취소선", before: "~~", after: "~~", placeholder: "취소선 텍스트" },
  { icon: Quote, label: "인용구", before: "> ", after: "" },
  { icon: List, label: "목록", before: "- ", after: "" },
  { icon: Link2, label: "링크", before: "[", after: "](https://)" },
  { icon: Code, label: "코드", before: "`", after: "`", placeholder: "code" },
];

export default function WriteEditorToolbar({ onInsert, onImage, imageUploading }: WriteEditorToolbarProps) {
  return (
    <div className="write-toolbar">
      {TOOLS.map(({ icon: Icon, label, before, after, placeholder }) => (
        <button
          key={label}
          type="button"
          className="write-toolbar-btn"
          title={label}
          aria-label={label}
          onClick={() => onInsert(before, after, placeholder)}
        >
          <Icon size={18} />
        </button>
      ))}
      {onImage && (
        <button
          type="button"
          className="write-toolbar-btn"
          title={imageUploading ? "업로드 중..." : "이미지"}
          aria-label="이미지"
          onClick={onImage}
          disabled={imageUploading}
        >
          <ImageIcon size={18} />
        </button>
      )}
    </div>
  );
}
