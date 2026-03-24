import { recursiveDFS, recursiveDFSMetadata } from './recursive';
import { binaryTree, binaryTreeMetadata } from './binaryTree';
import { recursiveDivision, recursiveDivisionMetadata } from './recursiveDivision';
import { sidewinder, sidewinderMetadata } from './sidewinder';
import { prim, primMetadata } from './prim';
import { kruskal, kruskalMetadata } from './kruskal';export interface MazeStep {
  x: number;
  y: number;
  type: 'wall' | 'air';
}

export type MazeAlgorithm = (
  rows: number,
  cols: number
) => Generator<MazeStep, void, unknown>;

export interface MazeAlgorithmMetadata {
  id: string;
  name: string;
  description: string;
  isImplemented: boolean;
  execute: MazeAlgorithm;
}

export const MAZE_ALGORITHMS: Record<string, MazeAlgorithmMetadata> = {
  none: {
    id: 'none',
    name: 'Generador de Laberinto...',
    description: '',
    isImplemented: true,
    execute: function*() { /* fallback */ } 
  },
  [recursiveDFSMetadata.id]: {
    ...recursiveDFSMetadata,
    execute: recursiveDFS,
  },
  [primMetadata.id]: {
    ...primMetadata,
    execute: prim,
  },
  [kruskalMetadata.id]: {
    ...kruskalMetadata,
    execute: kruskal,
  },
  [binaryTreeMetadata.id]: {
    ...binaryTreeMetadata,
    execute: binaryTree,
  },
  [sidewinderMetadata.id]: {
    ...sidewinderMetadata,
    execute: sidewinder,
  },
  [recursiveDivisionMetadata.id]: {
    ...recursiveDivisionMetadata,
    execute: recursiveDivision,
  }
};
