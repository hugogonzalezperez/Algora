import { useState, useCallback, useRef } from 'react';

export interface LinkedListNode {
  id: number;
  value: string;
}

export const useLinkedList = (initialState: string[] = [], initialCapacity: number = 8) => {
  const nextId = useRef(0);
  const [nodes, setNodes] = useState<LinkedListNode[]>(
    initialState.map(val => ({ id: nextId.current++, value: val }))
  );
  const [maxSizeState, setMaxSizeState] = useState(initialCapacity);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const setMaxSize = useCallback((newSize: number) => {
    setMaxSizeState(newSize);
    setNodes(prev => {
      if (prev.length > newSize) {
        return prev.slice(0, newSize);
      }
      return prev;
    });
  }, []);

  const maxSize = maxSizeState;
  const canAdd = nodes.length < maxSize;
  const canRemove = nodes.length > 0;

  const append = useCallback((value: string) => {
    setNodes(prev => {
      if (prev.length < maxSize) {
        setHighlightedIndex(prev.length); // Highlight the newly added item
        setTimeout(() => setHighlightedIndex(null), 1000);
        return [...prev, { id: nextId.current++, value }];
      }
      return prev;
    });
  }, [maxSize]);

  const prepend = useCallback((value: string) => {
    setNodes(prev => {
      if (prev.length < maxSize) {
        setHighlightedIndex(0); // Highlight the newly added item
        setTimeout(() => setHighlightedIndex(null), 1000);
        return [{ id: nextId.current++, value }, ...prev];
      }
      return prev;
    });
  }, [maxSize]);

  const removeValue = useCallback((value: string) => {
    if (!canRemove) return;
    
    setNodes(prev => {
      const index = prev.findIndex(n => n.value === value);
      if (index === -1) return prev; // Not found
      
      const newNodes = [...prev];
      newNodes.splice(index, 1);
      return newNodes;
    });
  }, [canRemove]);
  
  const removeHead = useCallback(() => {
    if (!canRemove) return;
    setNodes(prev => prev.slice(1));
  }, [canRemove]);

  const removeTail = useCallback(() => {
    if (!canRemove) return;
    setNodes(prev => prev.slice(0, -1));
  }, [canRemove]);

  const search = useCallback((value: string) => {
    const index = nodes.findIndex(n => n.value === value);
    if (index !== -1) {
      setHighlightedIndex(index);
    } else {
      setHighlightedIndex(null); // Clear if not found
    }
    // Automatically clear highlight after a delay
    setTimeout(() => setHighlightedIndex(null), 1500);
    return index !== -1;
  }, [nodes]);

  const clear = useCallback(() => {
    setNodes([]);
    setHighlightedIndex(null);
  }, []);

  return {
    nodes,
    maxSize,
    setMaxSize,
    highlightedIndex,
    append,
    prepend,
    removeValue,
    removeHead,
    removeTail,
    search,
    clear,
    canAdd,
    canRemove
  };
};
