'use client';

import { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';
import { ChatInput } from './ChatInput';
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">对话</h2>
        <Button variant="outline" size="sm" onClick={createConversation}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新对话
        </Button>
      </div>
      <MessageList />
      <ChatInput />
    </div>
  );
}
