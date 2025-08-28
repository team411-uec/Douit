import {
  Dialog,
  Flex,
  Text,
  Button,
  TextField,
  Select,
  Box,
} from "@radix-ui/themes";

type AddToTermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (termId: string) => void;
};

export function AddToTermsModal({
  open,
  onOpenChange,
  onConfirm,
}: AddToTermsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-sm">
        <Dialog.Title>この規約片を利用規約に追加</Dialog.Title>
        <Dialog.Description size="2" className="mb-4" color="gray">
          どの利用規約に追加するかを選択してください
        </Dialog.Description>

        <Box className="mb-4">
          <Select.Root>
            <Select.Trigger placeholder="利用規約を選択" />
            <Select.Content>
              <Select.Item value="1">サークル会則</Select.Item>
              <Select.Item value="2">プライバシーポリシー</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Flex gap="3" className="mt-4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              キャンセル
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              className="bg-[#00ADB5] hover:bg-[#009AA2] text-white"
              onClick={() => onConfirm("1")}
            >
              追加
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

type CreateTermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
};

export function CreateTermsModal({
  open,
  onOpenChange,
  onConfirm,
}: CreateTermsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-sm">
        <Dialog.Title>利用規約を作成</Dialog.Title>
        <Dialog.Description size="2" className="mb-4" color="gray">
          規約の名前を入力してください
        </Dialog.Description>

        <Box className="mb-4">
          <TextField.Root placeholder="利用規約名を入力" />
        </Box>

        <Flex gap="3" className="mt-4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              キャンセル
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              className="bg-[#00ADB5] hover:bg-[#009AA2] text-white"
              onClick={() => onConfirm("新しい規約")}
            >
              作成
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
