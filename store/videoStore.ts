import { create } from 'zustand';
import { VideoTask } from '@/types/video';

interface VideoState {
  tasks: Record<string, VideoTask>;
  activePolling: string[];

  addTask: (task: VideoTask) => void;
  updateTaskStatus: (taskId: string, updates: Partial<VideoTask>) => void;
  startPolling: (taskId: string) => void;
  stopPolling: (taskId: string) => void;
  getCompletedVideos: () => VideoTask[];
  loadTasks: () => void;
  saveTasks: () => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  tasks: {},
  activePolling: [],

  addTask: (task: VideoTask) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [task.taskId]: task,
      },
    }));
    get().saveTasks();
  },

  updateTaskStatus: (taskId: string, updates: Partial<VideoTask>) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          ...updates,
        },
      },
    }));
    get().saveTasks();
  },

  startPolling: (taskId: string) => {
    set((state) => ({
      activePolling: state.activePolling.includes(taskId)
        ? state.activePolling
        : [...state.activePolling, taskId],
    }));
  },

  stopPolling: (taskId: string) => {
    set((state) => ({
      activePolling: state.activePolling.filter((id) => id !== taskId),
    }));
  },

  getCompletedVideos: () => {
    const { tasks } = get();
    return Object.values(tasks).filter((task) => task.status === 'completed');
  },

  loadTasks: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('video_history');
      if (saved) {
        try {
          const tasks = JSON.parse(saved);
          set({ tasks });
        } catch (error) {
          console.error('加载视频历史失败:', error);
          localStorage.removeItem('video_history');
        }
      }
    }
  },

  saveTasks: () => {
    if (typeof window !== 'undefined') {
      const { tasks } = get();
      localStorage.setItem('video_history', JSON.stringify(tasks));
    }
  },
}));
