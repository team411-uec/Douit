import React from "react";

// このコンポーネントが受け取るpropsの型定義
type AddTermButtonProps = {
  /** ボタンがクリックされたときに実行される関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
};

const AddTermButton = ({ onClick, disabled = false }: AddTermButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-green-600      /* 背景を緑に */
        text-white         /* 文字を白に */
        font-bold          /* 文字を太字に */
        py-2               /* 上下のパディング */
        px-4               /* 左右のパディング */
        rounded            /* 角を丸くする */
        transition-colors  /* 色の変化を滑らかに */
        duration-200       /* 変化の速さ */
        ease-in-out        /* 変化のカーブ */
        hover:bg-green-700 /* マウスホバー時に背景を濃い緑に */
        disabled:bg-gray-400 /* disabled状態のとき背景をグレーに */
        disabled:cursor-not-allowed /* disabled状態のときカーソルを変更 */
      `}
    >
      規約に加える
    </button>
  );
};

export default AddTermButton;
