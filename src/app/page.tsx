import {
  MagnifyingGlassIcon,
  PlusIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Button, Flex, TextField } from "@radix-ui/themes";

export default function MyApp() {
  return (
    <Flex p="4" gap="4" justify={"center"}>
      <TextField.Root placeholder="タグで規約片を検索">
        <TextField.Slot>
          <MagnifyingGlassIcon width="18" height="18" />
        </TextField.Slot>
      </TextField.Root>
      <Button>検索</Button>
    </Flex>
  );
}

type AddTermButtonProps = {
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
};

/**
 * 規約追加ボタンコンポーネント
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

type CreateSuggestionButtonProps = {
  onClick: () => void;
  /** ボタンを無効化するかどうか (任意) */
  disabled?: boolean;
  /** ローディング状態（スピナー表示）にするか (任意) */
  loading?: boolean;
};

/**
 *編集提案作成ボタンコンポーネント
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
