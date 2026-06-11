export type VideoTaskStatus = 'queued' | 'in_progress' | 'completed' | 'failed';

export interface VideoTask {
  id: string;
  taskId: string;
  prompt: string;
  status: VideoTaskStatus;
  progress: number;
  videoUrl?: string;
  duration?: string;
  size?: string;
  createdAt: number;
  submitDurationMs?: number;
  lastPolledAt?: number;
  completedAt?: number;
  error?: string;
}

export interface VideoGenerationParams {
  prompt: string;
  num_frames?: number;
  frame_rate?: number;
  height?: number;
  width?: number;
  image?: string | string[];
  mode?: 'ti2vid' | 'keyframes';
  num_inference_steps?: number;
  seed?: number;
  negative_prompt?: string;
}

export interface VideoState {
  tasks: Map<string, VideoTask>;
  activePolling: Set<string>;
}
