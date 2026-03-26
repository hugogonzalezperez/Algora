
import type { SortingStep } from '../types';

export function* selectionSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { type: 'compare', indices: [i], line: 2 };

    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [j, minIdx], line: 4 };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { type: 'pivot', indices: [minIdx], line: 5 };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', indices: [i, minIdx], array: [...arr], line: 9 };
    }
    yield { type: 'sorted', indices: [i], line: 0 };
  }
  yield { type: 'sorted', indices: [n - 1], line: 0 };
}
