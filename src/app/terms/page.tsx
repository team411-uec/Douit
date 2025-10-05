"use client";

import {
  Flex,
  Heading,
  Button,
  Card,
  Text,
  Dialog,
  TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { createUserTermSet, getUserTermSets } from "@/functions/termSetService";

type TermsItem = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export default function TermsPage() {
  const { user } = useAuth();
  const [termsData, setTermsData] = useState<TermsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTermTitle, setNewTermTitle] = useState("");
  const [newTermDescription, setNewTermDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchUserTerms = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const terms = await getUserTermSets(user.uid);
        setTermsData(terms);
      } catch (error) {
        console.error("利用規約の取得に失敗しました:", error);
        // フォールバック用のテストデータ
        setTermsData([
          {
            id: "1",
            title: "サークル会則",
            description: "team411",
            createdAt: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTerms();
  }, [user]);

  const handleCreateTerm = async () => {
    if (!user || !newTermTitle.trim()) return;

    try {
      setIsCreating(true);
      const termSetId = await createUserTermSet(
        user.uid,
        newTermTitle.trim(),
        newTermDescription.trim()
      );

      // 成功時の処理
      setNewTermTitle("");
      setNewTermDescription("");
      setIsDialogOpen(false);

      // リストを再取得
      const updatedTerms = await getUserTermSets(user.uid);
      setTermsData(updatedTerms);
    } catch (error) {
      console.error("利用規約の作成に失敗しました:", error);
    } finally {
      setIsCreating(false);
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
            {termsData.length === 0 ? (
              <EmptyState
                title="まだ利用規約を作成していません"
                description="最初の利用規約セットを作成してみましょう"
              />
            ) : (
              termsData.map(term => <TermsCard key={term.id} term={term} />)
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

type TermsCardProps = {
  term: TermsItem;
};

function TermsCard({ term }: TermsCardProps) {
  return (
    <Link href={`/terms/${term.id}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex direction="column" gap="2">
          <Heading size="4" color="gray">
            {term.title}
          </Heading>
          {term.description && (
            <Text size="2" color="gray">
              {term.description}
            </Text>
          )}
          <Text size="1" color="gray">
            作成日: {term.createdAt.toLocaleDateString()}
          </Text>
        </Flex>
      </Card>
    </Link>
  );
}
