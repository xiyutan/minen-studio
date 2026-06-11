export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export type ChatMessageContent =
  | string
  | Array<
      | {
          type: 'text';
          text: string;
        }
      | {
          type: 'image_url';
          image_url: {
            url: string;
          };
        }
    >;

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: ChatMessageContent;
}

export interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string | null;
  }>;
}

export type VideoStatus = 'queued' | 'in_progress' | 'completed' | 'failed';

export interface VideoCreateResponse {
  id: string;
  task_id: string;
  video_id: string;  // 新增：推荐用于查询的 video_id
  object: string;
  model: string;
  status: VideoStatus;
  progress: number;
  created_at: number;
  seconds?: string;
  size?: string;
}

export interface VideoStatusResponse {
  id: string;
  video_id?: string;
  model: string;
  object: string;
  status: VideoStatus;
  progress: number;
  seconds?: string;
  size?: string;
  error?: string | { message?: string } | null;
  remixed_from_video_id?: string;
  video_url?: string;
  completed_at?: number;
}
