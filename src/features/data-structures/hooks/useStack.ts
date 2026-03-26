import { useState, useCallback } from 'react';

export const useStack = (initialState: string[] = [], initialCapacity: number = 8) => {
  const [stack, setStack] = useState<string[]>(initialState);
  const [maxSizeState, setMaxSizeState] = useState(initialCapacity);
  
  const setMaxSize = useCallback((newSize: number) => {
    setMaxSizeState(newSize);
    setStack(prev => {
      if (prev.length > newSize) {
        return prev.slice(0, newSize);
      }
      return prev;
    });
  }, []);

  const maxSize = maxSizeState;
  const [peekedIndex, setPeekedIndex] = useState<number | null>(null);

  const canPush = stack.length < maxSize;
  const canPop = stack.length > 0;

  const push = useCallback((value: string) => {
    setStack(prev => {
      if (prev.length < maxSize) {
        setPeekedIndex(null);
        return [...prev, value];
      }
      return prev;
    });
  }, [maxSize]);

  const pop = useCallback(() => {
    if (canPop) {
      const newStack = [...stack];
      newStack.pop();
      setStack(newStack);
      setPeekedIndex(null);
    }
  }, [canPop, stack]);

  const peek = useCallback(() => {
    if (canPop) {
      setPeekedIndex(stack.length - 1);
      setTimeout(() => setPeekedIndex(null), 1000);
    }
  }, [canPop, stack.length]);

  const clear = useCallback(() => {
    setStack([]);
    setPeekedIndex(null);
  }, []);

  return {
    stack,
    maxSize,
    setMaxSize,
    peekedIndex,
    push,
    pop,
    peek,
    clear,
    canPush,
    canPop
  };
};
