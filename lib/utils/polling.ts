export function createPoller<T>(
  fetchFn: () => Promise<T>,
  shouldStop: (data: T) => boolean,
  onUpdate: (data: T) => void,
  onComplete: (data: T) => void,
  onError: (error: Error) => void,
  interval: number = 3000
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let stopped = false;

  const poll = async () => {
    if (stopped) return;

    try {
      const data = await fetchFn();
      onUpdate(data);

      if (shouldStop(data)) {
        onComplete(data);
        stopped = true;
        return;
      }

      timeoutId = setTimeout(poll, interval);
    } catch (error) {
      onError(error as Error);
      stopped = true;
    }
  };

  poll();

  return () => {
    stopped = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}
