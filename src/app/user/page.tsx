import {
  Box,
  Flex,
  Heading,
  Button,
  Container,
  Avatar,
} from "@radix-ui/themes";
import Header from "../components/Header";
import Link from "next/link";

// ユーザー情報（後でAPIから取得に置き換え）
const userData = {
  id: "4",
  username: "4 11",
  initials: "41", // アバター表示用
};

export default function UserPage() {
  return (
    <Box className="min-h-screen">
      <Header showNumber={true} number={userData.id} />

      <Container size="1" className="px-6 py-8">
        {/* Profile Section */}
        <Flex direction="column" align="center" gap="4" className="mb-8">
          <Avatar
            size="7"
            fallback={userData.initials}
            style={{ backgroundColor: "#00ADB5", color: "white" }}
          />
          <Heading size="6" color="gray">
            {userData.username}
          </Heading>
        </Flex>

        {/* Menu Buttons */}
        <Flex direction="column" gap="4">
          <Link href="/understood" className="no-underline">
            <Button
              size="4"
              className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white rounded-lg py-4"
            >
              理解した規約片
            </Button>
          </Link>

          <Link href="/terms" className="no-underline">
            <Button
              size="4"
              className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white rounded-lg py-4"
            >
              作成した利用規約
            </Button>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}
