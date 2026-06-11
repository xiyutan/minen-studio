'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSettingsStore } from '@/store/settingsStore';

type Theme = 'light' | 'dark' | 'system';

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
];

export default function SettingsPage() {
  const { apiKey, theme, setApiKey, setTheme, loadSettings } = useSettingsStore();
  const [inputValue, setInputValue] = useState(apiKey);

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
              <CardTitle>外观</CardTitle>
              <CardDescription>自定义应用的外观和主题</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={theme === value ? 'default' : 'outline'}
                    className="flex flex-col gap-2 py-6"
                    onClick={() => setTheme(value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="输入你的 API Key"
                />
              </div>
              <Button onClick={handleSave}>保存设置</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据保存位置</CardTitle>
              <CardDescription>聊天、图片、视频历史都保存在当前浏览器本地</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>聊天历史:</strong> localStorage key 为 <code>chat_history</code>
              </p>
              <p>
                <strong>图片历史:</strong> localStorage key 为 <code>image_gallery</code>
              </p>
              <p>
                <strong>视频历史:</strong> localStorage key 为 <code>video_history</code>
              </p>
              <p className="text-muted-foreground">
                图片和视频文件不会保存到项目目录，应用只保存上游接口返回的远程 URL；点击下载后才会进入浏览器默认下载目录。
              </p>
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
                Minen Studio 是独立构建的应用，不代表 Agnes AI 官方产品或官方背书。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
