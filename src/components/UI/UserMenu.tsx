"use client";

import { Flex, Button } from "@radix-ui/themes";
import Link from "next/link";

interface UserMenuProps {
  onLogout: () => void;
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  return (
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

      <Button
        size="4"
        variant="outline"
        onClick={onLogout}
        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg py-4 mt-6"
      >
        ログアウト
      </Button>
    </Flex>
  );
}
