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
  Dialog,
  TextField,
} from "@radix-ui/themes";
import { CheckIcon, Cross2Icon, PlusIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Header from "@/components/Header";
import { useState, useEffect, use } from "react";
import { getTermFragment } from "@/functions/termFragments";
import {
  addUnderstoodRecord,
  removeUnderstoodRecord,
  isFragmentUnderstood,
} from "@/functions/understandingService";
import { getUserTermSets, addFragmentToSet } from "@/functions/termSetService";
import { TermFragment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function FragmentDetailPage({
  params,
}: {
  params: Promise<{ fragmentid: string }>;
}) {
  const resolvedParams = use(params);
  const [fragmentData, setFragmentData] = useState<TermFragment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [understanding, setUnderstanding] = useState<string>("unknown");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [userTermSets, setUserTermSets] = useState<any[]>([]);
  const [selectedTermSet, setSelectedTermSet] = useState<string>("");
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const handleUnderstandingChange = async (value: string) => {
    if (!fragmentData || !user) return;

    // 既に同じ状態の場合は何もしない
    if (value === understanding) return;

    // 理解済みに変更しようとする場合、事前チェック
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

    setUnderstanding(value);

    if (!fragmentData || !user) return;

    try {
      if (value === "understood") {
        // 理解記録を追加
        await addUnderstoodRecord(user.uid, resolvedParams.fragmentid, fragmentData.currentVersion);
        console.log("理解記録を追加しました");
      } else if (value === "unknown") {
        // 理解記録を削除
        await removeUnderstoodRecord(user.uid, resolvedParams.fragmentid);
        console.log("理解記録を削除しました");
      }
    } catch (error) {
      console.error("理解記録の更新に失敗しました:", error);

      // エラーが発生した場合、状態を元に戻す
      if (error instanceof Error && error.message.includes("既に理解済み")) {
        console.log("既に理解済みの規約片です");
        // 状態を理解済みに戻す
        setUnderstanding("understood");
      } else {
        // その他のエラーの場合、前の状態に戻す
        setUnderstanding(value === "understood" ? "unknown" : "understood");
      }
    }
  };

  const handleAddToTermSet = () => {
    setShowAddDialog(true);
    // パラメータの初期値を設定
    if (fragmentData?.parameters) {
      const initialParams: Record<string, string> = {};
      fragmentData.parameters.forEach(param => {
        initialParams[param] = "";
      });
      setParameterValues(initialParams);
    }
  };

  const handleConfirmAdd = async () => {
    if (!selectedTermSet || !fragmentData || !user) return;

    try {
      await addFragmentToSet(selectedTermSet, resolvedParams.fragmentid, parameterValues);

      console.log("規約セットに追加しました");
      setShowAddDialog(false);
      setSelectedTermSet("");
      setParameterValues({});
    } catch (error) {
      console.error("規約セットへの追加に失敗しました:", error);
    }
  };

  useEffect(() => {
    const fetchFragment = async () => {
      try {
        setLoading(true);
        const fragment = await getTermFragment(resolvedParams.fragmentid);
        if (fragment) {
          setFragmentData(fragment);
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

  // 理解状態の初期値を取得
  useEffect(() => {
    const checkUnderstandingStatus = async () => {
      if (user && resolvedParams.fragmentid) {
        try {
          const isUnderstood = await isFragmentUnderstood(user.uid, resolvedParams.fragmentid);
          setUnderstanding(isUnderstood ? "understood" : "unknown");
        } catch (error) {
          console.error("理解状態の取得に失敗しました:", error);
        }
      }
    };

    checkUnderstandingStatus();
  }, [user, resolvedParams.fragmentid]);

  // ユーザーの規約セット一覧を取得
  useEffect(() => {
    const fetchUserTermSets = async () => {
      if (user) {
        try {
          const termSets = await getUserTermSets(user.uid);
          setUserTermSets(termSets);
        } catch (error) {
          console.error("規約セット一覧の取得に失敗しました:", error);
        }
      }
    };

    fetchUserTermSets();
  }, [user]);

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

        <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>規約セットに追加</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              このフラグメントを追加する規約セットを選択してください。
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  規約セット
                </Text>
                <Select.Root value={selectedTermSet} onValueChange={setSelectedTermSet}>
                  <Select.Trigger className="w-full" placeholder="規約セットを選択してください" />
                  <Select.Content>
                    {userTermSets.map(termSet => (
                      <Select.Item key={termSet.id} value={termSet.id}>
                        {termSet.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </label>

              {fragmentData?.parameters && fragmentData.parameters.length > 0 && (
                <>
                  <Text as="div" size="2" weight="bold" mt="2">
                    パラメータ値
                  </Text>
                  {fragmentData.parameters.map(param => (
                    <label key={param}>
                      <Text as="div" size="2" mb="1">
                        {param}
                      </Text>
                      <TextField.Root
                        placeholder={`${param}の値を入力`}
                        value={parameterValues[param] || ""}
                        onChange={e =>
                          setParameterValues(prev => ({
                            ...prev,
                            [param]: e.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
                </>
              )}
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  キャンセル
                </Button>
              </Dialog.Close>
              <Button
                onClick={handleConfirmAdd}
                disabled={!selectedTermSet}
                className=" text-white"
              >
                追加
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Container>
    </Box>
  );
}
