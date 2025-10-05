"use client";

import { Flex, Heading } from "@radix-ui/themes";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import UnderstoodTermCard from "@/components/UI/UnderstoodTermCard";
import { useState, useEffect } from "react";
import { getUnderstoodRecordsWithFragments } from "@/functions/understandingService";
import { useAuth } from "@/contexts/AuthContext";

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
