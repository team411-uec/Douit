import { Box, Text, Flex, Heading, ScrollArea } from "@radix-ui/themes";

interface ScrollProps {
  scroll_partial_content: string;
  scroll_partial_name: string;
}

const ScrollBlock = ({
  scroll_partial_content,
  scroll_partial_name,
}: ScrollProps) => {
  return (
    <Box>
      <Heading size="4" mb="2" trim="start">
        {scroll_partial_name}
      </Heading>
      <div
        style={{
          borderColor: "gray",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: 180 }}
          size="1"
        >
          <Box p="3" pr="8">
            <Flex direction="column" gap="4">
              <Text as="p">{scroll_partial_content}</Text>
            </Flex>
          </Box>
        </ScrollArea>
      </div>
    </Box>
  );
};

export default ScrollBlock;
