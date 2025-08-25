import { Text, Box, Flex, Heading } from "@radix-ui/themes";

export default function Header() {
  return (
    <header className="bg-teal-50 border-b border-teal-300 px-6 py-4 shadow-sm">
      <Flex align="center" gap="3">
        <Box>
          <img className="h-10 w-auto" src="/Douit.png" alt="Douit Logo" />
        </Box>
        <Heading size="6" color="teal" weight="bold">
          Douit
        </Heading>
      </Flex>
    </header>
  );
}
