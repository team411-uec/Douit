import { Flex, SegmentedControl } from "@radix-ui/themes";
import { CiFaceSmile } from "react-icons/ci";
import { FaQuestion } from "react-icons/fa";

export default function Understand() {
  return (
    <Flex gap="3" justify="center" align="center">
      <FaQuestion />

      <SegmentedControl.Root defaultValue="inbox">
        <SegmentedControl.Item value="知らない">知らない</SegmentedControl.Item>
        <SegmentedControl.Item value="理解した">理解した</SegmentedControl.Item>
      </SegmentedControl.Root>

      <CiFaceSmile />
    </Flex>
  );
}
