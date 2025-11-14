'use client';

import { Dialog, Flex, Text, TextField, Button } from '@radix-ui/themes';
import { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import { createTermSet } from '../services/termSetService';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useFirebaseServices } from '@/hooks/useFirebaseServices';

interface NewTermSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTermSetCreated: () => void;
}

export default function NewTermSetDialog({
  open,
  onOpenChange,
  onTermSetCreated,
}: NewTermSetDialogProps) {
  const { user } = useAuth();
  const { db } = useFirebaseServices();
  const [newTermTitle, setNewTermTitle] = useState('');
  const [newTermDescription, setNewTermDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTerm = async () => {
    if (!user || !newTermTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTermSet(db, user.uid, newTermTitle.trim(), newTermDescription.trim());
      onTermSetCreated();
      setNewTermTitle('');
      setNewTermDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('利用規約の作成に失敗しました:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>新しい利用規約を作成</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          利用規約のタイトルと説明を入力してください。
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <div>
            <Label.Root>
              <Text as="div" size="2" mb="1" weight="bold">
                タイトル
              </Text>
              <TextField.Root
                placeholder="例: サークル会則"
                value={newTermTitle}
                onChange={(e) => setNewTermTitle(e.target.value)}
              />
            </Label.Root>
          </div>
          <div>
            <Label.Root>
              <Text as="div" size="2" mb="1" weight="bold">
                説明（任意）
              </Text>
              <TextField.Root
                placeholder="例: サークル活動に関する規約"
                value={newTermDescription}
                onChange={(e) => setNewTermDescription(e.target.value)}
              />
            </Label.Root>
          </div>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              キャンセル
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleCreateTerm}
            disabled={!newTermTitle.trim() || isCreating}
            className="text-white"
          >
            {isCreating ? '作成中...' : '作成'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
