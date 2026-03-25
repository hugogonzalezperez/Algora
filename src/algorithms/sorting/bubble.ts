
import type { SortingStep } from '../../types/sorting';

export function* bubbleSort(array: number[]): Generator<SortingStep> {
  const n = array.length;
  const arr = [...array];

  for (let i = 0; i < n; i++) {
    yield { type: 'compare', indices: [], line: 3 };
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1], line: 4 };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', indices: [j, j + 1], array: [...arr], line: 5 };
      }
    }
    yield { type: 'sorted', indices: [n - i - 1], line: 0 };
  }
}