import Header from "@/components/Organisims/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <Link href="/search">検索ページへ</Link>
    </>
  );
}
