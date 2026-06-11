'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Square } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { streamChatCompletion } from '@/lib/api/chat';
import { useChatStore } from '@/store/chatStore';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = createConversation();
    }

    addMessage(conversationId, {
      role: 'user',
      content: message,
    });

    setIsStreaming(true);
    updateStreamingMessage('');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const messages =
        useChatStore
          .getState()
          .conversations.find((conversation) => conversation.id === conversationId)
          ?.messages.map((storedMessage) => ({
            role: storedMessage.role,
            content: storedMessage.content,
          })) || [];

      let fullContent = '';

      await streamChatCompletion(
        messages,
        (chunk) => {
          if (controller.signal.aborted) return;
          fullContent += chunk;
          updateStreamingMessage(fullContent);
        },
        () => {
          finalizeStreamingMessage(conversationId);
          setIsLoading(false);
          abortControllerRef.current = null;
        },
        (error) => {
          if (controller.signal.aborted) return;
          console.error('流式响应错误:', error);
          setIsStreaming(false);
          setIsLoading(false);
          abortControllerRef.current = null;
          toast.error(`发送失败: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('发送消息错误:', error);
      setIsStreaming(false);
      setIsLoading(false);
      abortControllerRef.current = null;
      toast.error('发送失败，请稍后重试');
    }
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
      toast.info('已中断生成');
    }
  };

  const handleNewConversation = () => {
    createConversation();
  };

  useKeyboardShortcuts({
    onSendMessage: () => {
      if (!isLoading && input.trim()) {
        void handleSubmit();
      }
    },
    onNewConversation: handleNewConversation,
    onInterrupt: handleInterrupt,
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t p-3 md:p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息...（Ctrl+Enter 发送，Esc 中断）"
          className="max-h-48 min-h-14 resize-none"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            onClick={handleInterrupt}
            variant="destructive"
            aria-label="中断"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="发送">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mt-2 flex justify-end text-xs text-muted-foreground">
        <span>Ctrl+N 新建 · Ctrl+Enter 发送 · Esc 中断</span>
      </div>
    </form>
  );
}
