'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageItem } from './MessageItem';
import { StreamingMessage } from './StreamingMessage';

export function MessageList() {
  const { currentConversationId, conversations, streamingMessage, isStreaming } =
    useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, streamingMessage]);

  if (!currentConversation) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-muted-foreground">
        <div className="text-center">
          <p className="mb-2 text-lg">欢迎使用 Minen Studio</p>
          <p className="text-sm">开始新的对话吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {currentConversation.messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isStreaming && streamingMessage && (
        <StreamingMessage content={streamingMessage} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
