"use client";

import { Box, Heading, Card, Flex, Text } from "@radix-ui/themes";

export interface ParameterData {
  [key: string]: string;
}

interface ParameterDisplayProps {
  title: string;
  parameters: ParameterData;
  className?: string;
}

export default function ParameterDisplay({
  title,
  parameters,
  className = "mb-6"
}: ParameterDisplayProps) {
  if (Object.keys(parameters).length === 0) {
    return null;
  }

  return (
    <Box className={className}>
      <Heading size="4" className="mb-4">
        {title}
      </Heading>
      <Card className="p-4">
        {Object.entries(parameters).map(([key, value]) => (
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
