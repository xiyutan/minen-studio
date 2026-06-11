'use client';

import { useState } from 'react';
import { Bot, Check, Copy, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat';
import { MessageContent } from './MessageContent';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('已复制到剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex gap-3 p-4 md:gap-4 ${isUser ? 'bg-muted/50' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-semibold">{isUser ? '你' : 'Assistant'}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100"
            aria-label="复制消息"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <div className="whitespace-pre-wrap break-words">
          {isUser ? message.content : <MessageContent content={message.content} />}
        </div>
      </div>
    </div>
  );
}
