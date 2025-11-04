'use client';

import { Box, Container } from '@radix-ui/themes';
import Header from '@/components/ui/Header';
import { useFragments } from '@/features/fragment/hooks/useFragments';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import NewFragmentDialog from '@/features/fragment/components/NewFragmentDialog';
import SearchBar from '@/components/ui/SearchBar';
import FragmentList from '@/features/fragment/components/FragmentList';

export default function HomePage() {
  const { user } = useAuth();
  const { data: fragments, loading, error } = useFragments();

  const handleSearch = (query: string) => {
    window.location.href = `/search/${encodeURIComponent(query)}`;
  };

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        <SearchBar onSearch={handleSearch} />
        <FragmentList fragments={fragments} loading={loading} error={error} />
      </Container>
      {user && <NewFragmentDialog />}
    </Box>
  );
}
