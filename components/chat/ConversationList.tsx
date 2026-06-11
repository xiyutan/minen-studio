'use client';

import { MessageSquare, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';

function formatConversationTime(timestamp: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

export function ConversationList() {
  const {
    conversations,
    currentConversationId,
    isStreaming,
    createConversation,
    setCurrentConversation,
    deleteConversation,
  } = useChatStore();

  const handleDelete = (conversationId: string) => {
    if (isStreaming && conversationId === currentConversationId) {
      toast.error('当前对话正在生成，完成后再删除');
      return;
    }

    deleteConversation(conversationId);
    toast.success('对话已删除');
  };

  return (
    <aside className="flex min-h-0 shrink-0 flex-col border-b bg-muted/20 md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">对话历史</h2>
          <p className="text-xs text-muted-foreground">{conversations.length} 个会话</p>
        </div>
        <Button variant="outline" size="icon-sm" onClick={createConversation} aria-label="新建对话">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 md:min-h-0 md:flex-1 md:flex-col md:overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
            还没有对话
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === currentConversationId;

            return (
              <div
                key={conversation.id}
                className={`group flex min-w-64 items-center gap-2 rounded-lg border bg-background p-2 transition-colors md:min-w-0 ${
                  isActive ? 'border-primary' : 'hover:border-foreground/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setCurrentConversation(conversation.id)}
                  className="flex min-w-0 flex-1 items-start gap-2 text-left"
                  aria-current={isActive ? 'true' : undefined}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {conversation.title || '未命名对话'}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {conversation.messages.length} 条消息 · {formatConversationTime(conversation.updatedAt)}
                    </span>
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDelete(conversation.id)}
                  aria-label={`删除对话 ${conversation.title || '未命名对话'}`}
                  className="text-muted-foreground opacity-100 hover:text-destructive md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
