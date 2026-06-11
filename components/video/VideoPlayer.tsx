'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VideoTask } from '@/types/video';
import { formatClock, formatDurationMs } from './videoTiming';

interface VideoPlayerProps {
  task: VideoTask;
}

export function VideoPlayer({ task }: VideoPlayerProps) {
  if (!task.videoUrl) {
    return null;
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = task.videoUrl!;
    a.download = `agnes-video-${task.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
        </div>
      </div>
    </Card>
  );
}
