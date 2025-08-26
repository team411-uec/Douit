import React from "react";
import { Pencil2Icon } from "@radix-ui/react-icons";

type CreateSuggestionButtonProps = {
  /** ボタンがクリックされたときに実行される関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
};

const CreateSuggestionButton = ({
  onClick,
  disabled = false,
}: CreateSuggestionButtonProps) => {
  const buttonStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px", // アイコンとテキストの間隔
    padding: "10px 16px",
    fontSize: "16px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
  };

  return (
    <button style={buttonStyles} onClick={onClick} disabled={disabled}>
      <Pencil2Icon width="18" height="18" />
      <span>編集提案を作成</span>
    </button>
  );
};

export default CreateSuggestionButton;
