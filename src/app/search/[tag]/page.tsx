"use client";

import { Box, Flex, Heading, Button, Container, Card, TextField, Badge } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Header from "@/components/Header";
import Link from "next/link";
import { Suspense, useState, useEffect, use } from "react";
import { searchTermFragments } from "@/functions/tagSearch";
import { TermFragment } from "@/types";

type FragmentCard = {
  id: string;
  title: string;
  tags: string[];
};

function SearchContent({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = use(params);
  const searchTag = resolvedParams.tag ? decodeURIComponent(resolvedParams.tag) : "";
  const [fragments, setFragments] = useState<{ id: string; data: TermFragment }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchTag);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setLoading(true);
        const results = await searchTermFragments(searchTag);
        setFragments(results);
      } catch (error) {
        console.error("規約片の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFragments();
  }, [searchTag]);

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        {/* Search Section */}
        <Flex gap="3" className="mb-6">
          <TextField.Root
            placeholder="規約片をタグで検索"
            className="flex-1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          >
            <TextField.Slot side="left">
              <MagnifyingGlassIcon width="16" height="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button
            size="3"
            className="bg-[#00ADB5] hover:bg-[#009AA2] text-white px-6"
            onClick={handleSearch}
          >
            検索
          </Button>
        </Flex>

        {/* Search Results */}
        {searchTag && (
          <Box className="mb-4">
            <Heading size="4" color="gray">
              「{searchTag}」の検索結果: {fragments.length}件
            </Heading>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        )}

        {/* Fragment Cards */}
        {!loading && (
          <Flex direction="column" gap="4">
            {fragments.map(fragmentItem => (
              <FragmentSearchCard
                key={fragmentItem.id}
                fragment={{
                  id: fragmentItem.id,
                  title: fragmentItem.data.title,
                  tags: fragmentItem.data.tags,
                }}
              />
            ))}
          </Flex>
        )}
      </Container>
    </Box>
  );
}

export default function SearchPage({ params }: { params: Promise<{ tag: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent params={params} />
    </Suspense>
  );
}

type FragmentSearchCardProps = {
  fragment: FragmentCard;
};

function FragmentSearchCard({ fragment }: FragmentSearchCardProps) {
  return (
    <Link href={`/fragment/${fragment.id}`} className="no-underline">
      <Card
        size="3"
        className="border-2 border-dashed border-[#00ADB5] hover:border-solid hover:shadow-md transition-all cursor-pointer"
      >
        <Flex direction="column" gap="3">
          <Heading size="5" color="gray" className="underline">
            {fragment.title}
          </Heading>

          <Flex align="center" gap="2" wrap="wrap">
            <Box className="text-gray-600">Tags</Box>
            {fragment.tags.map((tag, index) => (
              <Badge key={index} size="2" className="bg-[#00ADB5] text-white">
                {tag}
              </Badge>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
