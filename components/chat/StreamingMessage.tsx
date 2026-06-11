'use client';

import { Bot } from 'lucide-react';
import { MessageContent } from './MessageContent';

interface StreamingMessageProps {
  content: string;
}

export function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <div className="flex gap-3 p-4 md:gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 font-semibold">Assistant</div>
        <div className="whitespace-pre-wrap break-words">
          <MessageContent content={content} />
          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />
        </div>
      </div>
    </div>
  );
}
