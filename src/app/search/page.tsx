import {
  Box,
  Flex,
  Heading,
  Button,
  Container,
  Card,
  TextField,
  Badge,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Header from "../components/Header";
import Link from "next/link";
import { Suspense } from "react";

type FragmentCard = {
  id: string;
  title: string;
  tags: string[];
};

// テストデータ（後でAPIから取得に置き換え）
const fragmentsData: FragmentCard[] = [
  {
    id: "1",
    title: "PrivacyPolicy for Website",
    tags: ["ウェブ", "プライバシーポリシー"],
  },
  {
    id: "2",
    title: "Do not trust",
    tags: ["ライブ", "禁止", "ゴミ"],
  },
  {
    id: "3",
    title: "Do not sleep",
    tags: ["授業", "禁止"],
  },
];

function SearchContent({ searchParams }: { searchParams: { tag?: string } }) {
  const searchTag = searchParams.tag;

  const filteredFragments = searchTag
    ? fragmentsData.filter((fragment) =>
        fragment.tags.some((tag) => tag.includes(searchTag))
      )
    : fragmentsData;

  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-6">
        {/* Search Section */}
        <Flex gap="3" className="mb-6">
          <TextField.Root
            placeholder="規約片をタグで検索"
            className="flex-1"
            defaultValue={searchTag || ""}
          >
            <TextField.Slot side="left">
              <MagnifyingGlassIcon width="16" height="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button
            size="3"
            className="bg-[#00ADB5] hover:bg-[#009AA2] text-white px-6"
          >
            検索
          </Button>
        </Flex>

        {/* Search Results */}
        {searchTag && (
          <Box className="mb-4">
            <Heading size="4" color="gray">
              「{searchTag}」の検索結果: {filteredFragments.length}件
            </Heading>
          </Box>
        )}

        {/* Fragment Cards */}
        <Flex direction="column" gap="4">
          {filteredFragments.map((fragment) => (
            <FragmentSearchCard key={fragment.id} fragment={fragment} />
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

type FragmentSearchCardProps = {
  fragment: FragmentCard;
};

function FragmentSearchCard({ fragment }: FragmentSearchCardProps) {
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
