'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChatInput } from './ChatInput';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';

export function ChatContainer() {
  const { createConversation, setCurrentConversation, loadConversations } = useChatStore();

  useEffect(() => {
    loadConversations();

    const { currentConversationId, conversations } = useChatStore.getState();
    if (currentConversationId) {
      return;
    }

    const firstConversation = conversations[0];
    if (firstConversation) {
      setCurrentConversation(firstConversation.id);
    } else {
      createConversation();
    }
  }, [createConversation, loadConversations, setCurrentConversation]);

  return (
    <div className="flex h-full flex-col md:flex-row">
      <ConversationList />
      <div className="flex min-h-0 flex-1 flex-col">
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
}
