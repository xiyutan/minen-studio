import { ImageGenerationParams } from '@/types/image';
import { ImageGenerationResponse } from '@/types/api';
import { getApiKey } from './client';

export async function generateImage(
  params: ImageGenerationParams
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch('/api/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`图片生成失败: ${error}`);
  }

  const data: ImageGenerationResponse = await response.json();
  const url = data.data[0]?.url;

  if (!url) {
    throw new Error('图片接口未返回 URL');
  }

  return url;
}
