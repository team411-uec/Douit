"use client";

import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";

export type TermsItemData = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

interface TermsCardProps {
  term: TermsItemData;
}

export default function TermsCard({ term }: TermsCardProps) {
  return (
    <Link href={`/terms/${term.id}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex direction="column" gap="2">
          <Heading size="4" color="gray">
            {term.title}
          </Heading>
          {term.description && (
            <Text size="2" color="gray">
              {term.description}
            </Text>
          )}
          <Text size="1" color="gray">
            作成日: {term.createdAt.toLocaleDateString()}
          </Text>
        </Flex>
      </Card>
    </Link>
  );
}
