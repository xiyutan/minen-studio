import { NextRequest } from 'next/server';
import { requestAgnes } from '@/lib/api/agnesServer';
import { ChatCompletionMessage } from '@/types/api';

export const runtime = 'nodejs';

interface ChatRequestBody {
  messages?: ChatCompletionMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: ChatRequestBody = await req.json();

    const apiKey = process.env.AGNES_API_KEY || req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response('API Key 未配置', { status: 401 });
    }

    if (!messages?.length) {
      return new Response('messages 参数缺失', { status: 400 });
    }

    const response = await requestAgnes('/v1/chat/completions', {
      method: 'POST',
      apiKey,
      body: {
        model: 'agnes-2.0-flash',
        messages,
        stream: true,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      const error = await response.text();
      return new Response(`API 错误: ${error}`, { status: response.status || 502 });
    }

    return new Response(response.webStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('聊天 API 错误:', error);
    return new Response('服务器错误', { status: 500 });
  }
}
