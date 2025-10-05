"use client";

import { Flex, Heading, Text, Card, Link, Button, Box } from "@radix-ui/themes";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ParameterDisplay from "@/components/UI/ParameterDisplay";
import FragmentCheckCard from "@/components/UI/FragmentCheckCard";
import { useState, useEffect, use } from "react";
import { getUserTermSetWithFragments } from "@/functions/termSetService";
import { getTermFragment } from "@/functions/termFragments";
import { isFragmentUnderstood } from "@/functions/understandingService";
import { TermFragment, FragmentRef } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

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
      <PageLayout showUserIcon={true}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error || !termSetData) {
    return (
      <PageLayout showUserIcon={true}>
        <EmptyState
          title={error || "規約セットが見つかりませんでした"}
        />
      </PageLayout>
    );
  }

  const commonParams = getCommonParameters();

  return (
    <PageLayout showUserIcon={true}>
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
        <ParameterDisplay
          title="共通パラメータ"
          parameters={commonParams}
        />

        {/* Fragments List */}
        <Box>
          {fragments.map((fragment, index) => (
            <FragmentCheckCard
              key={fragment.ref.fragmentId}
              fragment={fragment}
              commonParams={commonParams}
            />
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
    </PageLayout>
  );
}
