import { ChatCompletionMessage } from '@/types/api';

export async function streamChatCompletion(
  messages: ChatCompletionMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') || '' : '';

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`请求失败 (${response.status}): ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (error) {
            console.error('解析 SSE 数据失败:', error);
          }
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
