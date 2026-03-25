
import type { SortingStep } from '../../types/sorting';

export function* radixSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;
  
  // Call getMax(array, size)
  yield { type: 'pivot', indices: [], description: 'Entering getMax() to find the largest element', line: 28 };
  
  // Inside getMax
  let max = arr[0];
  yield { type: 'compare', indices: [0], description: 'Initialize max with the first element', line: 1 };
  
  for (let i = 1; i < n; i++) {
    yield { type: 'compare', indices: [i], description: `Comparing arr[${i}] with current max (${max})`, line: 2 };
    
    yield { type: 'compare', indices: [i], description: `if (arr[${i}] > max)`, line: 3 };
    if (arr[i] > max) {
      max = arr[i];
      yield { type: 'pivot', indices: [i], description: `New maximum found: ${max}`, line: 4 };
    }
  }
  yield { type: 'pivot', indices: [], description: `getMax returns ${max}`, line: 5 };

  // Back to radixsort
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield { type: 'pivot', indices: [], description: `Evaluating place value loop condition for exp = ${exp}`, line: 29 };
    yield { type: 'pivot', indices: [], description: `Calling countingSort(array, size, ${exp})`, line: 30 };
    yield* countingSortForRadix(arr, n, exp);
  }
}

function* countingSortForRadix(arr: number[], n: number, exp: number): Generator<SortingStep> {
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  yield { type: 'pivot', indices: [], description: `Initializing output and count arrays`, line: 10 };

  // Count frequencies
  yield { type: 'pivot', indices: [], description: `Starting frequency count loop`, line: 12 };
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
    yield { type: 'compare', indices: [i], description: `Incrementing frequency bucket [${digit}] for element ${arr[i]}`, line: 13 };
  }

  // Calculate cumulative count
  yield { type: 'pivot', indices: [], description: `Starting cumulative count loop`, line: 15 };
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
    yield { type: 'pivot', indices: [], description: `Accumulating count[${i}] = ${count[i]}`, line: 16 };
  }

  // Build the output array from right to left to maintain stability
  yield { type: 'pivot', indices: [], description: `Starting sorted placement loop (right-to-left)`, line: 18 };
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    
    yield { type: 'compare', indices: [i], description: `Placing ${arr[i]} at output index ${count[digit] - 1}`, line: 19 };
    
    count[digit]--;
    yield { type: 'compare', indices: [i], description: `Decrementing bucket [${digit}] to ${count[digit]}`, line: 20 };
  }

  // Copy output array back to arr
  yield { type: 'pivot', indices: [], description: `Starting array copy loop`, line: 23 };
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { type: 'overwrite', indices: [i], array: [...arr], description: `Copying ${arr[i]} back to the main array`, line: 24 };
  }
}
