
import type { SortingStep } from '../types';

export function* heapSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { type: 'swap', indices: [0, i], array: [...arr], description: `Moving largest element ${arr[i]} to sorted position` };

    // call max heapify on the reduced heap
    yield* heapify(arr, i, 0);
    
    yield { type: 'sorted', indices: [i], description: `Element ${arr[i]} is now in its final position` };
  }
  yield { type: 'sorted', indices: [0], description: `Final element sorted` };
}

function* heapify(arr: number[], n: number, i: number): Generator<SortingStep> {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  yield { type: 'compare', indices: [i], line: 4, description: `Heapifying subtree rooted at index ${i}` };

  if (l < n) {
    yield { type: 'compare', indices: [l, largest], description: `Comparing left child with parent` };
    if (arr[l] > arr[largest]) {
      largest = l;
    }
  }

  if (r < n) {
    yield { type: 'compare', indices: [r, largest], description: `Comparing right child with max of parent and left child` };
    if (arr[r] > arr[largest]) {
      largest = r;
    }
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { type: 'swap', indices: [i, largest], array: [...arr], description: `Swapping parent with larger child` };
    yield* heapify(arr, n, largest);
  }
}
