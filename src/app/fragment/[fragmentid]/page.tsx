"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  ScrollArea,
  Container,
  SegmentedControl,
  Link,
  Button,
} from "@radix-ui/themes";
import { CheckIcon, Cross2Icon, PlusIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useState, use } from "react";
import {
  addUnderstoodRecord,
  removeUnderstoodRecord,
  isFragmentUnderstood,
} from "@/repositories/understandingService";
import { addFragmentToSet } from "@/repositories/termSetService";
import { useAuth } from "@/contexts/AuthContext";
import useFragment from "@/hooks/useFragment";
import { useUnderstandingStatus } from "@/hooks/useUnderstandingStatus";
import { useUserTermSets } from "@/hooks/useUserTermSets";
import AddFragmentToSetDialog from "@/components/Organisims/AddFragmentToSetDialog";

export default function FragmentDetailPage({
  params,
}: {
  params: Promise<{ fragmentid: string }>;
}) {
  const resolvedParams = use(params);
  const { data: fragmentData, loading, error } = useFragment(resolvedParams.fragmentid);
  const { understanding, setUnderstanding } = useUnderstandingStatus(resolvedParams.fragmentid);
  const { data: userTermSets } = useUserTermSets();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();

  const handleUnderstandingChange = async (value: string) => {
    if (!fragmentData || !user) return;

    if (value === understanding) return;

    if (value === "understood") {
      try {
        const alreadyUnderstood = await isFragmentUnderstood(
          user.uid,
          resolvedParams.fragmentid,
          fragmentData.currentVersion
        );

        if (alreadyUnderstood) {
          console.log("この規約片は既に理解済みです");
          setUnderstanding("understood");
          return;
        }
      } catch (error) {
        console.error("理解状態の事前チェックに失敗しました:", error);
      }
    }

    setUnderstanding(value as "understood" | "unknown");

    if (!fragmentData || !user) return;

    try {
      if (value === "understood") {
        await addUnderstoodRecord(user.uid, resolvedParams.fragmentid, fragmentData.currentVersion);
        console.log("理解記録を追加しました");
      } else if (value === "unknown") {
        await removeUnderstoodRecord(user.uid, resolvedParams.fragmentid);
        console.log("理解記録を削除しました");
      }
    } catch (error) {
      console.error("理解記録の更新に失敗しました:", error);

      if (error instanceof Error && error.message.includes("既に理解済み")) {
        console.log("既に理解済みの規約片です");
        setUnderstanding("understood");
      } else {
        setUnderstanding(value === "understood" ? "unknown" : "understood");
      }
    }
  };

  const handleAddToTermSet = () => {
    setShowAddDialog(true);
  };

  const handleConfirmAdd = async (termSetId: string, parameterValues: Record<string, string>) => {
    if (!termSetId || !fragmentData || !user) return;

    try {
      await addFragmentToSet(termSetId, resolvedParams.fragmentid, parameterValues);

      console.log("規約セットに追加しました");
      setShowAddDialog(false);
    } catch (error) {
      console.error("規約セットへの追加に失敗しました:", error);
    }
  };

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
            <Text size="3" className="leading-relaxed text-gray-900 whitespace-pre-line">
              {fragmentData.content}
            </Text>
          </Box>
        </ScrollArea>

        <Flex direction="column" gap="3">
          <Flex gap="3">
            <Button size="3" className="flex-1  text-white" onClick={handleAddToTermSet}>
              <PlusIcon width="18" height="18" />
              利用規約に追加
            </Button>
            <Link href={`/fragment/${resolvedParams.fragmentid}/edit`} className="flex-1">
              <Button size="3" className="flex-1 text-white">
                <Pencil2Icon width="18" height="18" />
                編集する
              </Button>
            </Link>
          </Flex>

          <Flex justify="center" align="center" gap="4" className="mt-8">
            <Cross2Icon width="24" height="24" className="text-red-500" />
            <SegmentedControl.Root
              value={understanding}
              onValueChange={handleUnderstandingChange}
              size="3"
            >
              <SegmentedControl.Item value="unknown">知らない</SegmentedControl.Item>
              <SegmentedControl.Item value="understood">理解した</SegmentedControl.Item>
            </SegmentedControl.Root>
            <CheckIcon width="24" height="24" className="text-green-500" />
          </Flex>
        </Flex>

        <AddFragmentToSetDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          fragmentData={fragmentData}
          userTermSets={userTermSets}
          onConfirm={handleConfirmAdd}
        />
      </Container>
    </Box>
  );
}
