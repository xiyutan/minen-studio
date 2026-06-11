'use client';

import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    '/chat': '聊天',
    '/image': '图片生成',
    '/video': '视频生成',
    '/settings': '设置',
  };

  const title = titles[pathname] || 'Minen Studio';

  return (
    <header className="flex h-14 shrink-0 items-center border-b bg-background px-4 md:h-16 md:px-6">
      <h2 className="truncate text-lg font-semibold md:text-2xl">{title}</h2>
    </header>
  );
}
