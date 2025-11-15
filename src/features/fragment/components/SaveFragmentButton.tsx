import { Button } from '@radix-ui/themes';

type SaveFragmentButtonProps = {
  isSaving: boolean;
  isDisabled: boolean;
  onSave: () => void;
};

export default function SaveFragmentButton({
  isSaving,
  isDisabled,
  onSave,
}: SaveFragmentButtonProps) {
  return (
    <Button
      size="3"
      variant="solid"
      color="blue"
      className="w-full mb-8"
      onClick={onSave}
      disabled={isDisabled}
    >
      {isSaving ? '保存中...' : '保存'}
    </Button>
  );
}
