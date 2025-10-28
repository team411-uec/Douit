"use client";

import { Box, Flex, Heading, Button, Container, Text, Dialog, TextField } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { createTermSet } from "@/repositories/termSetService";
import { useUserTermSets } from "@/hooks/useUserTermSets";
import TermsCard from "@/components/Organisims/TermsCard";

export default function TermsPage() {
  const { user } = useAuth();
  const { data: termsData, loading, error, refetch } = useUserTermSets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTermTitle, setNewTermTitle] = useState("");
  const [newTermDescription, setNewTermDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTerm = async () => {
    if (!user || !newTermTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTermSet(user.uid, newTermTitle.trim(), newTermDescription.trim());
      await refetch();
      setNewTermTitle("");
      setNewTermDescription("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("利用規約の作成に失敗しました:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <Box className="min-h-screen">
        <Header />
        <Container size="1" className="px-6 py-6">
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              ログインが必要です
            </Heading>
            <Link href="/login">
              <Button className="mt-4 text-white">ログインページへ</Button>
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        <Heading size="6" className="mb-6">
          作成した利用規約
        </Heading>

        {loading && (
          <Box className="text-center py-8">
            <Text size="4" color="gray">
              読み込み中...
            </Text>
          </Box>
        )}
        {error && (
          <Box className="text-center py-8">
            <Text size="4" color="red">
              {error}
            </Text>
          </Box>
        )}
        {termsData && (
          <Flex direction="column" gap="3" className="mb-6">
            {termsData.length === 0 ? (
              <Box className="text-center py-8">
                <Text size="4" color="gray">
                  まだ利用規約を作成していません
                </Text>
              </Box>
            ) : (
              termsData.map(term => <TermsCard key={term.id} term={term} />)
            )}
          </Flex>
        )}

        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger>
            <Box className="fixed bottom-6 right-6">
              <Button size="4" className="w-14 h-14 rounded-full text-white shadow-lg">
                <PlusIcon width="24" height="24" />
              </Button>
            </Box>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>新しい利用規約を作成</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              利用規約のタイトルと説明を入力してください。
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  タイトル
                </Text>
                <TextField.Root
                  placeholder="例: サークル会則"
                  value={newTermTitle}
                  onChange={e => setNewTermTitle(e.target.value)}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  説明（任意）
                </Text>
                <TextField.Root
                  placeholder="例: サークル活動に関する規約"
                  value={newTermDescription}
                  onChange={e => setNewTermDescription(e.target.value)}
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
                onClick={handleCreateTerm}
                disabled={!newTermTitle.trim() || isCreating}
                className="text-white"
              >
                {isCreating ? "作成中..." : "作成"}
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Container>
    </Box>
  );
}
