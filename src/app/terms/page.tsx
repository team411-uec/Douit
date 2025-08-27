import { Box, Flex, Heading, Button, Container, Card } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import Header from "../components/Header";
import Link from "next/link";

// ユーザー情報（後でAPIから取得に置き換え）
const userData = {
  id: "4",
  username: "4 11",
  initials: "41"
};

type TermsItem = {
  id: string;
  title: string;
};

// テストデータ（後でAPIから取得に置き換え）
const termsData: TermsItem[] = [
  { id: "1", title: "サークル会則" },
];

export default function TermsPage() {
  return (
    <Box className="min-h-screen">
      <Header showNumber={true} number={userData.id} />
      
      <Container size="1" className="px-6 py-6">
        {/* Terms List */}
        <Flex direction="column" gap="3" className="mb-6">
          {termsData.map((term) => (
            <TermsCard key={term.id} term={term} />
          ))}
        </Flex>

        {/* Add Button - Fixed position */}
        <Box className="fixed bottom-6 right-6">
          <Button 
            size="4" 
            className="w-14 h-14 rounded-full bg-[#00ADB5] hover:bg-[#009AA2] text-white shadow-lg"
          >
            <PlusIcon width="24" height="24" />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

type TermsCardProps = {
  term: TermsItem;
};

function TermsCard({ term }: TermsCardProps) {
  return (
    <Card size="2">
      <Heading size="4" color="gray">
        {term.title}
      </Heading>
    </Card>
  );
}
