export interface Step {
  x: number;
  y: number;
  type?: string;
}

export type PathfindingAlgorithm = (
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
) => Generator<Step, void, unknown>;

export interface AlgorithmMetadata {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  applications: string[];
  isImplemented: boolean;
  execute: PathfindingAlgorithm;
}

import { bfs, bfsMetadata } from './bfs';
import { dfs, dfsMetadata } from './dfs';
import { astar, astarMetadata } from './astar';
import { dijkstra, dijkstraMetadata } from './dijkstra';
import { jps, jpsMetadata } from './jps';

export const PATHFINDING_ALGORITHMS: Record<string, AlgorithmMetadata> = {
  none: {
    id: 'none',
    name: 'Solucionador de Laberinto...',
    description: '',
    characteristics: [],
    applications: [],
    isImplemented: true,
    execute: function* () { /* fallback */ }
  },
  [bfsMetadata.id]: {
    ...bfsMetadata,
    execute: bfs,
  },
  [dfsMetadata.id]: {
    ...dfsMetadata,
    execute: dfs,
  },
  [astarMetadata.id]: {
    ...astarMetadata,
    execute: astar,
  },
  [dijkstraMetadata.id]: {
    ...dijkstraMetadata,
    execute: dijkstra,
  },
  [jpsMetadata.id]: {
    ...jpsMetadata,
    execute: jps,
  }
};


