
import type { SortingStep } from '../types';

export function* mergeSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);
}

function* mergeSortHelper(arr: number[], l: number, r: number): Generator<SortingStep> {
  yield { type: 'compare', indices: [], line: 1 };
  if (l < r) {
    const m = Math.floor(l + (r - l) / 2);
    yield* mergeSortHelper(arr, l, m);
    yield* mergeSortHelper(arr, m + 1, r);
    yield* merge(arr, l, m, r);
  }
}

function* merge(arr: number[], l: number, m: number, r: number): Generator<SortingStep> {
  const n1 = m - l + 1;
  const n2 = r - m;

  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = arr[l + i];
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  let i = 0, j = 0, k = l;

  while (i < n1 && j < n2) {
    yield { type: 'compare', indices: [l + i, m + 1 + j], line: 9 };
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      yield { type: 'overwrite', indices: [k], values: [L[i]], array: [...arr], line: 11 };
      i++;
    } else {
      arr[k] = R[j];
      yield { type: 'overwrite', indices: [k], values: [R[j]], array: [...arr], line: 14 };
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    yield { type: 'overwrite', indices: [k], values: [L[i]], array: [...arr], line: 19 };
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    yield { type: 'overwrite', indices: [k], values: [R[j]], array: [...arr], line: 24 };
    j++;
    k++;
  }

  // Mark this range as sorted
  for (let x = l; x <= r; x++) {
    yield { type: 'sorted', indices: [x], line: 0 };
  }
}
