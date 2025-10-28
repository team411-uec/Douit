import { createTermFragment } from "@/repositories/termFragments";
import { PlusIcon } from "@radix-ui/react-icons";
import { Dialog, Box, Button, Flex, TextField, TextArea, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function NewFragmentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setIsOpen(false);
  };

  const handleCreateFragment = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsCreating(true);
    const tagList = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      await createTermFragment(
        title.trim(),
        content.trim(),
        tagList,
        [] // parameters は空配列
      );

      resetForm();
    } catch (error) {
      console.error("規約片の作成に失敗しました:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Box className="fixed bottom-6 right-6">
          <Button
            size="4"
            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <PlusIcon width="24" height="24" />
          </Button>
        </Box>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>新しい規約片を作成</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          規約片のタイトル、内容、タグを入力してください。
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              タイトル
            </Text>
            <TextField.Root
              placeholder="例: プライバシーポリシー"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              内容
            </Text>
            <TextArea
              placeholder="規約片の内容を入力してください..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              タグ（カンマ区切り）
            </Text>
            <TextField.Root
              placeholder="例: プライバシー, データ保護, GDPR"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              キャンセル
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleCreateFragment}
            disabled={!title.trim() || !content.trim() || isCreating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isCreating ? "作成中..." : "作成"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
