import { Box, Flex, Heading } from "@radix-ui/themes";
import FragmentSearchCard from "@/features/search/components/FragmentSearchCard";
import { TermFragment } from "@/types";

type FragmentListProps = {
  fragments: TermFragment[] | null;
  loading: boolean;
  error: string | null;
};

export default function FragmentList({ fragments, loading, error }: FragmentListProps) {
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
}
