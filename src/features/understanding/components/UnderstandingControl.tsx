import { Flex, SegmentedControl } from "@radix-ui/themes";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

type UnderstandingControlProps = {
  understanding: "understood" | "unknown";
  onUnderstandingChange: (value: "understood" | "unknown") => void;
};

export default function UnderstandingControl({
  understanding,
  onUnderstandingChange,
}: UnderstandingControlProps) {
  return (
    <Flex justify="center" align="center" gap="4" className="mt-8">
      <Cross2Icon width="24" height="24" className="text-red-500" />
      <SegmentedControl.Root value={understanding} onValueChange={onUnderstandingChange} size="3">
        <SegmentedControl.Item value="unknown">知らない</SegmentedControl.Item>
        <SegmentedControl.Item value="understood">理解した</SegmentedControl.Item>
      </SegmentedControl.Root>
      <CheckIcon width="24" height="24" className="text-green-500" />
    </Flex>
  );
}
