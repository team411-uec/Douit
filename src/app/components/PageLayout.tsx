"use client";

import { Box, Container } from "@radix-ui/themes";
import Header from "./Header";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  showUserIcon?: boolean;
  showNumber?: boolean;
  number?: string;
  size?: "1" | "2" | "3" | "4";
  padding?: string;
}

export default function PageLayout({ 
  children, 
  showUserIcon = false, 
  showNumber = false, 
  number = "4",
  size = "1",
  padding = "px-6 py-6"
}: PageLayoutProps) {
  return (
    <Box className="min-h-screen">
      <Header showUserIcon={showUserIcon} showNumber={showNumber} number={number} />
      <Container size={size} className={padding}>
        {children}
      </Container>
    </Box>
  );
}
