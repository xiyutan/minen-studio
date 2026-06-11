'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageItem } from './MessageItem';
import { StreamingMessage } from './StreamingMessage';

export function MessageList() {
  const { currentConversationId, conversations, streamingMessage, isStreaming } =
    useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [currentConversation?.messages, streamingMessage]);

  if (!currentConversation) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 text-muted-foreground">
        <div className="text-center">
          <p className="mb-2 text-lg">欢迎使用 Minen Studio</p>
          <p className="text-sm">新建或选择一个对话开始创作</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-0 flex-1 overflow-y-auto">
      {currentConversation.messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isStreaming && streamingMessage && (
        <StreamingMessage content={streamingMessage} />
      )}
    </div>
  );
}
