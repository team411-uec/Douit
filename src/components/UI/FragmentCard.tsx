"use client";

import { Card, Flex, Heading, Box, Badge } from "@radix-ui/themes";
import Link from "next/link";

export type FragmentCardData = {
  id: string;
  title: string;
  tags: string[];
};

interface FragmentCardProps {
  fragment: FragmentCardData;
}

export default function FragmentCard({ fragment }: FragmentCardProps) {
  return (
    <Link href={`/fragment/${fragment.id}`} className="no-underline">
      <Card
        size="3"
        className="border-2 hover:border-solid hover:shadow-md transition-all cursor-pointer"
      >
        <Flex direction="column" gap="3">
          <Heading size="5" color="gray">
            {fragment.title}
          </Heading>

          <Flex align="center" gap="2" wrap="wrap">
            <Box className="text-gray-600">Tags</Box>
            {fragment.tags.map((tag, index) => (
              <Badge key={index} size="2" className="bg-[#00ADB5] text-white">
                {tag}
              </Badge>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
