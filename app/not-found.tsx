import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-2 text-6xl font-bold">404</h1>
      <p className="mb-6 text-lg text-muted-foreground">页面不存在</p>
      <Link href="/">
        <Button>返回首页</Button>
      </Link>
    </div>
  );
}
