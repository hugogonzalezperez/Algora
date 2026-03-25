import type { SortingAlgorithmMetadata } from '../../types/sorting';
import { bubbleSort } from './bubble';
import { quickSort } from './quick';
import { mergeSort } from './merge';
import { insertionSort } from './insertion';
import { selectionSort } from './selection';
import { heapSort } from './heap';
import { shellSort } from './shell';
import { countingSort } from './counting';
import { radixSort } from './radix';
import { bogoSort } from './bogo';

export const SORTING_ALGORITHMS: Record<string, any> = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
  insertion: insertionSort,
  selection: selectionSort,
  heap: heapSort,
  shell: shellSort,
  counting: countingSort,
  radix: radixSort,
  bogo: bogoSort,
};

export const SORTING_METADATA: Record<string, SortingAlgorithmMetadata> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    worstCase: 'O(n²)',
    averageCase: 'O(n²)',
    bestCase: 'O(n)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    method: 'Exchanging',
    technicalNote: 'Bubble sort is specifically useful when the input is already nearly sorted, where it achieves linear time complexity.',
    characteristics: ['Stable', 'In-place', 'Easy to implement'],
    applications: ['Educational purposes', 'Very small datasets', 'Nearly sorted array detection'],
    headerCode: [
      "void bubbleSort(int arr[], int n) {",
      "  for (int i = 0; i < n-1; i++) {",
      "    for (int j = 0; j < n-i-1; j++) {",
      "      if (arr[j] > arr[j+1]) {",
      "        swap(arr[j], arr[j+1]);",
      "      }",
      "    }",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento bubbleSort(lista):
  n = longitud(lista)
  repetir
    intercambio = falso
    para i = 1 hasta n-1 inclusive hacer
      si lista[i-1] > lista[i] entonces
        intercambiar(lista[i-1], lista[i])
        intercambio = verdadero
      fin si
    fin para
    n = n - 1
  hasta que no intercambio
fin procedimiento`,
    pseudocodeLegend: {
      'lista': 'The array of elements to be sorted',
      'n': 'Number of elements in the list',
      'intercambio': 'Flag to track if any swap occurred during the pass'
    }
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Insertion Sort is an intuitive, incremental sorting mechanism that builds the final sorted array one element at a time. By conceptually dividing the array into a sorted and an unsorted region, it elegantly shifts elements to create space for new insertions, mirroring how one might sort a hand of playing cards.',
    worstCase: 'O(n²)',
    averageCase: 'O(n²)',
    bestCase: 'O(n)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    method: 'Insertion',
    technicalNote: 'While structurally inefficient for vast datasets, Insertion Sort shines in localized contexts. It is incredibly fast for nearly-sorted data and extremely small arrays, making it the preferred fallback engine within hybrid powerhouses like Timsort and Introsort.',
    characteristics: ['Stable', 'In-place', 'Efficient for small data'],
    applications: ['Small datasets', 'Nearly sorted arrays', 'Online sorting'],
    headerCode: [
      "void insertionSort(int arr[], int n) {",
      "  for (int i = 1; i < n; i++) {",
      "    int key = arr[i];",
      "    int j = i - 1;",
      "    while (j >= 0 && arr[j] > key) {",
      "      arr[j + 1] = arr[j];",
      "      j = j - 1;",
      "    }",
      "    arr[j + 1] = key;",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento insertionSort(lista):
  para i = 1 hasta longitud(lista)-1 hacer
    clave = lista[i]
    j = i - 1
    mientras j >= 0 y lista[j] > clave hacer
      lista[j + 1] = lista[j]
      j = j - 1
    fin mientras
    lista[j + 1] = clave
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'clave': 'The current element being inserted',
      'j': 'The index used to scan the sorted portion'
    }
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    description: 'Selection Sort is a deterministic, in-place comparison algorithm that systematically divides the input into a sorted and an unsorted sublist. It repetitively scans the unsorted region to locate the absolute minimum element, fundamentally cementing it at the tail of the sorted boundary.',
    worstCase: 'O(n²)',
    averageCase: 'O(n²)',
    bestCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    method: 'Selection',
    technicalNote: 'Selection Sort is renowned for its predictability and absolute minimization of memory writes. Regardless of the initial array distribution, it perfectly guarantees exactly O(n) swaps, rendering it uniquely valuable for systems where write operations to flash memory are prohibitively expensive.',
    characteristics: ['In-place', 'Unstable', 'Minimal swaps'],
    applications: ['Small datasets', 'Systems with limited memory', 'Minimizing write operations'],
    headerCode: [
      "void selectionSort(int arr[], int n) {",
      "  for (int i = 0; i < n-1; i++) {",
      "    int min_idx = i;",
      "    for (int j = i+1; j < n; j++)",
      "      if (arr[j] < arr[min_idx])",
      "        min_idx = j;",
      "    swap(arr[min_idx], arr[i]);",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento selectionSort(lista):
  n = longitud(lista)
  para i = 0 hasta n-2 hacer
    min_idx = i
    para j = i+1 hasta n-1 hacer
      si lista[j] < lista[min_idx] entonces
        min_idx = j
      fin si
    fin para
    intercambiar(lista[min_idx], lista[i])
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'min_idx': 'Index of the minimum element found in the unsorted part'
    }
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    description: 'An efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around it.',
    worstCase: 'O(n²)',
    averageCase: 'O(n log n)',
    bestCase: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    stability: 'Unstable',
    method: 'Partitioning',
    technicalNote: 'Quick sort performance depends heavily on pivot selection. In-place versions are widely used in commercial libraries.',
    characteristics: ['Divide and conquer', 'Unstable', 'Average-case efficient'],
    applications: ['General purpose sorting', 'Memory-limited systems', 'Commercial sort implementations'],
    headerCode: [
      "void quickSort(int arr[], int low, int high) {",
      "  if (low < high) {",
      "    int pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
      "",
      "int partition(int arr[], int low, int high) {",
      "  int pivot = arr[high];",
      "  int i = (low - 1);",
      "  for (int j = low; j < high; j++) {",
      "    if (arr[j] < pivot) {",
      "      i++;",
      "      swap(arr[i], arr[j]);",
      "    }",
      "  }",
      "  swap(arr[i + 1], arr[high]);",
      "  return (i + 1);",
      "}"
    ],
    pseudocode: `procedimiento quickSort(lista, bajo, alto):
  si bajo < alto entonces
    p = particion(lista, bajo, alto)
    quickSort(lista, bajo, p - 1)
    quickSort(lista, p + 1, alto)
  fin si
fin procedimiento

procedimiento particion(lista, bajo, alto):
  pivote = lista[alto]
  i = bajo - 1
  para j = bajo hasta alto - 1 hacer
    si lista[j] < pivote entonces
      i = i + 1
      intercambiar(lista[i], lista[j])
    fin si
  fin para
  intercambiar(lista[i + 1], lista[alto])
  devolver i + 1
fin procedimiento`,
    pseudocodeLegend: {
      'bajo': 'Starting index of the sub-array',
      'alto': 'Ending index of the sub-array',
      'p': 'Final partition index of the pivot'
    }
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    description: 'A divide-and-conquer algorithm that continually splits a list in half until each sub-list contains a single element, then merges those sub-lists back together.',
    worstCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    bestCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stability: 'Stable',
    method: 'Merging',
    technicalNote: 'Merge sort is highly parallelizable and efficient for linked lists, though it requires O(n) additional space for arrays.',
    characteristics: ['Divide and conquer', 'Stable', 'Guaranteed O(n log n)'],
    applications: ['Linked list sorting', 'External sorting (large files)', 'Stability-critical cases'],
    headerCode: [
      "void mergeSort(int arr[], int L, int R) {",
      "  if (L < R) {",
      "    int M = L + (R - L) / 2;",
      "    mergeSort(arr, L, M);",
      "    mergeSort(arr, M + 1, R);",
      "    merge(arr, L, M, R);",
      "  }",
      "}",
      "",
      "void merge(int arr[], int l, int m, int r) {",
      "  int i, j, k;",
      "  int n1 = m - l + 1;",
      "  int n2 = r - m;",
      "  i = 0;",
      "  j = 0;",
      "  k = l;",
      "  while (i < n1 && j < n2) {",
      "    if (L[i] <= R[j]) {",
      "      arr[k] = L[i];",
      "      i++;",
      "    } else {",
      "      arr[k] = R[j];",
      "      j++;",
      "    }",
      "    k++;",
      "  }",
      "  // Copy the remaining elements of L[], if there are any",
      "  while (i < n1) {",
      "    arr[k] = L[i];",
      "    i++;",
      "    k++;",
      "  }",
      "  // Copy the remaining elements of R[], if there are any",
      "  while (j < n2) {",
      "    arr[k] = R[j];",
      "    j++;",
      "    k++;",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento mergeSort(lista, inicio, fin):
  si inicio < fin entonces
    mitad = (inicio + fin) / 2
    mergeSort(lista, inicio, mitad)
    mergeSort(lista, mitad + 1, fin)
    mezclar(lista, inicio, mitad, fin)
  fin si
fin procedimiento`,
    pseudocodeLegend: {
      'inicio': 'Starting index of the sub-array',
      'fin': 'Ending index of the sub-array',
      'mitad': 'Middle point of the sub-array'
    }
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    description: 'Heap Sort is a sophisticated, complete binary tree-based sorting paradigm. By elegantly transforming the array into a Max-Heap data structure, it continuously harvests the largest element from the root and seamlessly reconstructs the heap, guaranteeing highly efficient, in-place sorting.',
    worstCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    bestCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    method: 'Selection',
    technicalNote: 'Unlike Quick Sort, Heap Sort provides an unshakeable O(n log n) worst-case time complexity while maintaining a strict O(1) auxiliary space footprint. Though it suffers from poor cache locality due to erratic memory access patterns, its strict mathematical guarantees make it indispensable in mission-critical embedded systems.',
    characteristics: ['In-place', 'Unstable', 'Consistent performance'],
    applications: ['Systems with strict memory limits', 'Embedded systems', 'Priority queues implementation'],
    headerCode: [
      "void heapSort(int arr[], int n) {",
      "  for (int i = n / 2 - 1; i >= 0; i--)",
      "    heapify(arr, n, i);",
      "  for (int i = n - 1; i > 0; i--) {",
      "    swap(arr[0], arr[i]);",
      "    heapify(arr, i, 0);",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento heapSort(lista):
  n = longitud(lista)
  para i = n/2 - 1 hasta 0 hacer
    heapify(lista, n, i)
  fin para
  para i = n-1 hasta 1 hacer
    intercambiar(lista[0], lista[i])
    heapify(lista, i, 0)
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'heapify': 'Maintain the max heap property for a subtree rooted at given index'
    }
  },
  shell: {
    id: 'shell',
    name: 'Shell Sort',
    description: 'Shell Sort is an ingenious generalization of Insertion Sort that breaks the barriers of adjacent-only swaps. By sorting elements separated by a progressively shrinking "gap," it aggressively shuttles remote elements to their correct neighborhoods, drastically reducing the number of final insertions required.',
    worstCase: 'O(n²)',
    averageCase: 'O(n^1.25)',
    bestCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    method: 'Insertion',
    technicalNote: 'The foundational efficiency of Shell Sort is heavily coupled to its gap sequence (e.g., Hibbard, Sedgewick, or Knuth sequences). While overshadowed by sophisticated O(n log n) competitors, its lack of call stack overhead and concise implementation make it a highly respected choice in specific kernel architectures.',
    characteristics: ['In-place', 'Unstable', 'Improved Insertion Sort'],
    applications: ['Medium-sized datasets', 'Embedded systems', 'Legacy software'],
    headerCode: [
      "void shellSort(int arr[], int n) {",
      "  for (int gap = n/2; gap > 0; gap /= 2) {",
      "    for (int i = gap; i < n; i++) {",
      "      int temp = arr[i];",
      "      int j;",
      "      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)",
      "        arr[j] = arr[j - gap];",
      "      arr[j] = temp;",
      "    }",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento shellSort(lista):
  n = longitud(lista)
  para gap = n/2 hasta 1 con gap = gap/2 hacer
    para i = gap hasta n-1 hacer
      temp = lista[i]
      j = i
      mientras j >= gap y lista[j - gap] > temp hacer
        lista[j] = lista[j - gap]
        j = j - gap
      fin mientras
      lista[j] = temp
    fin para
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'gap': 'The distance between elements being compared'
    }
  },
  counting: {
    id: 'counting',
    name: 'Counting Sort',
    description: 'Counting Sort is a hyper-efficient, non-comparison-based integer sorting technique. By trading memory for sheer speed, it constructs a precise frequency map of distinct key values and performs a flawless prefix sum calculation to deterministically map each element directly to its final output index.',
    worstCase: 'O(n+k)',
    averageCase: 'O(n+k)',
    bestCase: 'O(n+k)',
    spaceComplexity: 'O(k)',
    stability: 'Stable',
    method: 'Counting',
    technicalNote: 'Counting sort shatters the O(n log n) lower bound of comparison sorts, reaching a breathtaking O(n + k) time complexity (where k is the key range). However, this speed demands O(k) secondary memory, tightly restricting its viability to datasets with dense, narrow integer domains.',
    characteristics: ['Stable', 'Not in-place', 'Non-comparison based'],
    applications: ['Sorting keys with small range', 'Subroutine for Radix sort', 'Histograms'],
    headerCode: [
      "void countingSort(int arr[], int n) {",
      "  int max = getMax(arr);",
      "  int count[max + 1] = {0};",
      "  for (int i = 0; i < n; i++) count[arr[i]]++;",
      "  for (int i = 1; i <= max; i++) count[i] += count[i-1];",
      "  for (int i = n-1; i >= 0; i--) {",
      "    output[count[arr[i]] - 1] = arr[i];",
      "    count[arr[i]]--;",
      "  }",
      "}"
    ],
    pseudocode: `procedimiento countingSort(lista):
  max = encontrarMaximo(lista)
  cuenta = array de tamaño max + 1 inicializado en 0
  para cada x en lista hacer
    cuenta[x] = cuenta[x] + 1
  fin para
  para i = 1 hasta max hacer
    cuenta[i] = cuenta[i] + cuenta[i-1]
  fin para
  para i = longitud(lista)-1 hasta 0 hacer
    salida[cuenta[lista[i]] - 1] = lista[i]
    cuenta[lista[i]] = cuenta[lista[i]] - 1
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'cuenta': 'Array that stores the frequency of each element',
      'salida': 'Temporary array to store balanced result'
    }
  },
  radix: {
    id: 'radix',
    name: 'Radix Sort',
    description: 'Radix Sort is a masterful, digit-by-digit sorting stratagem that bypasses direct comparisons entirely. Operating sequentially from the least significant digit (LSD) up to the most significant, it leverages a stable sub-routine (like Counting Sort) to progressively align multi-digit integer metrics perfectly in linear time.',
    worstCase: 'O(nk)',
    averageCase: 'O(nk)',
    bestCase: 'O(nk)',
    spaceComplexity: 'O(n+k)',
    stability: 'Stable',
    method: 'Counting (by digits)',
    technicalNote: 'Radix sort elegantly manages colossal datasets, offering O(nk) performance where k represents the maximum digit length. Historically predating modern computers (originally used for punch-card sorting), it modernly excels in high-performance computing scenarios involving huge strings or dense numerical metrics.',
    characteristics: ['Stable', 'Non-comparison', 'Efficient for large integers'],
    applications: ['Sorting large numbers', 'String sorting (lexicographical)', 'Punch card machines (historical)'],
    headerCode: [
      "int getMax(int array[], int n) {",
      "  int max = array[0];",
      "  for (int i = 1; i < n; i++)",
      "    if (array[i] > max)",
      "      max = array[i];",
      "  return max;",
      "}",
      "",
      "void countingSort(int array[], int size, int place) {",
      "  int output[size];",
      "  int count[10] = {0};",
      "",
      "  for (int i = 0; i < size; i++)",
      "    count[(array[i] / place) % 10]++;",
      "",
      "  for (int i = 1; i < 10; i++)",
      "    count[i] += count[i - 1];",
      "",
      "  for (int i = size - 1; i >= 0; i--) {",
      "    output[count[(array[i] / place) % 10] - 1] = array[i];",
      "    count[(array[i] / place) % 10]--;",
      "  }",
      "",
      "  for (int i = 0; i < size; i++)",
      "    array[i] = output[i];",
      "}",
      "",
      "void radixsort(int array[], int size) {",
      "  int max = getMax(array, size);",
      "  for (int place = 1; max / place > 0; place *= 10)",
      "    countingSort(array, size, place);",
      "}"
    ],
    pseudocode: `procedimiento radixSort(lista):
  maximo = encontrarMaximo(lista)
  para exp = 1 hasta maximo/exp > 0 con exp = exp * 10 hacer
    ordenarPorDigitos(lista, exp)
  fin para
fin procedimiento`,
    pseudocodeLegend: {
      'exp': 'The current significant digit position (1s, 10s, 100s, etc.)'
    }
  },
  bogo: {
    id: 'bogo',
    name: 'Bogo Sort',
    description: 'Bogo Sort is a profoundly satirical sorting algorithm rooted in the "generate and test" computing paradigm. Rather than employing logical heuristics, it blindly shuffles the entire array over and over, relying strictly on astronomical statistical probability to eventually, accidentally achieve absolute sorted order.',
    worstCase: 'O(∞)',
    averageCase: 'O((n+1)!)',
    bestCase: 'O(n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    method: 'Stochastic',
    technicalNote: 'Bogo Sort exists exclusively as a theoretical benchmark for abysmal performance. With an average time complexity of O((n+1)!), an array of merely 15 elements could conceptually take trillions of years to resolve. It serves as an excellent cautionary tale in computer science academia.',
    characteristics: ['Inefficient', 'Stochastic', 'Educational meme'],
    applications: ['Educational demonstrations', 'Testing the patience of users', 'Quantum Bogo Sort (theoretical)'],
    headerCode: [
      "void bogoSort(int arr[], int n) {",
      "  while (!isSorted(arr, n))",
      "    shuffle(arr, n);",
      "}"
    ],
    pseudocode: `procedimiento bogoSort(lista):
  mientras no estaOrdenada(lista) hacer
    barajarAleatoriamente(lista)
  fin mientras
fin procedimiento`,
    pseudocodeLegend: {
      'estaOrdenada': 'Function that checks if all elements are in non-decreasing order',
      'barajarAleatoriamente': 'Fisher-Yates shuffle or similar'
    }
  },
};
