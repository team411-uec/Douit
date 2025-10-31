import { Box, Flex, Heading, Text, Card } from "@radix-ui/themes";

type CommonParametersCardProps = {
  commonParams: Record<string, string>;
};

export default function CommonParametersCard({ commonParams }: CommonParametersCardProps) {
  if (Object.keys(commonParams).length === 0) {
    return null;
  }

  return (
    <Box className="mb-6">
      <Heading size="4" className="mb-4">
        共通パラメータ
      </Heading>
      <Card className="p-4">
        {Object.entries(commonParams).map(([key, value]) => (
          <Flex key={key} justify="between" align="center" className="mb-2 last:mb-0">
            <Text size="3" weight="medium" className="text-gray-600">
              {key}
            </Text>
            <Text size="3" weight="bold">
              {value}
            </Text>
          </Flex>
        ))}
      </Card>
    </Box>
  );
}
