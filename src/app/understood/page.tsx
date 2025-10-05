"use client";

import { Flex, Heading, Card, Box } from "@radix-ui/themes";
import AuthGuard from "../components/AuthGuard";
import PageLayout from "../components/PageLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUnderstoodRecordsWithFragments } from "../functions/understandingService";
import { TermFragment, UnderstoodRecord } from "../../types";
import { useAuth } from "../contexts/AuthContext";

export default function UnderstoodPage() {
  const [understoodRecords, setUnderstoodRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnderstoodRecords = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const records = await getUnderstoodRecordsWithFragments(user.uid);
        setUnderstoodRecords(records);
      } catch (error) {
        console.error("理解記録の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnderstoodRecords();
  }, [user]);

  return (
    <AuthGuard showUserIcon={true}>
      <PageLayout showUserIcon={true}>
        <Heading size="6" className="mb-6">
          理解済み規約片
        </Heading>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Flex direction="column" gap="4">
            {understoodRecords.length === 0 ? (
              <EmptyState title="理解済みの規約片がありません" />
            ) : (
              understoodRecords.map(record => (
                <UnderstoodTermCard key={record.id} record={record} />
              ))
            )}
          </Flex>
        )}
      </PageLayout>
    </AuthGuard>
  );
}

type UnderstoodTermCardProps = {
  record: any;
};

function UnderstoodTermCard({ record }: UnderstoodTermCardProps) {
  return (
    <Link href={`/fragment/${record.fragmentId}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex align="center" justify="between">
          <Heading size="4" color="gray" className="flex-1">
            {record.fragment?.title || "規約片"}
          </Heading>
          <Flex align="center" gap="2">
            <Box className="text-sm text-gray-500">v{record.version}</Box>
            <Box className="text-sm text-gray-500">
              {record.understoodAt
                ? new Date(record.understoodAt.seconds * 1000).toLocaleDateString()
                : ""}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
