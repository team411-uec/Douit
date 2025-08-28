import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
<<<<<<< HEAD
import { Theme } from "@radix-ui/themes";
=======
import { Theme, ThemePanel } from "@radix-ui/themes";
>>>>>>> 31fbf6d (追い付いてない分)
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Douit",
  description: "利用規約の検索・共有サービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<<<<<<< HEAD
        <Theme accentColor="teal">{children}</Theme>
=======
        <Theme accentColor="teal">
          {children}
          <ThemePanel />
        </Theme>
>>>>>>> 31fbf6d (追い付いてない分)
      </body>
    </html>
  );
}
