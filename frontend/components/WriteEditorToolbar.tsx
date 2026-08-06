import { Bold, Code, Heading2, Italic, Link2, List, Quote, Strikethrough } from "lucide-react";

interface WriteEditorToolbarProps {
  onInsert: (before: string, after?: string, placeholder?: string) => void;
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

export default function WriteEditorToolbar({ onInsert }: WriteEditorToolbarProps) {
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
    </div>
  );
}
