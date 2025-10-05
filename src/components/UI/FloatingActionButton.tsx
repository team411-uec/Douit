"use client";

import { Box, Button, Dialog } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface FloatingActionButtonProps {
  isDialogOpen: boolean;
  onDialogChange: (open: boolean) => void;
  children: ReactNode;
  size?: "2" | "3" | "4";
  bgColor?: string;
  hoverBgColor?: string;
}

export default function FloatingActionButton({
  isDialogOpen,
  onDialogChange,
  children,
  size = "4",
  bgColor = "bg-[#00ADB5]",
  hoverBgColor = "hover:bg-[#009AA2]",
}: FloatingActionButtonProps) {
  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onDialogChange}>
      <Dialog.Trigger>
        <Box className="fixed bottom-6 right-6">
          <Button
            size={size}
            className={`w-14 h-14 rounded-full ${bgColor} ${hoverBgColor} text-white shadow-lg`}
          >
            <PlusIcon width="24" height="24" />
          </Button>
        </Box>
      </Dialog.Trigger>
      {children}
    </Dialog.Root>
  );
}
