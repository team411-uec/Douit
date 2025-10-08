"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  ScrollArea,
  Container,
  SegmentedControl,
  Button,
  Dialog,
  TextField,
  Select,
  Link,
} from "@radix-ui/themes";
import { CheckIcon, Cross2Icon, PlusIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Header from "@/components/Header";
import { use } from "react";
import { useUser } from "@/contexts/AuthContext";
import { useFragmentDetail } from "@/hooks/useFragmentDetail";
import { useAddToTermSetDialog } from "@/hooks/useAddToTermSetDialog";

export default function FragmentDetailPage({
  params,
}: {
  params: Promise<{ fragmentid: string }>;
}) {
  const resolvedParams = use(params);
  const user = useUser();

  const { fragment, isLoading, error, isUnderstood, handleUnderstandingChange } = useFragmentDetail(
    resolvedParams.fragmentid,
    user?.uid || null
  );

  const {
    showAddDialog,
    parameterValues,
    openDialog,
    closeDialog,
    updateParameterValue,
    confirmAdd,
  } = useAddToTermSetDialog();

  const handleAddToTermSet = () => {
    if (fragment) {
      openDialog(fragment);
    }
  };

  const handleConfirmAdd = async () => {
    if (user) {
      await confirmAdd(resolvedParams.fragmentid, user.uid);
    }
  };

  if (isLoading) {
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

  if (error || !fragment) {
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
            {fragment.title}
          </Heading>
          <Select.Root defaultValue={`v${fragment.currentVersion}`}>
            <Select.Trigger className="w-20" />
            <Select.Content>
              {Array.from({ length: fragment.currentVersion }, (_, i) => (
                <Select.Item key={`v${i + 1}`} value={`v${i + 1}`}>
                  v{i + 1}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* Content */}
        <ScrollArea className="h-96 mb-6">
          <Box className="pr-4">
            <Text size="3" className="leading-relaxed text-gray-900 whitespace-pre-line">
              {fragment.content}
            </Text>
          </Box>
        </ScrollArea>

        {/* Action Buttons */}
        <Flex direction="column" gap="3">
          <Flex gap="3">
            <Button
              size="3"
              className="flex-1 bg-[#00ADB5] hover:bg-[#009AA2] text-white"
              onClick={handleAddToTermSet}
            >
              <PlusIcon width="18" height="18" />
              利用規約に追加
            </Button>
            <Link href={`/fragment/${resolvedParams.fragmentid}/edit`} className="flex-1">
              <Button size="3" className="flex-1 bg-[#00ADB5] hover:bg-[#009AA2] text-white">
                <Pencil2Icon width="18" height="18" />
                編集する
              </Button>
            </Link>
          </Flex>

          {/* Bottom Action Buttons */}
          <Flex justify="center" align="center" gap="4" className="mt-8">
            <Cross2Icon width="24" height="24" className="text-red-500" />
            <SegmentedControl.Root
              value={isUnderstood ? "understood" : "unknown"}
              onValueChange={value => handleUnderstandingChange(value === "understood")}
              size="3"
            >
              <SegmentedControl.Item value="unknown">知らない</SegmentedControl.Item>
              <SegmentedControl.Item value="understood">理解した</SegmentedControl.Item>
            </SegmentedControl.Root>
            <CheckIcon width="24" height="24" className="text-green-500" />
          </Flex>
        </Flex>

        {/* Add to Term Set Dialog */}
        <Dialog.Root open={showAddDialog} onOpenChange={open => !open && closeDialog()}>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>規約セットに追加</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              このフラグメントを追加する規約セットを選択してください。
            </Dialog.Description>

            <Flex direction="column" gap="3">
              {/* Term Set Selection */}
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  規約セット
                </Text>
              </label>

              {fragment?.templateParams && fragment.templateParams.length > 0 && (
                <>
                  <Text as="div" size="2" weight="bold" mt="2">
                    パラメータ値
                  </Text>
                  {fragment.templateParams.map(param => (
                    <label key={param}>
                      <Text as="div" size="2" mb="1">
                        {param}
                      </Text>
                      <TextField.Root
                        placeholder={`${param}の値を入力`}
                        value={parameterValues[param] || ""}
                        onChange={e => updateParameterValue(param, e.target.value)}
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
                className="bg-[#00ADB5] hover:bg-[#009AA2] text-white"
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
