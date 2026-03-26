import { useState, useCallback, useRef } from 'react';

export interface HashEntry {
  id: number;
  key: string;
  value: string;
}

export type Bucket = HashEntry[];

export const useHashTable = (initialCapacity: number = 8) => {
  const nextId = useRef(0);
  const [table, setTable] = useState<Bucket[]>(
    Array.from({ length: initialCapacity }, () => [])
  );
  const [capacity, setCapacity] = useState(initialCapacity);
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  const hash = (key: string): number => {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h = (h << 5) - h + key.charCodeAt(i);
      h |= 0; // Convert to 32bit integer
    }
    return Math.abs(h);
  };

  const setTableCapacity = useCallback((newCapacity: number) => {
    setCapacity(newCapacity);
    // Simple reset on capacity change for the visualizer
    setTable(Array.from({ length: newCapacity }, () => []));
  }, []);

  const insert = useCallback((key: string, value: string) => {
    const index = hash(key) % capacity;
    setHighlightedBucket(index);
    setHighlightedKey(key);
    
    setTable(prev => {
      const newTable = [...prev];
      const bucket = [...newTable[index]];
      
      const existingIndex = bucket.findIndex(entry => entry.key === key);
      if (existingIndex !== -1) {
        // Update existing key
        bucket[existingIndex] = { ...bucket[existingIndex], value };
      } else {
        // Add new entry
        bucket.push({ id: nextId.current++, key, value });
      }
      
      newTable[index] = bucket;
      return newTable;
    });

    setTimeout(() => {
      setHighlightedBucket(null);
      setHighlightedKey(null);
    }, 1500);
  }, [capacity]);

  const remove = useCallback((key: string) => {
    const index = hash(key) % capacity;
    setHighlightedBucket(index);
    setHighlightedKey(key);

    setTable(prev => {
      const newTable = [...prev];
      const bucket = prev[index].filter(entry => entry.key !== key);
      newTable[index] = bucket;
      return newTable;
    });

    setTimeout(() => {
      setHighlightedBucket(null);
      setHighlightedKey(null);
    }, 1500);
  }, [capacity]);

  const search = useCallback((key: string) => {
    const index = hash(key) % capacity;
    setHighlightedBucket(index);
    setHighlightedKey(key);

    const found = table[index].find(entry => entry.key === key);
    
    setTimeout(() => {
      setHighlightedBucket(null);
      setHighlightedKey(null);
    }, 1500);

    return found;
  }, [capacity, table]);

  const clear = useCallback(() => {
    setTable(Array.from({ length: capacity }, () => []));
    setHighlightedBucket(null);
    setHighlightedKey(null);
  }, [capacity]);

  return {
    table,
    capacity,
    setTableCapacity,
    highlightedBucket,
    highlightedKey,
    insert,
    remove,
    search,
    clear
  };
};
