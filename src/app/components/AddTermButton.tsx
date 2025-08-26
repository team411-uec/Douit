import React from "react";

// このコンポーネントが受け取るpropsの型を定義します
type AddTermButtonProps = {
  /** ボタンがクリックされたときに実行される関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
};

const AddTermButton = ({ onClick, disabled = false }: AddTermButtonProps) => {
  return (
    <button className="add-term-button" onClick={onClick} disabled={disabled}>
      規約に加える
    </button>
  );
};

export default AddTermButton;
