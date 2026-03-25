
import type { SortingStep } from '../../types/sorting';

export function* quickSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
}

function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortingStep> {
  yield { type: 'compare', indices: [], line: 1 };
  if (low < high) {
    const pivotIdx = yield* partition(arr, low, high);
    yield* quickSortHelper(arr, low, pivotIdx - 1);
    yield* quickSortHelper(arr, pivotIdx + 1, high);
  } else if (low >= 0 && low < arr.length) {
      yield { type: 'sorted', indices: [low] };
  }
}

function* partition(arr: number[], low: number, high: number): Generator<SortingStep> {
  yield { type: 'compare', indices: [], line: 8 };
  const pivot = arr[high];
  yield { type: 'pivot', indices: [high], line: 9 };
  
  let i = low - 1;
  yield { type: 'compare', indices: [], line: 10 };
  for (let j = low; j < high; j++) {
    yield { type: 'compare', indices: [j, high], line: 11 };
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', indices: [i, j], array: [...arr], line: 13 };
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { type: 'swap', indices: [i + 1, high], array: [...arr], line: 16 };
  yield { type: 'sorted', indices: [i + 1], line: 17 };
  return i + 1;
}
