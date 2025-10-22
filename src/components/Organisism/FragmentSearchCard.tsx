import { Card, Heading, Box, Badge, Flex } from "@radix-ui/themes";
import Link from "next/link";

interface FragmentSearchCardProps {
  fragment: {
    id: string;
    title: string;
    tags: string[];
  };
}

export default function FragmentSearchCard({ fragment }: FragmentSearchCardProps) {
  return (
    <Link href={`/fragment/${fragment.id}`} className="no-underline">
      <Card
        size="3"
        className="border-2 border-dashed border-[#00ADB5] hover:border-solid hover:shadow-md transition-all cursor-pointer"
      >
        <Flex direction="column" gap="3">
          <Heading size="5" color="gray" className="underline">
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
