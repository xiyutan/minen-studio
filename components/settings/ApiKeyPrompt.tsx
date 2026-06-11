'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsStatusResponse {
  hasServerApiKey: boolean;
}

export function ApiKeyPrompt() {
  const { apiKey, loadSettings, setApiKey } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    let isMounted = true;

    async function checkApiKey() {
      const browserApiKey = localStorage.getItem('api_key') || '';
      setInputValue(browserApiKey);

      if (browserApiKey.trim()) {
        setIsChecking(false);
        setOpen(false);
        return;
      }

      try {
        const response = await fetch('/api/settings/status', { cache: 'no-store' });
        const data = (await response.json()) as SettingsStatusResponse;

        if (isMounted) {
          setOpen(!data.hasServerApiKey);
        }
      } catch {
        if (isMounted) {
          setOpen(true);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    void checkApiKey();

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  const handleSave = () => {
    const nextApiKey = inputValue.trim();
    if (!nextApiKey) {
      toast.error('请输入 API Key');
      return;
    }

    setApiKey(nextApiKey);
    setOpen(false);
    toast.success('API Key 已保存');
  };

  if (isChecking) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeyRound className="h-4 w-4" />
          </div>
          <DialogTitle>配置 Agnes AI API Key</DialogTitle>
          <DialogDescription>
            当前服务端和浏览器本地都没有可用 key。保存后会写入本浏览器的 localStorage，不会写入项目文件。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="api-key-prompt-input">
            API Key
          </label>
          <Input
            id="api-key-prompt-input"
            type="password"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="输入你的 API Key"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            保存并继续
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
