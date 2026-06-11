import { NextRequest } from 'next/server';
import { requestAgnes } from '@/lib/api/agnesServer';
import { VideoCreateResponse } from '@/types/api';
import { VideoGenerationParams } from '@/types/video';

export const runtime = 'nodejs';

interface AgnesVideoRequest {
  model: 'agnes-video-v2.0';
  prompt: string;
  image?: string;
  mode?: 'ti2vid' | 'keyframes';
  height?: number;
  width?: number;
  num_frames?: number;
  frame_rate?: number;
  num_inference_steps?: number;
  seed?: number;
  negative_prompt?: string;
  extra_body?: {
    image?: string[];
    mode?: 'keyframes';
  };
}

function normalizeImages(image: VideoGenerationParams['image']) {
  if (!image) return [];
  return (Array.isArray(image) ? image : [image]).filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const params: VideoGenerationParams = await req.json();

    const apiKey = process.env.AGNES_API_KEY || req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response('API Key 未配置', { status: 401 });
    }

    if (!params.prompt?.trim()) {
      return new Response('prompt 参数缺失', { status: 400 });
    }

    const images = normalizeImages(params.image);
    const body: AgnesVideoRequest = {
      model: 'agnes-video-v2.0',
      prompt: params.prompt.trim(),
      num_frames: params.num_frames || 81,
      frame_rate: params.frame_rate || 24,
      height: params.height || 768,
      width: params.width || 1152,
      num_inference_steps: params.num_inference_steps,
      seed: params.seed,
      negative_prompt: params.negative_prompt,
    };

    if (images.length === 1 && params.mode !== 'keyframes') {
      body.image = images[0];
      if (params.mode) {
        body.mode = params.mode;
      }
    }

    if (images.length > 1 || params.mode === 'keyframes') {
      body.extra_body = {
        image: images,
      };

      if (params.mode === 'keyframes') {
        body.extra_body.mode = 'keyframes';
      }
    }

    const response = await requestAgnes('/v1/videos', {
      method: 'POST',
      apiKey,
      body,
      timeoutMs: 600_000,
    });

    if (response.status < 200 || response.status >= 300) {
      const error = await response.text();
      return new Response(`API 错误: ${error}`, { status: response.status || 502 });
    }

    const data = await response.json<VideoCreateResponse>();
    return Response.json(data);
  } catch (error) {
    console.error('创建视频任务错误:', error);
    return new Response('服务器错误', { status: 500 });
  }
}
