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
import { getTermFragment, updateTermFragment } from "@/repositories/termFragments";
import { TermFragment } from "@/domains/types";
import { useAuth } from "@/contexts/AuthContext";

export default function EditFragmentPage({ params }: { params: Promise<{ fragmentid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [fragmentData, setFragmentData] = useState<TermFragment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFragment = async () => {
      try {
        setLoading(true);
        const fragment = await getTermFragment(resolvedParams.fragmentid);
        if (fragment) {
          setFragmentData(fragment);
          setEditedContent(fragment.content);
        } else {
          setError("規約片が見つかりませんでした");
        }
      } catch (err) {
        console.error("規約片の取得に失敗しました:", err);
        setError("規約片の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchFragment();
  }, [resolvedParams.fragmentid]);

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

      // 更新後のデータを取得
      const updatedFragment = await getTermFragment(resolvedParams.fragmentid);
      if (updatedFragment) {
        setFragmentData(updatedFragment);
      }

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
        {/* Header with title and version */}
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

        {/* Content with editable text area */}
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

        {/* Save Button */}
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
