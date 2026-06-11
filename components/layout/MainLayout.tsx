'use client';

import { BottomNav, Sidebar } from './Sidebar';
import { Header } from './Header';
import { ApiKeyPrompt } from '@/components/settings/ApiKeyPrompt';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Header />
          <main className="min-h-0 flex-1 overflow-hidden pb-24 md:pb-0">{children}</main>
        </div>
      </div>
      <ApiKeyPrompt />
      <BottomNav />
    </div>
  );
}
