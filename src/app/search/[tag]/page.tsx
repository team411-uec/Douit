'use client';

import { Box, Container } from '@radix-ui/themes';
import { Suspense, use } from 'react';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import { useFragments } from '@/features/fragment/hooks/useFragments';
import SearchResultList from '@/features/search/components/SearchResultList';

export default function SearchPage({ params }: { params: Promise<{ tag: string }> }) {
  function SearchContent({ params }: { params: Promise<{ tag: string }> }) {
    const resolvedParams = use(params);
    const searchTag = resolvedParams.tag ? decodeURIComponent(resolvedParams.tag) : '';

    const handleSearch = (query: string) => {
      if (query.trim()) {
        window.location.href = `/search/${encodeURIComponent(query)}`;
      }
    };

    const { data: fragments, loading } = useFragments(searchTag);

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent params={params} />
    </Suspense>
  );
}
