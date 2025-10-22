"use client";

import { Suspense, use, useState } from "react";
import Header from "@/components/Header";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Container, Flex, TextField, Button, Heading } from "@radix-ui/themes";
import FragmentSearchCard from "@/components/Organisims/FragmentSearchCard";
import { useFragments } from "@/hooks/useFragments";

export default function SearchPage({ params }: { params: Promise<{ tag: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent params={params} />
    </Suspense>
  );
}

export function SearchContent({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = use(params);
  const searchTag = resolvedParams.tag ? decodeURIComponent(resolvedParams.tag) : "";
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

  const [fragments, loading] = useFragments(searchTag);

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
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
          <Button size="3" onClick={handleSearch}>
            検索
          </Button>
        </Flex>

        {searchTag && (
          <Box className="mb-4">
            <Heading size="4" color="gray">
              「{searchTag}」の検索結果: {fragments.length}件
            </Heading>
          </Box>
        )}

        {loading && (
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        )}

        {!loading && (
          <Flex direction="column" gap="4">
            {fragments.map(fragment => (
              <FragmentSearchCard
                key={fragment.id}
                fragment={{
                  id: fragment.id,
                  title: fragment.data.title,
                  tags: fragment.data.tags,
                }}
              />
            ))}
          </Flex>
        )}
      </Container>
    </Box>
  );
}
