'use client';

import { useMemo, useState } from 'react';
import { Download, MessageSquare, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chatStore';
import { Conversation } from '@/types/chat';

function formatConversationTime(timestamp: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

function exportConversation(conversation: Conversation) {
  const markdown = [
    `# ${conversation.title}`,
    '',
    `创建时间: ${new Date(conversation.createdAt).toLocaleString('zh-CN')}`,
    '',
    '---',
    '',
    ...conversation.messages.map((msg) => {
      const role = msg.role === 'user' ? '**你**' : '**Assistant**';
      return `### ${role}\n\n${msg.content}\n`;
    }),
  ].join('\n');

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conversation.title || '对话'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.messages.some((msg) => msg.content.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);

  const handleDelete = (conversationId: string) => {
    if (isStreaming && conversationId === currentConversationId) {
      toast.error('当前对话正在生成，完成后再删除');
      return;
    }

    deleteConversation(conversationId);
    toast.success('对话已删除');
  };

  const handleExport = (conversation: Conversation) => {
    exportConversation(conversation);
    toast.success('对话已导出');
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

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索对话..."
            className="h-9 pl-8 pr-8 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 md:min-h-0 md:flex-1 md:flex-col md:overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
            {searchQuery ? '没有找到匹配的对话' : '还没有对话'}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
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
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleExport(conversation)}
                    aria-label={`导出对话 ${conversation.title}`}
                    className="text-muted-foreground opacity-100 hover:text-foreground md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
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
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
