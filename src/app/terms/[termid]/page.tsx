"use client";

import { Box, Flex, Heading, Button, Text, Container, Card, Separator } from "@radix-ui/themes";
import { CopyIcon, CheckIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { getUserTermSetWithFragments } from "@/repositories/termSetService";
import { getUnderstandingStatusForSet } from "@/repositories/understandingService";
import { getTermFragment } from "@/repositories/termFragments";
import { User } from "firebase/auth";

export default function TermDetailPage({ params }: { params: Promise<{ termid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [termSetData, setTermSetData] = useState<any>(null);
  const [understandingStatus, setUnderstandingStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareButtonClick = async () => {
    try {
      const shareUrl = `${window.location.origin}/accept-check/${resolvedParams.termid}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);

      // 2秒後にコピー成功状態をリセット
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error("リンクのコピーに失敗しました:", error);
      setCopySuccess(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 規約セットの詳細を取得
        const termSetWithFragments = await getUserTermSetWithFragments(resolvedParams.termid);

        if (!termSetWithFragments) {
          setError("規約セットが見つかりませんでした");
          return;
        }

        setTermSetData(termSetWithFragments);

        // 理解状況を取得
        const understandingStatusData = await getUnderstandingStatusForSet(
          user.uid,
          resolvedParams.termid
        );

        setUnderstandingStatus(understandingStatusData);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, resolvedParams.termid]);

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

  if (error || !termSetData) {
    return (
      <Box className="min-h-screen">
        <Header />
        <Container size="1" className="px-6 py-6">
          <Box className="text-center py-8">
            <Heading size="4" color="red">
              {error || "規約セットが見つかりませんでした"}
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
        {/* Title */}
        <Heading size="6" color="gray" mb="2">
          {termSetData.set.title}
        </Heading>
        <Text size="3" color="gray" mb="6">
          作成者: {user.displayName || user.email}
        </Text>

        {/* Common Parameters */}
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
          {termSetData.fragments.map((fragment: any) => {
            const fragmentUnderstanding = understandingStatus.find(
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
          className={`w-full ${
            copySuccess ? "bg-green-600 hover:bg-green-700" : "bg-[#00ADB5] hover:bg-[#009AA2]"
          } text-white`}
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
  const [fragmentDetails, setFragmentDetails] = useState<any>(null);

  useEffect(() => {
    const fetchFragmentDetails = async () => {
      try {
        const details = await getTermFragment(fragment.fragmentId);
        setFragmentDetails(details);
      } catch (error) {
        console.error("フラグメント詳細の取得に失敗しました:", error);
      }
    };

    if (fragment.fragmentId) {
      fetchFragmentDetails();
    }
  }, [fragment.fragmentId]);

  if (!fragmentDetails) {
    return (
      <Card size="2">
        <Text size="3" color="gray">
          読み込み中...
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
