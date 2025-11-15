import { Box, Text } from '@radix-ui/themes';
import type { FragmentWithData } from '@/features/fragment/hooks/useFragmentsWithStatus';

interface UnderstandingSummaryProps {
  fragments: FragmentWithData[];
}

export default function UnderstandingSummary({ fragments }: UnderstandingSummaryProps) {
  if (fragments.length === 0) {
    return null;
  }

  return (
    <Box className="mt-8 text-center">
      <Text size="3" color="gray">
        理解済み: {fragments.filter((f) => f.understood).length} / {fragments.length}
      </Text>
    </Box>
  );
}
