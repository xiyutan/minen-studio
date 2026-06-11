'use client';

import { CheckCircle2, Clock, Loader2, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VideoTask } from '@/types/video';
import { formatClock, formatDurationMs } from './videoTiming';

interface VideoProgressProps {
  task: VideoTask;
  onDelete: (taskId: string) => void;
}

export function VideoProgress({ task, onDelete }: VideoProgressProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'queued':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      case 'in_progress':
        return '生成中';
      case 'queued':
        return '排队中';
      default:
        return task.status;
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start gap-3">
        {getStatusIcon()}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{task.prompt}</p>
          <p className="text-sm text-muted-foreground">
            任务 ID: {task.taskId.slice(0, 20)}...
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(task.taskId)}
          aria-label={`删除视频任务 ${task.taskId}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{getStatusText()}</span>
          <span className="font-medium">{task.progress}%</span>
        </div>
        <Progress value={task.progress} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <span className="block">提交耗时</span>
          <span className="font-medium text-foreground">{formatDurationMs(task.submitDurationMs)}</span>
        </div>
        <div>
          <span className="block">上次查询</span>
          <span className="font-medium text-foreground">{formatClock(task.lastPolledAt)}</span>
        </div>
      </div>

      {task.error && (
        <p className="mt-2 text-sm text-red-500">{task.error}</p>
      )}
    </Card>
  );
}
