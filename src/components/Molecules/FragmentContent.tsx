import { Box, Text, ScrollArea } from "@radix-ui/themes";
import { TermFragment } from "@/domains/types";

type FragmentContentProps = {
  fragmentData: TermFragment;
};

export default function FragmentContent({ fragmentData }: FragmentContentProps) {
  return (
    <ScrollArea className="h-96 mb-6">
      <Box className="pr-4">
        <Text size="3" className="leading-relaxed text-gray-900 whitespace-pre-line">
          {fragmentData.content}
        </Text>
      </Box>
    </ScrollArea>
  );
}
