"use client";

import { Flex, Heading, Button, Text, Dialog, TextField } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import TermsCard from "@/components/UI/TermsCard";
import { useUser } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTerms } from "@/hooks/useTerms";

export default function TermsPage() {
  const user = useUser();
  const { terms, loading, isCreating, createTerm } = useTerms(user?.uid || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTermTitle, setNewTermTitle] = useState("");
  const [newTermDescription, setNewTermDescription] = useState("");

  const handleCreateTerm = async () => {
    if (!newTermTitle.trim()) return;

    const success = await createTerm(newTermTitle, newTermDescription);
    if (success) {
      setNewTermTitle("");
      setNewTermDescription("");
      setIsDialogOpen(false);
    }
  };

  return (
    <AuthGuard>
      <PageLayout>
        <Heading size="6" className="mb-6">
          作成した利用規約
        </Heading>

        {/* Terms List */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Flex direction="column" gap="3" className="mb-6">
            {terms.length === 0 ? (
              <EmptyState
                title="まだ利用規約を作成していません"
                description="最初の利用規約セットを作成してみましょう"
              />
            ) : (
              terms.map(term => <TermsCard key={term.id} term={term} />)
            )}
          </Flex>
        )}

        {/* Add Button with Dialog - Fixed position */}
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger>
            <div className="fixed bottom-6 right-6">
              <Button
                size="4"
                className="w-14 h-14 rounded-full bg-[#00ADB5] hover:bg-[#009AA2] text-white shadow-lg"
              >
                <PlusIcon width="24" height="24" />
              </Button>
            </div>
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
                  placeholder="例: team411"
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
                className="bg-[#00ADB5] hover:bg-[#009AA2] text-white"
              >
                {isCreating ? "作成中..." : "作成"}
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </PageLayout>
    </AuthGuard>
  );
}
