import { Box, Flex, Heading, Avatar } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  showNumber?: boolean;
  number?: string;
  showUserIcon?: boolean;
};

export default function Header({ showNumber = false, number = "4", showUserIcon = false }: HeaderProps) {
  return (
    <Box 
      asChild
      className="border-b px-4 py-3"
    >
      <header>
        <Flex align="center" justify="between">
          {/* Left side - Logo */}
          <Flex align="center" gap="2">
            <Link href="/" className="no-underline">
              <Box 
                width="32px" 
                height="32px" 
                className="flex items-center justify-center cursor-pointer"
              >
                <Image 
                  src="/Douit.svg" 
                  alt="Douit Logo" 
                  width={24} 
                  height={24}
                />
              </Box>
            </Link>
          </Flex>

          {/* Center - Title */}
          <Link href="/" className="no-underline">
            <Heading size="5" weight="bold" color="gray" className="cursor-pointer">
              Douit
            </Heading>
          </Link>

          {/* Right side - Number or User Icon */}
          <Box 
            width="40px" 
            height="32px" 
            className="flex items-center justify-center"
          >
            {showUserIcon ? (
              <Link href="/user" className="no-underline">
                <Avatar
                  size="2"
                  fallback="U"
                  style={{ backgroundColor: "#00ADB5", color: "white" }}
                  className="cursor-pointer"
                />
              </Link>
            ) : showNumber ? (
              <Link href="/user" className="no-underline">
                <Avatar
                  size="2"
                  fallback={number}
                  style={{ backgroundColor: "#00ADB5", color: "white" }}
                  className="cursor-pointer"
                />
              </Link>
            ) : null}
          </Box>
        </Flex>
      </header>
    </Box>
  );
}
