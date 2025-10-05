"use client";

import { Box, Heading, Text, Button } from "@radix-ui/themes";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  size?: "small" | "medium" | "large";
}

export default function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  size = "medium"
}: EmptyStateProps) {
  const headingSize = size === "small" ? "3" : size === "large" ? "5" : "4";

  return (
    <Box className="text-center py-8">
      <Heading size={headingSize} color="gray" className="mb-2">
        {title}
      </Heading>
      {description && (
        <Text size="3" color="gray" className="mb-4">
          {description}
        </Text>
      )}
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button className="bg-[#00ADB5] hover:bg-[#009AA2] text-white">
            {actionText}
          </Button>
        </Link>
      )}
    </Box>
  );
}
