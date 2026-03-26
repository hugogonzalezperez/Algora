import { useState, useCallback, useRef } from 'react';
import { SORTING_ALGORITHMS } from '../algorithms';
import type { SortingStep } from '../types';

const STATUS_READY = 'System ready • Pending execution';

export interface SortingAnimationState {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  pivotingIndices: number[];
  sortedIndices: Set<number>;
  overwritingIndices: number[];
  activeLine: number;
  statusMessage: string;
  isSorting: boolean;
  isPaused: boolean;
}

export interface SortingAnimationActions {
  handleSort: () => Promise<void>;
  handleStop: () => void;
  handleReset: () => void;
  generateArray: (size: number) => void;
  setArray: (arr: number[]) => void;
}

export const useSortingAnimation = (
  activeAlgorithmId: string,
  speed: number
) => {
  const [array, setArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [pivotingIndices, setPivotingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [overwritingIndices, setOverwritingIndices] = useState<number[]>([]);
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [statusMessage, setStatusMessage] = useState<string>(STATUS_READY);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const sortingRef = useRef<boolean>(false);
  const generatorRef = useRef<Generator<SortingStep> | null>(null);

  const resetVisuals = useCallback(() => {
    setComparingIndices([]);
    setSwappingIndices([]);
    setPivotingIndices([]);
    setSortedIndices(new Set());
    setOverwritingIndices([]);
    setActiveLine(-1);
    setStatusMessage(STATUS_READY);
  }, []);

  const generateArray = useCallback((size: number) => {
    if (isSorting || isPaused) return;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setInitialArray(newArray);
    resetVisuals();
    generatorRef.current = null;
  }, [isSorting, isPaused, resetVisuals]);

  const updateVisuals = useCallback((step: SortingStep, currentArray: number[]) => {
    const values = step.indices.map(i => currentArray[i]);

    // Reset temporary highlights
    setComparingIndices([]);
    setSwappingIndices([]);
    setPivotingIndices([]);
    setOverwritingIndices([]);

    // Set status message
    if (step.description) {
      setStatusMessage(step.description);
    } else {
      switch (step.type) {
        case 'compare': setStatusMessage(`Comparing ${values.join(' and ')}`); break;
        case 'swap':    setStatusMessage(`Swapping ${values.join(' and ')}`); break;
        case 'pivot':   setStatusMessage(`Pivot selected: ${values[0]}`); break;
        case 'sorted':  setStatusMessage(`Final position for ${values.join(', ')}`); break;
        case 'overwrite': setStatusMessage(`Writing ${values[0]} at position ${step.indices[0]}`); break;
      }
    }

    // Update highlights
    switch (step.type) {
      case 'compare':   setComparingIndices(step.indices); break;
      case 'swap':      setSwappingIndices(step.indices); break;
      case 'pivot':     setPivotingIndices(step.indices); break;
      case 'sorted':    setSortedIndices(prev => new Set([...prev, ...step.indices])); break;
      case 'overwrite': setOverwritingIndices(step.indices); break;
    }

    if (step.line !== undefined) {
      setActiveLine(step.line);
    }
  }, []);

  const handleSort = useCallback(async () => {
    if (isSorting) return;

    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current = true;

    if (!generatorRef.current) {
      resetVisuals();
      const algorithm = SORTING_ALGORITHMS[activeAlgorithmId];
      generatorRef.current = algorithm([...array]);
    }

    const generator = generatorRef.current;
    if (!generator) {
      setIsSorting(false);
      sortingRef.current = false;
      return;
    }

    let step = generator.next();
    while (!step.done && sortingRef.current) {
      const stepData: SortingStep = step.value;
      const arrForStatus = stepData.array || array;
      updateVisuals(stepData, arrForStatus);

      if (stepData.array) {
        setArray(stepData.array);
      }

      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, speed));
      } else {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      if (!sortingRef.current) break;

      step = generator.next();
    }

    if (step.done) {
      // Use resetVisuals then override for completion state
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotingIndices([]);
      setOverwritingIndices([]);
      setActiveLine(-1);
      setIsSorting(false);
      setIsPaused(false);
      sortingRef.current = false;
      generatorRef.current = null;
      setSortedIndices(new Set(Array.from({ length: array.length }, (_, i) => i)));
      setStatusMessage('Sorting Complete • Array Resolved');
    }
  }, [array, isSorting, activeAlgorithmId, speed, updateVisuals, resetVisuals]);

  const handleStop = useCallback(() => {
    sortingRef.current = false;
    setIsSorting(false);
    setIsPaused(true);
    setStatusMessage('Paused • Click Resume to continue');
  }, []);

  const handleReset = useCallback(() => {
    sortingRef.current = false;
    setIsSorting(false);
    setIsPaused(false);
    generatorRef.current = null;
    setArray([...initialArray]);
    resetVisuals();
  }, [initialArray, resetVisuals]);

  return {
    // State
    array,
    initialArray,
    comparingIndices,
    swappingIndices,
    pivotingIndices,
    sortedIndices,
    overwritingIndices,
    activeLine,
    statusMessage,
    isSorting,
    isPaused,
    // Actions
    handleSort,
    handleStop,
    handleReset,
    generateArray,
  } as const;
};
