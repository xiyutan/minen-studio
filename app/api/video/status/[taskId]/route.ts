import { NextRequest } from 'next/server';
import { requestAgnes } from '@/lib/api/agnesServer';
import { VideoStatusResponse } from '@/types/api';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const apiKey = process.env.AGNES_API_KEY || req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response('API Key 未配置', { status: 401 });
    }

    const response = await requestAgnes(`/v1/videos/${taskId}`, {
      method: 'GET',
      apiKey,
    });

    if (response.status < 200 || response.status >= 300) {
      const error = await response.text();
      return new Response(`API 错误: ${error}`, { status: response.status || 502 });
    }

    const data = await response.json<VideoStatusResponse>();
    return Response.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('查询视频状态错误:', error);
    return new Response('服务器错误', { status: 500 });
  }
}
