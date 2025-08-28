import { Box, Card, Text, Flex, Heading, Button } from "@radix-ui/themes";

interface KiyakuNameProps {
  kiyakuName: string;
}

const KiyakuTanzaku = ({ kiyakuName }: KiyakuNameProps) => {
  return (
    <Box>
      <Card>
        <Flex gap="3" align="center" justify="between">
          <Heading size="4" mb="2" trim="normal" align="center">
            {kiyakuName}
          </Heading>
          <Button>読む</Button>
        </Flex>
      </Card>
    </Box>
  );
};

export default KiyakuTanzaku;
