import { Flex, Button, Link } from '@radix-ui/themes';
import { PlusIcon, Pencil2Icon } from '@radix-ui/react-icons';

type FragmentActionsProps = {
  fragmentId: string;
  onAddToTermSet: () => void;
};

export default function FragmentActions({ fragmentId, onAddToTermSet }: FragmentActionsProps) {
  return (
    <Flex gap="3">
      <Button size="3" className="flex-1 text-white" onClick={onAddToTermSet}>
        <PlusIcon width="18" height="18" />
        利用規約に追加
      </Button>
      <Link href={`/fragment/${fragmentId}/edit`} className="flex-1">
        <Button size="3" className="flex-1 text-white">
          <Pencil2Icon width="18" height="18" />
          編集する
        </Button>
      </Link>
    </Flex>
  );
}
