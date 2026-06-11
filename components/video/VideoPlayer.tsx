'use client';

import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VideoTask } from '@/types/video';
import { formatClock, formatDurationMs } from './videoTiming';

interface VideoPlayerProps {
  task: VideoTask;
  onDelete: (taskId: string) => void;
}

export function VideoPlayer({ task, onDelete }: VideoPlayerProps) {
  if (!task.videoUrl) {
    return null;
  }

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = task.videoUrl!;
    anchor.download = `agnes-video-${task.id}.mp4`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Card className="overflow-hidden">
      <video
        src={task.videoUrl}
        controls
        preload="metadata"
        playsInline
        className="aspect-video w-full bg-black"
      />
      <div className="space-y-2 p-4">
        <p className="line-clamp-2 text-sm">{task.prompt}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="block">提交耗时</span>
            <span className="font-medium text-foreground">{formatDurationMs(task.submitDurationMs)}</span>
          </div>
          <div>
            <span className="block">完成时间</span>
            <span className="font-medium text-foreground">{formatClock(task.completedAt)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 truncate text-xs text-muted-foreground">
            {task.duration} / {task.size}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button onClick={() => onDelete(task.taskId)} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
