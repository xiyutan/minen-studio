'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image, MessageSquare, Settings, Video } from 'lucide-react';

const primaryNavItems = [
  { href: '/chat', label: '聊天', icon: MessageSquare },
  { href: '/image', label: '生图', icon: Image },
  { href: '/video', label: '视频', icon: Video },
];

const settingsNavItem = { href: '/settings', label: '设置', icon: Settings };

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-dvh w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-bold">Minen Studio</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <SideNavLink item={settingsNavItem} isActive={pathname === settingsNavItem.href} />
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const navItems = [...primaryNavItems, settingsNavItem];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.375rem)] pt-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center rounded-md px-1 text-xs transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="mb-1 h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SideNavLink({
  item,
  isActive,
}: {
  item: (typeof primaryNavItems)[number];
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </Link>
  );
}
