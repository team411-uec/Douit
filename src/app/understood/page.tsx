"use client";

import { Flex, Heading } from "@radix-ui/themes";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import UnderstoodTermCard from "@/components/UI/UnderstoodTermCard";
import { useState, useEffect } from "react";
import { getUnderstoodRecordsWithFragments } from "@/functions/understandingService";
import { UnderstoodRecord, TermFragment } from "@/types";
import { useUser } from "@/contexts/AuthContext";

export default function UnderstoodPage() {
  const [understoodRecords, setUnderstoodRecords] = useState<
    Array<{ record: UnderstoodRecord & { id: string }; fragment: TermFragment | null }>
  >([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchUnderstoodRecords = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await getUnderstoodRecordsWithFragments(user.uid);
        if (result.success && result.data) {
          setUnderstoodRecords(result.data);
        } else {
          console.error("理解記録の取得に失敗しました:", result.error);
        }
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
                <UnderstoodTermCard
                  key={record.record.id}
                  record={{
                    fragmentId: record.record.fragmentId,
                    version: record.record.acceptanceLevel,
                    understoodAt: { seconds: Math.floor(record.record.createdAt.getTime() / 1000) },
                    ...(record.fragment && { fragment: { title: record.fragment.title } }),
                  }}
                />
              ))
            )}
          </Flex>
        )}
      </PageLayout>
    </AuthGuard>
  );
}
