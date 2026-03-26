import { useState, useCallback, useRef } from 'react';

export interface QueueItem {
  id: number;
  value: string;
}

export const useQueue = (initialState: string[] = [], initialCapacity: number = 8) => {
  const nextId = useRef(0);
  const [queue, setQueue] = useState<QueueItem[]>(
    initialState.map(val => ({ id: nextId.current++, value: val }))
  );
  const [maxSizeState, setMaxSizeState] = useState(initialCapacity);
  const [peekedIndex, setPeekedIndex] = useState<number | null>(null);

  const setMaxSize = useCallback((newSize: number) => {
    setMaxSizeState(newSize);
    setQueue(prev => {
      if (prev.length > newSize) {
        return prev.slice(0, newSize);
      }
      return prev;
    });
  }, []);

  const maxSize = maxSizeState;
  const canPush = queue.length < maxSize;
  const canPop = queue.length > 0;

  const enqueue = useCallback((value: string) => {
    setQueue(prev => {
      if (prev.length < maxSize) {
        setPeekedIndex(null);
        return [...prev, { id: nextId.current++, value }];
      }
      return prev;
    });
  }, [maxSize]);

  const dequeue = useCallback(() => {
    if (canPop) {
      setQueue(prev => prev.slice(1));
      setPeekedIndex(null);
    }
  }, [canPop]);

  const peek = useCallback(() => {
    if (canPop) {
      setPeekedIndex(0);
      setTimeout(() => setPeekedIndex(null), 1000);
    }
  }, [canPop]);

  const clear = useCallback(() => {
    setQueue([]);
    setPeekedIndex(null);
  }, []);

  return {
    queue,
    maxSize,
    setMaxSize,
    peekedIndex,
    enqueue,
    dequeue,
    peek,
    clear,
    canPush,
    canPop
  };
};
