'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Monitor, Moon, Sun, Image, MessageSquare, Settings, Video } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

type Theme = 'light' | 'dark' | 'system';

const primaryNavItems = [
  { href: '/chat', label: '聊天', icon: MessageSquare },
  { href: '/image', label: '生图', icon: Image },
  { href: '/video', label: '视频', icon: Video },
];

const settingsNavItem = { href: '/settings', label: '设置', icon: Settings };

const themeCycle: Theme[] = ['light', 'dark', 'system'];
const themeIcons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};
const themeLabels: Record<Theme, string> = {
  light: '浅色模式',
  dark: '深色模式',
  system: '跟随系统',
};

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useSettingsStore();

  const handleThemeToggle = () => {
    const currentIndex = themeCycle.indexOf(theme);
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length];
    setTheme(nextTheme);
  };

  const ThemeIcon = themeIcons[theme];

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

      <div className="space-y-2 border-t p-4">
        <button
          type="button"
          onClick={handleThemeToggle}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
          title={`当前: ${themeLabels[theme]}`}
        >
          <ThemeIcon className="h-5 w-5" />
          <span>{themeLabels[theme]}</span>
        </button>
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
