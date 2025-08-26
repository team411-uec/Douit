import React from "react";
import { Button } from "@radix-ui/themes";
import { Pencil2Icon } from "@radix-ui/react-icons";

type CreateSuggestionButtonProps = {
  /** ボタンがクリックされたときに実行される関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
  /** ローディング状態（スピナー表示）にするか (任意) */
  loading?: boolean;
};

/**
 * Radix ThemesのButtonを利用した、編集提案作成ボタンコンポーネント
 */
const CreateSuggestionButton = ({
  onClick,
  disabled = false,
  loading = false,
}: CreateSuggestionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      loading={loading}
      size="2"
      variant="soft"
    >
      <Pencil2Icon width="16" height="16" />
      編集提案を作成
    </Button>
  );
};

export default CreateSuggestionButton;
