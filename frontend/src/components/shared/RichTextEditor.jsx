import { useState } from "react";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Escriba aquí...",
  minHeight = "16rem",
}) => {
  const [content, setContent] = useState("");

  const handleInput = (e) => {
    const htmlContent = e.currentTarget.innerHTML;
    setContent(htmlContent);
    if (onChange) {
      onChange(htmlContent);
    }
  };

  const execCommand = (command) => {
    document.execCommand(command, false, null);
  };

  // Iconos SVG
  const icons = {
    bold: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      </svg>
    ),
    italic: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
      </svg>
    ),
    underline: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
        <line x1="4" y1="21" x2="20" y2="21" />
      </svg>
    ),
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-primary-500">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Negrita (Ctrl+B)"
        >
          {icons.bold}
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Cursiva (Ctrl+I)"
        >
          {icons.italic}
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Subrayado (Ctrl+U)"
        >
          {icons.underline}
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        onInput={handleInput}
        className="w-full p-4 focus:outline-none"
        style={{ whiteSpace: "pre-wrap", minHeight }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
