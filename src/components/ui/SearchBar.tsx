'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button, Flex, TextField } from '@radix-ui/themes';
import { useState } from 'react';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Flex gap="3" className="mb-6">
      <TextField.Root
        size="3"
        placeholder="規約片をタグで検索"
        className="flex-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
  );
}
