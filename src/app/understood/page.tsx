"use client";

import { Box, Flex, Heading, Button, Container } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUnderstoodRecords } from "@/hooks/useUnderstoodRecords";
import UnderstoodTermCard from "@/components/Organisims/UnderstoodTermCard";

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
