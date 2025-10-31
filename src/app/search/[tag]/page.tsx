"use client";

import { Suspense, use } from "react";
import Header from "@/components/Organisims/Header";
import { Box, Container } from "@radix-ui/themes";
import { useFragments } from "@/hooks/useFragments";
import SearchBar from "@/components/Molecules/SearchBar";
import SearchResultList from "@/components/Organisims/SearchResultList";

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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search/${encodeURIComponent(query)}`;
    }
  };

  const [fragments, loading] = useFragments(searchTag);

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        <SearchBar onSearch={handleSearch} />
        <SearchResultList fragments={fragments} loading={loading} searchTag={searchTag} />
      </Container>
    </Box>
  );
}
