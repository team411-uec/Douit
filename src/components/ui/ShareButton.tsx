'use client';

import { Button } from '@radix-ui/themes';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type ShareButtonProps = {
  termSetId: string;
};

export default function ShareButton({ termSetId }: ShareButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareButtonClick = async () => {
    try {
      const shareUrl = `${window.location.origin}/accept-check/${termSetId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('リンクのコピーに失敗しました:', error);
      setCopySuccess(false);
    }
  };

  return (
    <Button
      size="3"
      className={`w-full ${
        copySuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-[#00ADB5] hover:bg-[#009AA2]'
      } text-white`}
      onClick={handleShareButtonClick}
    >
      {copySuccess ? (
        <>
          <CheckIcon width="16" height="16" />
          コピーしました！
        </>
      ) : (
        <>
          <CopyIcon width="16" height="16" />
          共有リンクをコピー
        </>
      )}
    </Button>
  );
}
