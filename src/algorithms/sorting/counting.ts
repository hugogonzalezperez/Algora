
import type { SortingStep } from '../../types/sorting';

export function* countingSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(0);

  yield { type: 'compare', indices: [], description: `Initializing count array of size ${range}` };

  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    yield { type: 'compare', indices: [i], description: `Counting occurrence of ${arr[i]}` };
  }

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    yield { type: 'compare', indices: [i], description: `Placing ${arr[i]} in output array` };
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { type: 'overwrite', indices: [i], array: [...arr], description: `Copying ${output[i]} back to original array` };
  }
}
