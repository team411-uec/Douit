"use client";

import { Box, Flex, Heading, Button, Text, Container, Card, Separator } from "@radix-ui/themes";
import { CopyIcon, CheckIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, use } from "react";
import { User } from "firebase/auth";
import useTermSet from "@/hooks/useTermSet";
import { useTermSetFragments } from "@/hooks/useTermSetFragments";
import { useUnderstandingStatusForSet } from "@/hooks/useUnderstandingStatusForSet";
import useFragment from "@/hooks/useFragment";

export default function TermDetailPage({ params }: { params: Promise<{ termid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const {
    data: termSetData,
    loading: termSetLoading,
    error: termSetError,
  } = useTermSet(resolvedParams.termid);
  const {
    data: fragments,
    loading: fragmentsLoading,
    error: fragmentsError,
  } = useTermSetFragments(resolvedParams.termid);
  const {
    data: understandingStatus,
    loading: understandingLoading,
    error: understandingError,
  } = useUnderstandingStatusForSet(resolvedParams.termid);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareButtonClick = async () => {
    try {
      const shareUrl = `${window.location.origin}/accept-check/${resolvedParams.termid}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("リンクのコピーに失敗しました:", error);
      setCopySuccess(false);
    }
  };

  const loading = termSetLoading || fragmentsLoading || understandingLoading;
  const error = termSetError || fragmentsError || understandingError;

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

  if (loading) {
    return (
      <Box className="min-h-screen">
        <Header />
        <Container size="1" className="px-6 py-6">
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !termSetData || !fragments) {
    return (
      <Box className="min-h-screen">
        <Header />
        <Container size="1" className="px-6 py-6">
          <Box className="text-center py-8">
            <Heading size="4" color="red">
              {error || "データの取得に失敗しました"}
            </Heading>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Header />
      <Container size="1" px="4" py="6">
        <Heading size="6" color="gray" mb="2">
          {termSetData.title}
        </Heading>
        <Text size="3" color="gray" mb="6">
          作成者: {user.displayName || user.email}
        </Text>
        <Box mb="6">
          <Heading size="5" color="gray" mb="4">
            共通パラメータ
          </Heading>
          <Card size="2">
            <Flex direction="column" gap="2">
              <Flex justify="between">
                <Text size="3" color="gray">
                  PROVIDER
                </Text>
                <Text size="3" color="gray">
                  {user.displayName || user.email}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text size="3" color="gray">
                  CONTACT
                </Text>
                <Text size="3" color="gray">
                  {user.email}
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Box>
        <Flex direction="column" gap="4" mb="6">
          {fragments.map(fragment => {
            const fragmentUnderstanding = understandingStatus?.find(
              status => status.fragmentId === fragment.fragmentId
            );
            return (
              <FragmentCard
                key={fragment.id}
                fragment={fragment}
                user={user}
                isUnderstood={fragmentUnderstanding?.isUnderstood || false}
              />
            );
          })}
        </Flex>
        <Button
          size="3"
          className={`w-full ${copySuccess ? "bg-green-600 hover:bg-green-700" : "bg-[#00ADB5] hover:bg-[#009AA2]"} text-white`}
          onClick={handleShareButtonClick}
        >
          {copySuccess ? (
            <>
              <CheckIcon width="16" height="16" />
              コピーしました！
            </>
          ) : (
            <>
              <CopyIcon width="16" height="16" />
              共有リンクをコピー
            </>
          )}
        </Button>
      </Container>
    </Box>
  );
}

type FragmentCardProps = {
  fragment: any;
  user: User;
  isUnderstood: boolean;
};

function FragmentCard({ fragment, user, isUnderstood }: FragmentCardProps) {
  const { data: fragmentDetails, loading, error } = useFragment(fragment.fragmentId);

  if (loading) {
    return (
      <Card size="2">
        <Text size="3" color="gray">
          読み込み中...
        </Text>
      </Card>
    );
  }

  if (error || !fragmentDetails) {
    return (
      <Card size="2">
        <Text size="3" color="red">
          {error || "フラグメント詳細の取得に失敗しました"}
        </Text>
      </Card>
    );
  }

  return (
    <Card size="2">
      <Flex align="center" justify="between" className="mb-3">
        <Flex align="center" gap="2">
          <Box className={isUnderstood ? "text-green-600" : "text-gray-500"}>
            {isUnderstood ? (
              <CheckIcon width="16" height="16" />
            ) : (
              <QuestionMarkIcon width="16" height="16" />
            )}
          </Box>
          <Heading size="4" className={isUnderstood ? "text-green-600" : "text-gray-500"}>
            {fragmentDetails.title}
          </Heading>
        </Flex>
        <Link href={`/fragment/${fragment.fragmentId}`}>
          <Button size="2" className="text-white">
            読む
          </Button>
        </Link>
      </Flex>
      {fragment.parameterValues &&
        Object.entries(fragment.parameterValues).map(([key, value], index) => (
          <Box key={key}>
            {index > 0 && <Separator my="1" />}
            <Flex justify="between">
              <Text size="2" color="gray">
                {key}
              </Text>
              <Text size="2" color="gray">
                {String(value)}
              </Text>
            </Flex>
          </Box>
        ))}
      <Box>
        <Separator my="1" />
        <Flex justify="between">
          <Text size="2" color="gray">
            CONTACT
          </Text>
          <Text size="2" color="gray">
            {user.email}
          </Text>
        </Flex>
      </Box>
    </Card>
  );
}
