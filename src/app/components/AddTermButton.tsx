import React from "react";
import { Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

type AddTermButtonProps = {
  /** ボタンがクリックされたときに実行される関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
};

/**
 * Radix ThemesのButtonを利用した、規約追加ボタンコンポーネント
 */
const AddTermButton = ({ onClick, disabled = false }: AddTermButtonProps) => {
  return (
    <Button onClick={onClick} disabled={disabled} size="2">
      <PlusIcon width="16" height="16" />
      規約を追加する
    </Button>
  );
};

export default AddTermButton;
