"use client";

import { Box, Flex, Heading, Button, Container, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useState } from "react";
import { useFragments } from "@/hooks/useFragments";
import { useAuth } from "@/contexts/AuthContext";
import FragmentSearchCard from "@/components/Organisims/FragmentSearchCard";
import NewFragmentDialog from "@/components/Organisims/NewFragmentDialog";

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: fragments, loading, error } = useFragments();

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

  const renderContent = () => {
    if (loading) {
      return (
        <Box className="text-center py-8">
          <Heading size="4" color="gray">
            読み込み中...
          </Heading>
        </Box>
      );
    }

    if (error) {
      return (
        <Box className="text-center py-8">
          <Heading size="4" color="red">
            {error}
          </Heading>
        </Box>
      );
    }

    if (fragments) {
      return (
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
      );
    }

    return null;
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

        {renderContent()}
      </Container>
      {user && <NewFragmentDialog />}
    </Box>
  );
}
