import { Box, Flex, Heading, Button, Container, Card } from "@radix-ui/themes";
import Header from "../components/Header";
import Link from "next/link";

// ユーザー情報（後でAPIから取得に置き換え）
const userData = {
  id: "4",
  username: "4 11",
  initials: "41",
};

type TermItem = {
  id: string;
  title: string;
  href: string;
};

// テストデータ（後でAPIから取得に置き換え）
const understoodTerms: TermItem[] = [
  { id: "1", title: "PrivacyPolicy for Web", href: "/fragment/1" },
  { id: "2", title: "PrivacyPolicy", href: "/fragment/2" },
];

export default function UnderstoodPage() {
  return (
    <Box className="min-h-screen">
      <Header showNumber={true} number={userData.id} />

      <Container size="1" className="px-6 py-6">
        {/* Menu Buttons */}
        <Flex direction="column" gap="4">
          {understoodTerms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

type TermCardProps = {
  term: TermItem;
};

function TermCard({ term }: TermCardProps) {
  return (
    <Card size="2">
      <Flex align="center" justify="between">
        <Heading size="4" color="gray" className="flex-1">
          {term.title}
        </Heading>
        <Link href={term.href} className="no-underline">
          <Button
            size="2"
            className="bg-[#00ADB5] hover:bg-[#009AA2] text-white"
          >
            読む
          </Button>
        </Link>
      </Flex>
    </Card>
  );
}
