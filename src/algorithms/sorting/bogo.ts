
import type { SortingStep } from '../../types/sorting';

export function* bogoSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;

  while (!isSorted(arr)) {
    shuffle(arr);
    yield { type: 'swap', indices: Array.from({ length: n }, (_, i) => i), array: [...arr], description: "Shuffling array randomly" };
    
    // Check sorting and yield comparisons
    for (let i = 0; i < n - 1; i++) {
        yield { type: 'compare', indices: [i, i + 1], description: `Checking if ${arr[i]} <= ${arr[i+1]}` };
        if (arr[i] > arr[i + 1]) break;
    }
  }
  
  yield { type: 'sorted', indices: Array.from({ length: n }, (_, i) => i), description: "Incredibly, it's sorted!" };
}

function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
