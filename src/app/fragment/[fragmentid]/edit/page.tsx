"use client";

import {
  Box,
  Flex,
  Heading,
  Button,
  Select,
  ScrollArea,
  Container,
  TextArea,
} from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { useState, useEffect, use } from "react";
import { updateTermFragment } from "@/repositories/termFragments";
import { useAuth } from "@/contexts/AuthContext";
import useFragment from "@/hooks/useFragment";

export default function EditFragmentPage({ params }: { params: Promise<{ fragmentid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const { data: fragmentData, loading, error, refetch } = useFragment(resolvedParams.fragmentid);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (fragmentData) {
      setEditedContent(fragmentData.content);
    }
  }, [fragmentData]);

  const handleSaveEdit = async () => {
    if (!user || !fragmentData || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      await updateTermFragment(
        resolvedParams.fragmentid,
        fragmentData.title,
        editedContent.trim(),
        fragmentData.tags,
        fragmentData.parameters || []
      );

      await refetch();

      console.log("規約片の更新が完了しました");
    } catch (error) {
      console.error("規約片の更新に失敗しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">ログインが必要です</p>
      </div>
    );
  }

  if (loading) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
        <Container size="1" px="4" py="6">
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !fragmentData) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
        <Container size="1" px="4" py="6">
          <Box className="text-center py-8">
            <Heading size="4" color="red">
              {error || "規約片が見つかりませんでした"}
            </Heading>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />

      <Container size="1" px="4" py="6">
        <Flex align="center" justify="between" className="mb-6">
          <Heading size="6" color="gray" className="flex-1">
            {fragmentData.title}
          </Heading>
          <Select.Root defaultValue={`v${fragmentData.currentVersion}`}>
            <Select.Trigger className="w-20" />
            <Select.Content>
              {Array.from({ length: fragmentData.currentVersion }, (_, i) => (
                <Select.Item key={`v${i + 1}`} value={`v${i + 1}`}>
                  v{i + 1}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>

        <ScrollArea className="h-96 mb-6">
          <Box className="pr-4">
            <TextArea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="規約片の内容を入力してください..."
              style={{ minHeight: "350px" }}
            />
          </Box>
        </ScrollArea>

        <Button
          size="3"
          variant="solid"
          color="blue"
          className="w-full mb-8"
          onClick={handleSaveEdit}
          disabled={isSaving || !editedContent.trim() || editedContent === fragmentData?.content}
        >
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </Container>
    </Box>
  );
}
