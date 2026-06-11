'use client';

import { BottomNav, Sidebar } from './Sidebar';
import { Header } from './Header';
import { ApiKeyPrompt } from '@/components/settings/ApiKeyPrompt';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-h-0 flex-1 overflow-auto pb-24 md:pb-0">{children}</main>
      </div>
      <ApiKeyPrompt />
      <BottomNav />
    </div>
  );
}
