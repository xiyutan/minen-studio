'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSettingsStore } from '@/store/settingsStore';

export default function SettingsPage() {
  const { setApiKey, loadSettings } = useSettingsStore();
  const [inputValue, setInputValue] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('api_key') || '' : ''
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = () => {
    setApiKey(inputValue);
    toast.success('API Key 已保存');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">设置</h1>
            <p className="text-muted-foreground">配置你的 Minen Studio 应用</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API 配置</CardTitle>
              <CardDescription>
                配置用于调用 Agnes AI 的 API Key。你可以在{' '}
                <a
                  href="https://app.agnes-ai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Agnes AI 官网
                </a>
                {' '}获取 API Key。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="输入你的 API Key"
                />
              </div>
              <Button onClick={handleSave}>保存设置</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>关于</CardTitle>
              <CardDescription>支持 Agnes AI API 的多端创作应用</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>版本:</strong> 1.0.0
              </p>
              <p>
                <strong>功能:</strong> 聊天、图片生成、视频生成
              </p>
              <p>
                <strong>技术栈:</strong> Next.js 16、TypeScript、Tailwind CSS、shadcn/ui、Zustand
              </p>
              <p className="text-muted-foreground">
                Minen Studio 是独立构建的应用，不代表 Agnes AI 官方产品或官方背书。生成结果由上游模型和用户输入共同决定，请自行确认内容的准确性、版权和合规性。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
