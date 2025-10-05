"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import { use } from "react";

export default function TermDetailPage({ params }: { params: Promise<{ termid: string }> }) {
  const { termid } = use(params);

  return (
    <AuthGuard>
      <PageLayout>
        <Flex direction="column" gap="3">
          <Heading size="6">規約詳細</Heading>
          <Text>Term ID: {termid}</Text>
          <Text>この機能は開発中です。</Text>
        </Flex>
      </PageLayout>
    </AuthGuard>
  );
}
