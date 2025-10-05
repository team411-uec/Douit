"use client";

import { Card, Flex, Box, Heading, Text, Button } from "@radix-ui/themes";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ParameterData } from "./ParameterDisplay";

export interface FragmentCheckData {
  ref: {
    fragmentId: string;
    parameterValues: ParameterData;
  };
  data: {
    title: string;
  };
  understood: boolean;
}

interface FragmentCheckCardProps {
  fragment: FragmentCheckData;
  commonParams: ParameterData;
}

export default function FragmentCheckCard({ fragment, commonParams }: FragmentCheckCardProps) {
  return (
    <Card
      className={`mb-4 p-4 border-l-4 ${
        fragment.understood
          ? "border-l-green-500 bg-green-50"
          : "border-l-red-500 bg-red-50"
      }`}
    >
      <Flex align="center" justify="between">
        <Flex align="center" gap="3" className="flex-1">
          {/* Status Icon */}
          {fragment.understood ? (
            <CheckIcon width="20" height="20" className="text-green-500" />
          ) : (
            <Cross2Icon width="20" height="20" className="text-red-500" />
          )}

          {/* Fragment Info */}
          <Box className="flex-1">
            <Heading
              size="4"
              className={`mb-2 ${fragment.understood ? "text-green-700" : "text-red-700"}`}
            >
              {fragment.data.title}
            </Heading>

            {/* Fragment-specific Parameters */}
            {Object.entries(fragment.ref.parameterValues).map(([key, value]) => {
              // 共通パラメータは表示しない
              if (commonParams[key]) return null;

              return (
                <Flex key={key} gap="2" className="mb-1">
                  <Text size="2" color="gray">
                    {key}
                  </Text>
                  <Text size="2" weight="bold">
                    {value}
                  </Text>
                </Flex>
              );
            })}
          </Box>
        </Flex>

        {/* Read Button */}
        <Link href={`/fragment/${fragment.ref.fragmentId}`}>
          <Button
            size="2"
            className={`${
              fragment.understood
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            読む
          </Button>
        </Link>
      </Flex>
    </Card>
  );
}
