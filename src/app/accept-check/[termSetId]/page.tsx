"use client";

import { Box, Flex, Heading, Text, Container, Button, Card, Link } from "@radix-ui/themes";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import Header from "../../../components/Header";
import { useState, useEffect, use } from "react";
import { getUserTermSetWithFragments } from "../../../functions/termSetService";
import { getTermFragment } from "../../../functions/termFragments";
import { isFragmentUnderstood } from "../../../functions/understandingService";
import { TermFragment, FragmentRef } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";

interface FragmentWithData {
  ref: FragmentRef;
  data: TermFragment;
  understood: boolean;
}

export default function AcceptCheckPage({ params }: { params: Promise<{ termSetId: string }> }) {
  const resolvedParams = use(params);
  const [termSetData, setTermSetData] = useState<any>(null);
  const [fragments, setFragments] = useState<FragmentWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 共通パラメータを抽出する関数
  const getCommonParameters = () => {
    const allParams: Record<string, string> = {};

    fragments.forEach(fragment => {
      Object.entries(fragment.ref.parameterValues).forEach(([key, value]) => {
        if (allParams[key] && allParams[key] !== value) {
          // 値が異なる場合は共通パラメータから除外
          delete allParams[key];
        } else {
          allParams[key] = value;
        }
      });
    });

    return allParams;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 規約セットとフラグメント参照を取得
        const termSetResult = await getUserTermSetWithFragments(resolvedParams.termSetId);
        if (!termSetResult) {
          setError("規約セットが見つかりませんでした");
          return;
        }

        setTermSetData(termSetResult.set);

        // 各フラグメントの詳細データと理解状態を取得
        const fragmentsWithData: FragmentWithData[] = [];

        for (const fragmentRef of termSetResult.fragments) {
          try {
            const fragmentData = await getTermFragment(fragmentRef.fragmentId);
            if (fragmentData) {
              let understood = false;
              if (user) {
                understood = await isFragmentUnderstood(user.uid, fragmentRef.fragmentId);
              }

              fragmentsWithData.push({
                ref: fragmentRef,
                data: fragmentData,
                understood,
              });
            }
          } catch (error) {
            console.error(`フラグメント ${fragmentRef.fragmentId} の取得に失敗:`, error);
          }
        }

        setFragments(fragmentsWithData);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.termSetId, user]);

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

  if (error || !termSetData) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
        <Container size="1" px="4" py="6">
          <Box className="text-center py-8">
            <Heading size="4" color="red">
              {error || "規約セットが見つかりませんでした"}
            </Heading>
          </Box>
        </Container>
      </Box>
    );
  }

  const commonParams = getCommonParameters();

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />

      <Container size="1" px="4" py="6">
        {/* Page Title */}
        <Heading size="6" color="gray" className="mb-6">
          利用規約同意可能性確認画面
        </Heading>

        {/* Term Set Title */}
        <Heading size="5" className="mb-2">
          {termSetData.title}
        </Heading>
        <Text size="2" color="gray" className="mb-6">
          {termSetData.description || "team411"}
        </Text>

        {/* Common Parameters */}
        {Object.keys(commonParams).length > 0 && (
          <Box className="mb-6">
            <Heading size="4" className="mb-4">
              共通パラメータ
            </Heading>
            <Card className="p-4">
              {Object.entries(commonParams).map(([key, value]) => (
                <Flex key={key} justify="between" align="center" className="mb-2 last:mb-0">
                  <Text size="3" weight="medium" className="text-gray-600">
                    {key}
                  </Text>
                  <Text size="3" weight="bold">
                    {value}
                  </Text>
                </Flex>
              ))}
            </Card>
          </Box>
        )}

        {/* Fragments List */}
        <Box>
          {fragments.map((fragment, index) => (
            <Card
              key={fragment.ref.fragmentId}
              className={`mb-4 p-4 border-l-4 ${
                fragment.understood
                  ? "border-l-green-500 bg-green-50"
                  : "border-l-red-500 bg-red-50"
              }`}
            >
              <Flex align="center" justify="between">
                <Flex align="center" gap="3" className="flex-1">
                  {/* Status Icon */}
                  {fragment.understood ? (
                    <CheckIcon width="20" height="20" className="text-green-500" />
                  ) : (
                    <Cross2Icon width="20" height="20" className="text-red-500" />
                  )}

                  {/* Fragment Info */}
                  <Box className="flex-1">
                    <Heading
                      size="4"
                      className={`mb-2 ${fragment.understood ? "text-green-700" : "text-red-700"}`}
                    >
                      {fragment.data.title}
                    </Heading>

                    {/* Fragment-specific Parameters */}
                    {Object.entries(fragment.ref.parameterValues).map(([key, value]) => {
                      // 共通パラメータは表示しない
                      if (commonParams[key]) return null;

                      return (
                        <Flex key={key} gap="2" className="mb-1">
                          <Text size="2" color="gray">
                            {key}
                          </Text>
                          <Text size="2" weight="bold">
                            {value}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Box>
                </Flex>

                {/* Read Button */}
                <Link href={`/fragment/${fragment.ref.fragmentId}`}>
                  <Button
                    size="2"
                    className={`${
                      fragment.understood
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    読む
                  </Button>
                </Link>
              </Flex>
            </Card>
          ))}
        </Box>

        {/* Summary */}
        {fragments.length > 0 && (
          <Box className="mt-8 text-center">
            <Text size="3" color="gray">
              理解済み: {fragments.filter(f => f.understood).length} / {fragments.length}
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}
