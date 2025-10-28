"use client";

import { Box, Flex, Heading, Text, Container, Button, Card, Link } from "@radix-ui/themes";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useTermSet from "@/hooks/useTermSet";
import { useFragmentsWithStatus } from "@/hooks/useFragmentsWithStatus";

export default function AcceptCheckPage({ params }: { params: Promise<{ termSetId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const {
    data: termSetData,
    loading: termSetLoading,
    error: termSetError,
  } = useTermSet(resolvedParams.termSetId);
  const {
    data: fragments,
    loading: fragmentsLoading,
    error: fragmentsError,
  } = useFragmentsWithStatus(termSetData?.fragmentsRefs);

  const loading = termSetLoading || fragmentsLoading;
  const error = termSetError || fragmentsError;

  const getCommonParameters = () => {
    if (!fragments) return {};
    const allParams: Record<string, string> = {};
    fragments.forEach(fragment => {
      Object.entries(fragment.ref.parameterValues).forEach(([key, value]) => {
        if (allParams[key] && allParams[key] !== value) {
          delete allParams[key];
        } else {
          allParams[key] = value;
        }
      });
    });
    return allParams;
  };

  const commonParams = getCommonParameters();

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

  if (error || !termSetData || !fragments) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
        <Container size="1" px="4" py="6">
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
      <Header showUserIcon={true} />

      <Container size="1" px="4" py="6">
        <Heading size="6" color="gray" className="mb-6">
          利用規約同意可能性確認画面
        </Heading>

        <Heading size="5" className="mb-2">
          {termSetData.title}
        </Heading>
        <Text size="2" color="gray" className="mb-6">
          {termSetData.description}
        </Text>

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

        <Box>
          {fragments.map(fragment => (
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
                  {fragment.understood ? (
                    <CheckIcon width="20" height="20" className="text-green-500" />
                  ) : (
                    <Cross2Icon width="20" height="20" className="text-red-500" />
                  )}
                  <Box className="flex-1">
                    <Heading
                      size="4"
                      className={`mb-2 ${fragment.understood ? "text-green-700" : "text-red-700"}`}
                    >
                      {fragment.data.title}
                    </Heading>
                    {Object.entries(fragment.ref.parameterValues).map(([key, value]) => {
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
                <Link href={`/fragment/${fragment.ref.fragmentId}`}>
                  <Button
                    size="2"
                    className={`${fragment.understood ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}
                  >
                    読む
                  </Button>
                </Link>
              </Flex>
            </Card>
          ))}
        </Box>

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
