"use client";

import { Card, Flex, Heading, Box } from "@radix-ui/themes";
import Link from "next/link";

export interface UnderstoodRecordData {
  fragmentId: string;
  version: number;
  understoodAt?: {
    seconds: number;
  };
  fragment?: {
    title: string;
  };
}

interface UnderstoodTermCardProps {
  record: UnderstoodRecordData;
}

export default function UnderstoodTermCard({ record }: UnderstoodTermCardProps) {
  return (
    <Link href={`/fragment/${record.fragmentId}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex align="center" justify="between">
          <Heading size="4" color="gray" className="flex-1">
            {record.fragment?.title || "規約片"}
          </Heading>
          <Flex align="center" gap="2">
            <Box className="text-sm text-gray-500">v{record.version}</Box>
            <Box className="text-sm text-gray-500">
              {record.understoodAt
                ? new Date(record.understoodAt.seconds * 1000).toLocaleDateString()
                : ""}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
