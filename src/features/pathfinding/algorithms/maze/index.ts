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
  characteristics: string[];
  applications: string[];
  pseudocode: string;
  pseudocodeLegend?: Record<string, string>;
  isImplemented: boolean;
  execute: MazeAlgorithm;
}

export const MAZE_ALGORITHMS: Record<string, MazeAlgorithmMetadata> = {
  none: {
    id: 'none',
    name: 'Maze Generator...',
    description: 'You haven\'t selected any maze generation algorithm yet.\n\nMaze generation algorithms are mathematical methods that create mazes by intelligently placing walls and passages. Some algorithms create "perfect" mazes, which have no loops and guarantee that every point is reachable from any other point.',
    characteristics: [],
    applications: [],
    pseudocode: '',
    pseudocodeLegend: {
      'Maze': 'The initial grid where the algorithm will generate its pattern. It can start completely filled with walls or completely empty.',
      'Break Wall': 'Deterministic action of converting a cell or grid of type Dark Wall into a type of bright, passable "Air".',
      'Visitada': 'Mark internally an area as "processed or discovered" in memory to prevent the algorithm from getting trapped building unwanted infinite loops.'
    },
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
