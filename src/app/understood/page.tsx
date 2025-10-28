"use client";

import { Box, Flex, Heading, Button, Container, Card } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UnderstoodRecord } from "@/domains/types";
import useFragment from "@/hooks/useFragment";
import { useUnderstoodRecords } from "@/hooks/useUnderstoodRecords";

export default function UnderstoodPage() {
  const { user } = useAuth();
  const { data: understoodRecords, loading, error } = useUnderstoodRecords();

  if (!user) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
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
      <Header showUserIcon={true} />

      <Container size="1" className="px-6 py-6">
        <Heading size="6" className="mb-6">
          理解済み規約片
        </Heading>

        {loading && (
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        )}
        {error && (
          <Box className="text-center py-8">
            <Heading size="4" color="red">
              {error}
            </Heading>
          </Box>
        )}
        {understoodRecords && (
          <Flex direction="column" gap="4">
            {understoodRecords.length === 0 ? (
              <Box className="text-center py-8">
                <Heading size="4" color="gray">
                  理解済みの規約片がありません
                </Heading>
              </Box>
            ) : (
              understoodRecords.map(record => (
                <UnderstoodTermCard key={record.fragmentId} record={record} />
              ))
            )}
          </Flex>
        )}
      </Container>
    </Box>
  );
}

type UnderstoodTermCardProps = {
  record: UnderstoodRecord;
};

function UnderstoodTermCard({ record }: UnderstoodTermCardProps) {
  const { data: fragment, loading, error } = useFragment(record.fragmentId);

  if (loading || !fragment) return null;
  if (error) return null; // or show error state

  return (
    <Link href={`/fragment/${record.fragmentId}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex align="center" justify="between">
          <Heading size="4" color="gray" className="flex-1">
            {fragment.title || "規約片"}
          </Heading>
          <Flex align="center" gap="2">
            <Box className="text-sm text-gray-500">{record.version}</Box>
            <Box className="text-sm text-gray-500">
              {record.understoodAt ? new Date(record.understoodAt).toLocaleDateString() : ""}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
