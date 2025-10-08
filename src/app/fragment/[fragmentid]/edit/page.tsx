"use client";

import { Flex, Heading, Button, Select, ScrollArea, TextArea } from "@radix-ui/themes";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useState, useEffect, use } from "react";
import { getTermFragment, updateTermFragment } from "@/functions/termFragments";
import { TermFragment } from "@/types";

export default function EditFragmentPage({ params }: { params: Promise<{ fragmentid: string }> }) {
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
        const fragmentResult = await getTermFragment(resolvedParams.fragmentid);
        if (fragmentResult.success && fragmentResult.data) {
          setFragmentData(fragmentResult.data);
          setEditedContent(fragmentResult.data.content);
        } else {
          setError(fragmentResult.error || "規約片が見つかりませんでした");
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
    if (!fragmentData || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      await updateTermFragment(
        resolvedParams.fragmentid,
        fragmentData.title,
        editedContent.trim(),
        fragmentData.tags,
        fragmentData.templateParams || []
      );

      // 更新後のデータを取得
      const updatedFragmentResult = await getTermFragment(resolvedParams.fragmentid);
      if (updatedFragmentResult.success && updatedFragmentResult.data) {
        setFragmentData(updatedFragmentResult.data);
      }

      console.log("規約片の更新が完了しました");
    } catch (error) {
      console.error("規約片の更新に失敗しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard showUserIcon={true}>
        <PageLayout showUserIcon={true}>
          <LoadingSpinner />
        </PageLayout>
      </AuthGuard>
    );
  }

  if (error || !fragmentData) {
    return (
      <AuthGuard showUserIcon={true}>
        <PageLayout showUserIcon={true}>
          <EmptyState
            title={error || "規約片が見つかりませんでした"}
            actionText="ホームに戻る"
            actionHref="/"
          />
        </PageLayout>
      </AuthGuard>
    );
  }
  return (
    <AuthGuard showUserIcon={true}>
      <PageLayout showUserIcon={true}>
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
          <div className="pr-4">
            <TextArea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="規約片の内容を入力してください..."
              style={{ minHeight: "350px" }}
            />
          </div>
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
      </PageLayout>
    </AuthGuard>
  );
}
