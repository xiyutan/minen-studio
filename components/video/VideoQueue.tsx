'use client';

import { VideoTask } from '@/types/video';
import { VideoPlayer } from './VideoPlayer';
import { VideoProgress } from './VideoProgress';

interface VideoQueueProps {
  tasks: VideoTask[];
  onDeleteTask: (taskId: string) => void;
}

export function VideoQueue({ tasks, onDeleteTask }: VideoQueueProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>暂无任务</p>
      </div>
    );
  }

  const activeTasks = tasks.filter((task) => task.status !== 'completed');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium">进行中的任务</h3>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <VideoProgress key={task.taskId} task={task} onDelete={onDeleteTask} />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium">已完成</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {completedTasks.map((task) => (
              <VideoPlayer key={task.taskId} task={task} onDelete={onDeleteTask} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
