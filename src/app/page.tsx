import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, Flex, TextField } from "@radix-ui/themes";

export default function MyApp() {
  return (
    <Flex p="4" gap="4" justify={"center"}>
      <TextField.Root placeholder="タグで規約片を検索">
        <TextField.Slot>
          <MagnifyingGlassIcon width="18" height="18" />
        </TextField.Slot>
      </TextField.Root>
      <Button>検索</Button>
    </Flex>
  );
}
