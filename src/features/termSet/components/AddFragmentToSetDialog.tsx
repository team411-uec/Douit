'use client';

import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { LabeledSelect, LabeledTextField } from '@/components/ui/HTMLForms';
import type { TermFragment, TermSet } from '@/types';

interface AddFragmentToSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fragmentData: TermFragment | null;
  userTermSets: TermSet[] | null;
  onConfirm: (termSetId: string, parameterValues: Record<string, string>) => void;
}

export default function AddFragmentToSetDialog({
  open,
  onOpenChange,
  fragmentData,
  userTermSets,
  onConfirm,
}: AddFragmentToSetDialogProps) {
  const [selectedTermSet, setSelectedTermSet] = useState<string>('');
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});

  const handleConfirm = () => {
    onConfirm(selectedTermSet, parameterValues);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>規約セットに追加</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          このフラグメントを追加する規約セットを選択してください。
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <LabeledSelect
            name="termSet"
            label="規約セット"
            value={selectedTermSet}
            onValueChange={setSelectedTermSet}
            placeholder="規約セットを選択してください"
          >
            {userTermSets?.map((termSet) => (
              <Select.Item key={termSet.id} value={termSet.id}>
                {termSet.title}
              </Select.Item>
            ))}
          </LabeledSelect>

          {fragmentData?.parameters && fragmentData.parameters.length > 0 && (
            <>
              <Text as="div" size="2" weight="bold" mt="2">
                パラメータ値
              </Text>
              {fragmentData.parameters.map((param) => (
                <LabeledTextField
                  key={param}
                  name={param}
                  label={param}
                  placeholder={`${param}の値を入力`}
                  value={parameterValues[param] || ''}
                  onChange={(e) =>
                    setParameterValues((prev) => ({
                      ...prev,
                      [param]: e.target.value,
                    }))
                  }
                />
              ))}
            </>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              キャンセル
            </Button>
          </Dialog.Close>
          <Button onClick={handleConfirm} disabled={!selectedTermSet} className="text-white">
            追加
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
