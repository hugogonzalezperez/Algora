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
  pseudocode: string;
  pseudocodeLegend?: Record<string, string>;
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
    name: 'Pathfinding Solver...',
    description: 'You haven\'t selected a pathfinding algorithm yet.\n\nPathfinding algorithms find the optimal path between a start and end point. Some algorithms use simple blind searches, while others use heuristics to efficiently guide them toward the goal.',
    characteristics: [],
    applications: [],
    pseudocode: '',
    pseudocodeLegend: {
      'Inicio': 'The starting node where the pathfinding algorithm begins.',
      'Fin': 'The destination node that the algorithm must reach to finish.',
      'Camino': 'The final consolidated path from the Start to the End, obtained by tracing the corresponding nodes step by step.'
    },
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


