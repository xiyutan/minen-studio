import { create } from 'zustand';
import { VideoTask } from '@/types/video';

interface VideoState {
  tasks: Record<string, VideoTask>;
  activePolling: string[];

  addTask: (task: VideoTask) => void;
  updateTaskStatus: (taskId: string, updates: Partial<VideoTask>) => void;
  deleteTask: (taskId: string) => void;
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
    set((state) => {
      const task = state.tasks[taskId];
      if (!task) return state;

      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            ...updates,
          },
        },
      };
    });
    get().saveTasks();
  },

  deleteTask: (taskId: string) => {
    set((state) => {
      const tasks = { ...state.tasks };
      delete tasks[taskId];

      return {
        tasks,
        activePolling: state.activePolling.filter((id) => id !== taskId),
      };
    });
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
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('video_history');
    if (!saved) return;

    try {
      const tasks = JSON.parse(saved) as Record<string, VideoTask>;
      set({ tasks });
    } catch (error) {
      console.error('加载视频历史失败:', error);
      localStorage.removeItem('video_history');
    }
  },

  saveTasks: () => {
    if (typeof window === 'undefined') return;

    const { tasks } = get();
    localStorage.setItem('video_history', JSON.stringify(tasks));
  },
}));
