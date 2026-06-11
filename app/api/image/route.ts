import { NextRequest } from 'next/server';
import { requestAgnes } from '@/lib/api/agnesServer';
import { ImageGenerationResponse } from '@/types/api';

export const runtime = 'nodejs';

interface ImageRequestBody {
  prompt?: string;
  size?: string;
  image?: string | string[];
  return_base64?: boolean;
}

interface AgnesImageRequest {
  model: 'agnes-image-2.1-flash';
  prompt: string;
  size: string;
  return_base64?: boolean;
  extra_body?: {
    image?: string[];
    response_format?: 'url' | 'b64_json';
  };
}

function normalizeImages(image: string | string[] | undefined) {
  if (!image) return [];
  return (Array.isArray(image) ? image : [image]).filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = '1024x768', image, return_base64 }: ImageRequestBody = await req.json();

    const apiKey = process.env.AGNES_API_KEY || req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response('API Key 未配置', { status: 401 });
    }

    if (!prompt?.trim()) {
      return new Response('prompt 参数缺失', { status: 400 });
    }

    const images = normalizeImages(image);
    const body: AgnesImageRequest = {
      model: 'agnes-image-2.1-flash',
      prompt: prompt.trim(),
      size,
      extra_body: {
        response_format: return_base64 ? 'b64_json' : 'url',
      },
    };

    if (return_base64 && images.length === 0) {
      body.return_base64 = true;
      delete body.extra_body;
    }

    if (images.length > 0) {
      body.extra_body = {
        image: images,
        response_format: return_base64 ? 'b64_json' : 'url',
      };
    }

    const response = await requestAgnes('/v1/images/generations', {
      method: 'POST',
      apiKey,
      body,
    });

    if (response.status < 200 || response.status >= 300) {
      const error = await response.text();
      return new Response(`API 错误: ${error}`, { status: response.status || 502 });
    }

    const data = await response.json<ImageGenerationResponse>();
    return Response.json(data);
  } catch (error) {
    console.error('图片生成 API 错误:', error);
    return new Response('服务器错误', { status: 500 });
  }
}
