'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onNewConversation?: () => void;
  onSendMessage?: () => void;
  onInterrupt?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;

      if (isMod && event.key === 'n') {
        event.preventDefault();
        handlers.onNewConversation?.();
      }

      if (isMod && event.key === 'Enter') {
        event.preventDefault();
        handlers.onSendMessage?.();
      }

      if (event.key === 'Escape') {
        handlers.onInterrupt?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
