import { Box, Card, Text, Flex, Heading, Button } from "@radix-ui/themes";

interface FragmentCardProps {
  cardName: string;
  writerName: string;
  tags: string[];
}

const FragmentCard = ({ cardName, writerName, tags }: FragmentCardProps) => {
  const renderTags = () => {
    return (
      <Flex gap="2">
        <Text size="1" color="gray">
          Tags:
        </Text>
        {tags.map((tag, index) => (
          <Button key={index} variant="soft" size="1">
            {tag}
          </Button>
        ))}
      </Flex>
    );
  };

  return (
    <Box>
      <Card>
        <Flex gap="3" align="start" justify="between" direction="column">
          <Heading size="4" mb="2" trim="normal" align="center">
            {cardName}
          </Heading>
          <Text as="div" size="2" color="gray">
            by {writerName}
          </Text>
          <Box overflow="hidden">{renderTags()}</Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default FragmentCard;
