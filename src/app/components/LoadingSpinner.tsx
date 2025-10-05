"use client";

import { Box, Heading } from "@radix-ui/themes";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({ 
  message = "読み込み中...", 
  size = "medium" 
}: LoadingSpinnerProps) {
  const headingSize = size === "small" ? "3" : size === "large" ? "5" : "4";

  return (
    <Box className="text-center py-8">
      <Heading size={headingSize} color="gray">
        {message}
      </Heading>
    </Box>
  );
}
