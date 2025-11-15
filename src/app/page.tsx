import Link from 'next/link';
import Header from '@/components/ui/Header';

export default function Home() {
  return (
    <>
      <Header />
      <Link href="/search">検索ページへ</Link>
    </>
  );
}
