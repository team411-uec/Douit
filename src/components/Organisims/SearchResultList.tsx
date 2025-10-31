"use client";

import { Box, Flex, Heading } from "@radix-ui/themes";
import FragmentSearchCard from "@/components/Organisims/FragmentSearchCard";
import { TermFragment } from "@/domains/types";

type SearchResultListProps = {
  fragments: TermFragment[];
  loading: boolean;
  searchTag: string;
};

export default function SearchResultList({ fragments, loading, searchTag }: SearchResultListProps) {
  if (loading) {
    return (
      <Box className="text-center py-8">
        <Heading size="4" color="gray">
          読み込み中...
        </Heading>
      </Box>
    );
  }

  return (
    <>
      {searchTag && (
        <Box className="mb-4">
          <Heading size="4" color="gray">
            「{searchTag}」の検索結果: {fragments.length}件
          </Heading>
        </Box>
      )}
      <Flex direction="column" gap="4">
        {fragments.map(fragment => (
          <FragmentSearchCard
            key={fragment.id}
            fragment={{
              id: fragment.id,
              title: fragment.title,
              tags: fragment.tags,
            }}
          />
        ))}
      </Flex>
    </>
  );
}
