'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { streamChatCompletion } from '@/lib/api/chat';
import { useChatStore } from '@/store/chatStore';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    currentConversationId,
    addMessage,
    updateStreamingMessage,
    setIsStreaming,
    finalizeStreamingMessage,
    createConversation,
  } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    let convId = currentConversationId;
    if (!convId) {
      convId = createConversation();
    }

    addMessage(convId, {
      role: 'user',
      content: message,
    });

    setIsStreaming(true);
    updateStreamingMessage('');

    try {
      const messages = useChatStore.getState().conversations
        .find((c) => c.id === convId)
        ?.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) || [];

      let fullContent = '';

      await streamChatCompletion(
        messages,
        (chunk) => {
          fullContent += chunk;
          updateStreamingMessage(fullContent);
        },
        () => {
          finalizeStreamingMessage(convId);
          setIsLoading(false);
        },
        (error) => {
          console.error('流式响应错误:', error);
          setIsStreaming(false);
          setIsLoading(false);
          toast.error(`发送失败: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('发送消息错误:', error);
      setIsStreaming(false);
      setIsLoading(false);
      toast.error('发送失败，请稍后重试');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 md:p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息...（Shift + Enter 换行）"
          className="max-h-48 min-h-14 resize-none"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="发送">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
