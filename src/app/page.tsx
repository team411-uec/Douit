"use client";

import {
  Box,
  Flex,
  Heading,
  Button,
  Container,
  Card,
  TextField,
  Badge,
  Dialog,
  TextArea,
  Text,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import Header from "./components/Header";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllTermFragments } from "./functions/tagSearch";
import { createTermFragment } from "./functions/termFragments";
import { TermFragment } from "../types";
import { useAuth } from "./contexts/AuthContext";

type FragmentCard = {
  id: string;
  title: string;
  tags: string[];
};

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fragments, setFragments] = useState<{ id: string; data: TermFragment }[]>([]);
  const [loading, setLoading] = useState(true);

  // 規約片作成用の状態
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFragmentTitle, setNewFragmentTitle] = useState("");
  const [newFragmentContent, setNewFragmentContent] = useState("");
  const [newFragmentTags, setNewFragmentTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setLoading(true);
        const results = await getAllTermFragments();
        setFragments(results);
      } catch (error) {
        console.error("規約片の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFragments();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreateFragment = async () => {
    if (!user || !newFragmentTitle.trim() || !newFragmentContent.trim()) return;

    setIsCreating(true);
    try {
      const tags = newFragmentTags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createTermFragment(
        newFragmentTitle.trim(),
        newFragmentContent.trim(),
        tags,
        [] // parameters は空配列
      );

      // リストを再取得
      const results = await getAllTermFragments();
      setFragments(results);

      // フォームをリセット
      setNewFragmentTitle("");
      setNewFragmentContent("");
      setNewFragmentTags("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("規約片の作成に失敗しました:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        {/* Search Section */}
        <Flex gap="3" className="mb-6">
          <TextField.Root
            size="3"
            placeholder="規約片をタグで検索"
            className="flex-1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          >
            <TextField.Slot side="left">
              <MagnifyingGlassIcon width="16" height="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button
            size="3"
            className="bg-[#00ADB5] hover:bg-[#009AA2] text-white px-6"
            onClick={handleSearch}
          >
            検索
          </Button>
        </Flex>

        {/* Fragment Cards */}
        {loading ? (
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        ) : (
          <Flex direction="column" gap="4">
            {fragments.map(fragmentItem => (
              <FragmentSearchCard
                key={fragmentItem.id}
                fragment={{
                  id: fragmentItem.id,
                  title: fragmentItem.data.title,
                  tags: fragmentItem.data.tags,
                }}
              />
            ))}
          </Flex>
        )}
      </Container>

      {/* Create Fragment Button - Fixed position */}
      {user && (
        <Dialog.Root open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  value={newFragmentTitle}
                  onChange={e => setNewFragmentTitle(e.target.value)}
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  内容
                </Text>
                <TextArea
                  placeholder="規約片の内容を入力してください..."
                  value={newFragmentContent}
                  onChange={e => setNewFragmentContent(e.target.value)}
                  rows={6}
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  タグ（カンマ区切り）
                </Text>
                <TextField.Root
                  placeholder="例: プライバシー, データ保護, GDPR"
                  value={newFragmentTags}
                  onChange={e => setNewFragmentTags(e.target.value)}
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
                disabled={!newFragmentTitle.trim() || !newFragmentContent.trim() || isCreating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreating ? "作成中..." : "作成"}
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}

type FragmentSearchCardProps = {
  fragment: FragmentCard;
};

function FragmentSearchCard({ fragment }: FragmentSearchCardProps) {
  return (
    <Link href={`/fragment/${fragment.id}`} className="no-underline">
      <Card
        size="3"
        className="border-2 hover:border-solid hover:shadow-md transition-all cursor-pointer"
      >
        <Flex direction="column" gap="3">
          <Heading size="5" color="gray">
            {fragment.title}
          </Heading>

          <Flex align="center" gap="2" wrap="wrap">
            <Box className="text-gray-600">Tags</Box>
            {fragment.tags.map((tag, index) => (
              <Badge key={index} size="2" className="bg-[#00ADB5] text-white">
                {tag}
              </Badge>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
