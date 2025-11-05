import { Flex, Heading, Select } from '@radix-ui/themes';
import type { TermFragment } from '@/types';

type FragmentHeaderProps = {
  fragmentData: TermFragment;
};

export default function FragmentHeader({ fragmentData }: FragmentHeaderProps) {
  return (
    <Flex align="center" justify="between" className="mb-6">
      <Heading size="6" color="gray" className="flex-1">
        {fragmentData.title}
      </Heading>
      <Select.Root defaultValue={`v${fragmentData.currentVersion}`}>
        <Select.Trigger className="w-20" />
        <Select.Content>
          {Array.from({ length: fragmentData.currentVersion }, (_, i) => (
            <Select.Item key={`v${i + 1}`} value={`v${i + 1}`}>
              v{i + 1}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
