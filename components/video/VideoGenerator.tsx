'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createVideoTask, getVideoStatus } from '@/lib/api/video';
import { useVideoStore } from '@/store/videoStore';
import { VideoGenerationParams, VideoTask, VideoTaskStatus } from '@/types/video';
import { VideoStatusResponse } from '@/types/api';
import { VideoPromptInput } from './VideoPromptInput';
import { VideoQueue } from './VideoQueue';

const activeStatuses = new Set<VideoTaskStatus>(['queued', 'in_progress']);
const terminalStatuses = new Set<VideoTaskStatus>(['completed', 'failed']);

function normalizeVideoStatus(status: string): VideoTaskStatus {
  if (status === 'queued' || status === 'in_progress' || status === 'completed' || status === 'failed') {
    return status;
  }

  return 'in_progress';
}

function normalizeTimestamp(timestamp: number | undefined) {
  if (!timestamp) return undefined;
  return timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp;
}

function getStatusErrorMessage(error: VideoStatusResponse['error']) {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  return error.message || '未知错误';
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '未知错误';
}

export function VideoGenerator() {
  const { tasks, addTask, updateTaskStatus, startPolling, stopPolling, loadTasks } = useVideoStore();
  const [isCreating, setIsCreating] = useState(false);
  const [creationStartedAt, setCreationStartedAt] = useState<number | null>(null);
  const [creationNow, setCreationNow] = useState<number | null>(null);
  const pollingIntervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const pollingFailuresRef = useRef<Map<string, number>>(new Map());

  const stopPollingTask = useCallback((videoId: string) => {
    const interval = pollingIntervalsRef.current.get(videoId);
    if (interval) {
      clearInterval(interval);
      pollingIntervalsRef.current.delete(videoId);
    }
    pollingFailuresRef.current.delete(videoId);
    stopPolling(videoId);
  }, [stopPolling]);

  const pollTaskStatus = useCallback(async (videoId: string) => {
    try {
      const data = await getVideoStatus(videoId);
      const receivedAt = Date.now();
      pollingFailuresRef.current.delete(videoId);

      const status = normalizeVideoStatus(data.status);
      const errorMessage = getStatusErrorMessage(data.error);
      const videoUrl = data.video_url || data.remixed_from_video_id;

      updateTaskStatus(videoId, {
        status,
        progress: data.progress ?? 0,
        videoUrl,
        duration: data.seconds,
        size: data.size,
        error: errorMessage,
        lastPolledAt: receivedAt,
        completedAt: status === 'completed'
          ? normalizeTimestamp(data.completed_at) ?? receivedAt
          : undefined,
      });

      if (status === 'completed') {
        stopPollingTask(videoId);
        toast.success('视频生成完成');
        return;
      }

      if (status === 'failed') {
        stopPollingTask(videoId);
        toast.error(`视频生成失败: ${errorMessage || '未知错误'}`);
      }
    } catch (error: unknown) {
      console.error('轮询视频状态失败:', error);
      const nextFailureCount = (pollingFailuresRef.current.get(videoId) || 0) + 1;
      pollingFailuresRef.current.set(videoId, nextFailureCount);

      if (nextFailureCount >= 3) {
        stopPollingTask(videoId);
        updateTaskStatus(videoId, {
          error: `连续查询视频状态失败: ${getErrorMessage(error)}`,
        });
        toast.error('查询视频状态连续失败，已停止轮询');
        return;
      }

      updateTaskStatus(videoId, {
        error: `查询视频状态失败，将继续重试 (${nextFailureCount}/3)`,
      });
    }
  }, [stopPollingTask, updateTaskStatus]);

  const startPollingTask = useCallback((videoId: string) => {
    if (pollingIntervalsRef.current.has(videoId)) return;

    startPolling(videoId);
    void pollTaskStatus(videoId);

    const interval = setInterval(() => {
      void pollTaskStatus(videoId);
    }, 5000);
    pollingIntervalsRef.current.set(videoId, interval);
  }, [pollTaskStatus, startPolling]);

  useEffect(() => {
    loadTasks();

    const savedTasks = Object.values(useVideoStore.getState().tasks);
    savedTasks.forEach((task) => {
      if (activeStatuses.has(task.status)) {
        startPollingTask(task.taskId);
      }
    });

    const intervals = pollingIntervalsRef.current;
    return () => {
      intervals.forEach((interval) => clearInterval(interval));
      intervals.clear();
    };
  }, [loadTasks, startPollingTask]);

  useEffect(() => {
    if (!isCreating || !creationStartedAt) {
      return;
    }

    const interval = setInterval(() => {
      setCreationNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [creationStartedAt, isCreating]);

  const handleGenerate = async (prompt: string, params: Omit<VideoGenerationParams, 'prompt'>) => {
    const submittedAt = Date.now();
    setIsCreating(true);
    setCreationStartedAt(submittedAt);
    setCreationNow(submittedAt);

    try {
      const data = await createVideoTask({ prompt, ...params });
      const receivedAt = Date.now();

      const videoId = data.video_id || data.task_id || data.id;
      if (!videoId) {
        throw new Error('视频接口未返回 video_id 或 task_id');
      }

      const status = normalizeVideoStatus(data.status);
      const task: VideoTask = {
        id: videoId,
        taskId: videoId,
        prompt,
        status,
        progress: data.progress ?? 0,
        duration: data.seconds,
        size: data.size,
        createdAt: submittedAt,
        submitDurationMs: receivedAt - submittedAt,
      };

      addTask(task);

      if (!terminalStatuses.has(status)) {
        startPollingTask(videoId);
      }

      toast.success('视频任务已创建');
    } catch (error: unknown) {
      console.error('创建视频任务失败:', error);
      toast.error(`创建视频任务失败: ${getErrorMessage(error)}`);
    } finally {
      setIsCreating(false);
      setCreationStartedAt(null);
      setCreationNow(null);
    }
  };

  const taskList = Object.values(tasks).sort((a, b) => b.createdAt - a.createdAt);
  const creatingElapsedMs = creationStartedAt && creationNow
    ? creationNow - creationStartedAt
    : 0;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
          <VideoPromptInput
            onGenerate={handleGenerate}
            isGenerating={isCreating}
            creatingElapsedMs={creatingElapsedMs}
          />
          <VideoQueue tasks={taskList} />
        </div>
      </div>
    </div>
  );
}
