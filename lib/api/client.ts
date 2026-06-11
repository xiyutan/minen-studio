const API_BASE_URL = 'https://apihub.agnes-ai.com';

export function getApiKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('api_key') || '';
  }
  return process.env.AGNES_API_KEY || '';
}

export async function createApiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('API Key 未设置，请在设置中配置');
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 请求失败: ${response.status} ${error}`);
  }

  return response;
}
