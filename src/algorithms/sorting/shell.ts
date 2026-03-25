
import type { SortingStep } from '../../types/sorting';

export function* shellSort(array: number[]): Generator<SortingStep> {
  const arr = [...array];
  const n = arr.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    yield { type: 'pivot', indices: [], description: `Using gap size: ${gap}` };
    
    for (let i = gap; i < n; i += 1) {
      const temp = arr[i];
      let j;
      
      yield { type: 'compare', indices: [i], description: `Inserting element ${temp} into gap-sorted sequence` };

      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        yield { type: 'compare', indices: [j, j - gap], description: `Comparing ${arr[j-gap]} and ${temp}` };
        arr[j] = arr[j - gap];
        yield { type: 'overwrite', indices: [j], array: [...arr], description: `Shifting ${arr[j-gap]} forward` };
      }
      
      arr[j] = temp;
      yield { type: 'overwrite', indices: [j], array: [...arr], description: `Placing ${temp} in its hole` };
    }
  }
}
