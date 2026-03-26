
export type SortingStepType = 'compare' | 'swap' | 'pivot' | 'sorted' | 'overwrite';

export interface SortingStep {
  type: SortingStepType;
  indices: number[];
  values?: number[];
  array?: number[];
  line?: number;
  description?: string;
}

export interface SortingAlgorithmMetadata {
  id: string;
  name: string;
  description: string;
  worstCase: string;
  averageCase: string;
  bestCase: string;
  spaceComplexity: string;
  stability: 'Stable' | 'Unstable';
  method: string;
  technicalNote?: string;
  characteristics: string[];
  applications: string[];
  pseudocode: string;
  pseudocodeLegend: Record<string, string>;
  headerCode?: string[]; // Code intended for the side-by-side view
}
