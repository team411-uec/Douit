"use client";

import { Box, Flex, Heading, Button, Container, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useState, useEffect } from "react";
import { getAllTermFragments } from "@/repositories/tagSearch";
import { TermFragment } from "@/domains/types";
import { useAuth } from "@/contexts/AuthContext";
import FragmentSearchCard from "@/components/Organisims/FragmentSearchCard";
import NewFragmentDialog from "@/components/Organisims/NewFragmentDialog";

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fragments, setFragments] = useState<TermFragment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setLoading(true);
        const results = await getAllTermFragments();
        setFragments(results);
      } catch (error) {
        console.error("規約片の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFragments();
  }, []);

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

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        <Flex gap="3" className="mb-6">
          <TextField.Root
            size="3"
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

        {loading ? (
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              読み込み中...
            </Heading>
          </Box>
        ) : (
          <Flex direction="column" gap="4">
            {fragments.map(fragmentItem => (
              <FragmentSearchCard
                key={fragmentItem.id}
                fragment={{
                  id: fragmentItem.id,
                  title: fragmentItem.title,
                  tags: fragmentItem.tags,
                }}
              />
            ))}
          </Flex>
        )}
      </Container>
      {user && <NewFragmentDialog />}
    </Box>
  );
}
