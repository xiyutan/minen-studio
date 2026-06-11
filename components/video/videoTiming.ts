export function formatDurationMs(ms?: number) {
  if (ms === undefined) return '暂无';
  if (ms < 1000) return `${ms}ms`;

  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} 秒`;
  }

  return `${minutes} 分 ${seconds} 秒`;
}

export function formatClock(timestamp?: number) {
  if (!timestamp) return '暂无';

  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
