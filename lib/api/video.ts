import { VideoGenerationParams } from '@/types/video';
import { VideoCreateResponse, VideoStatusResponse } from '@/types/api';

export async function createVideoTask(
  params: VideoGenerationParams
): Promise<VideoCreateResponse> {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') || '' : '';

  const response = await fetch('/api/video/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`视频任务创建失败: ${error}`);
  }

  return response.json();
}

export async function getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') || '' : '';

  const response = await fetch(`/api/video/query?video_id=${encodeURIComponent(videoId)}`, {
    headers: {
      'x-api-key': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`查询视频状态失败: ${error}`);
  }

  return response.json();
}
