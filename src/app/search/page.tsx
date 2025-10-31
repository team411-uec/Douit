"use client";

import { Box, Container } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { useFragments } from "@/hooks/useFragments";
import { useAuth } from "@/contexts/AuthContext";
import NewFragmentDialog from "@/components/Organisims/NewFragmentDialog";
import SearchBar from "@/components/Molecules/SearchBar";
import FragmentList from "@/components/Organisims/FragmentList";

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
