
import type { SortingStep } from '../types';

export function* insertionSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield { type: 'compare', indices: [i, j], line: 2 };

    while (j >= 0 && arr[j] > key) {
      yield { type: 'compare', indices: [j, j + 1], line: 4 };
      arr[j + 1] = arr[j];
      j = j - 1;
      yield { type: 'overwrite', indices: [j + 2], array: [...arr], line: 5 };
    }
    arr[j + 1] = key;
    yield { type: 'overwrite', indices: [j + 1], array: [...arr], line: 8 };
  }
}
