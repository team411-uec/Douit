import { Box, Flex, Heading, Button, Text, Container, Card, Separator } from "@radix-ui/themes";
import { CopyIcon, CheckIcon, Cross2Icon, QuestionMarkIcon } from "@radix-ui/react-icons";
import Header from "../../components/Header";

type TermDetail = {
  id: string;
  title: string;
  author: string;
  commonParams: {
    provider: string;
    contact: string;
  };
  fragments: {
    id: string;
    title: string;
    status: "approved" | "rejected" | "none";
    author?: string;
    params?: Record<string, string>;
  }[];
};

// テストデータ（後でAPIから取得に置き換え）
const termDetailData: TermDetail = {
  id: "1",
  title: "サークル会則",
  author: "team411",
  commonParams: {
    provider: "team411",
    contact: "000-0000-0000"
  },
  fragments: [
    {
      id: "1",
      title: "PrivacyPolicy for Web...",
      status: "approved",
      author: "fuga",
      params: { HOGE: "fuga" }
    },
    {
      id: "2", 
      title: "PrivacyPolicy",
      status: "rejected",
      params: { FOO: "BAR", CONTACT: "000-0000-0000" }
    },
    {
      id: "3",
      title: "No Param Sample",
      status: "approved"
    }
  ]
};

// ステータスに応じたアイコンを返す関数
function getStatusIcon(status: "approved" | "rejected" | "none"): React.ReactNode {
  switch (status) {
    case "approved": return <CheckIcon width="16" height="16" />;
    case "rejected": return <Cross2Icon width="16" height="16" />;
    default: return <QuestionMarkIcon width="16" height="16" />;
  }
}

// ステータスに応じたTailwindクラスを返す関数
function getStatusTextClass(status: "approved" | "rejected" | "none"): string {
  switch (status) {
    case "approved": return "text-green-600";
    case "rejected": return "text-red-600";
    default: return "text-gray-500";
  }
}

export default function TermDetailPage({ 
  params 
}: { 
  params: { termid: string } 
}) {
  return (
    <Box className="min-h-screen">
      <Header showNumber={true} number="4" />
      
      <Container size="1" px="4" py="6">
        {/* Title */}
        <Heading size="6" color="gray" mb="2">
          {termDetailData.title}
        </Heading>
        <Text size="3" color="gray" mb="6">
          {termDetailData.author}
        </Text>

        {/* Common Parameters */}
        <Box mb="6">
          <Heading size="5" color="gray" mb="4">
            共通パラメータ
          </Heading>
          <Card size="2">
            <Flex direction="column" gap="2">
              <Flex justify="between">
                <Text size="3" color="gray">PROVIDER</Text>
                <Text size="3" color="gray">{termDetailData.commonParams.provider}</Text>
              </Flex>
              <Flex justify="between">
                <Text size="3" color="gray">CONTACT</Text>
                <Text size="3" color="gray">{termDetailData.commonParams.contact}</Text>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {/* Fragments */}
        <Flex direction="column" gap="4" mb="6">
          {termDetailData.fragments.map((fragment) => (
            <FragmentCard key={fragment.id} fragment={fragment} />
          ))}
        </Flex>

        {/* Share Button */}
        <Button 
          size="3" 
          className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white"
        >
          <CopyIcon width="16" height="16" />
          共有リンクをコピー
        </Button>
      </Container>
    </Box>
  );
}

type FragmentCardProps = {
  fragment: TermDetail['fragments'][0];
};

function FragmentCard({ fragment }: FragmentCardProps) {
  return (
    <Card size="2">
      <Flex align="center" justify="between" className="mb-3">
        <Flex align="center" gap="2">
          <Box className={getStatusTextClass(fragment.status)}>
            {getStatusIcon(fragment.status)}
          </Box>
          <Heading size="4" className={getStatusTextClass(fragment.status)}>
            {fragment.title}
          </Heading>
        </Flex>
        <Button 
          size="2" 
          className={fragment.status === "rejected" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#00ADB5] hover:bg-[#009AA2] text-white"}
        >
          読む
        </Button>
      </Flex>
      
      {/* Parameters */}
      {fragment.params && Object.entries(fragment.params).map(([key, value], index) => (
        <Box key={key}>
          {index > 0 && <Separator my="1" />}
          <Flex justify="between">
            <Text size="2" color="gray">{key}</Text>
            <Text size="2" color="gray">{value}</Text>
          </Flex>
        </Box>
      ))}
      
      {fragment.author && (
        <Box>
          <Separator my="1" />
          <Flex justify="between">
            <Text size="2" color="gray">CONTACT</Text>
            <Text size="2" color="gray">000-0000-0000</Text>
          </Flex>
        </Box>
      )}
    </Card>
  );
}
