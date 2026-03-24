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
    name: 'Generador de Laberintos...',
    description: 'Aún no has seleccionado ningún algoritmo de generación de laberintos en la barra de herramientas superior.\n\nLa generación procedimental de laberintos consiste en algoritmos matemáticos capaces de trazar pasillos, labrar salas o disponer corredores esculpiendo un espacio original mediante la ubicación de "aire" o el levantamiento estratégico de muros de forma inteligente. Algunos algoritmos generan laberintos "Perfectos" (sin el más mínimo bucle y donde se garantiza que cualquier punto transitable puede ser conectado con cualquier otro punto de la sala de forma determinista).',
    characteristics: [],
    applications: [],
    pseudocode: '',
    pseudocodeLegend: {
      'Laberinto': 'La cuadrícula inicial donde el algoritmo escupirá su patrón, inicialmente puede estar toda bloqueada por sólidos muros u hospedando completo vacío.',
      'Romper Muro': 'Acción determinista de convertir una celda o cuadrícula de tipo Muro oscuro en una de tipo "Aire" brillante y transitable.',
      'Visitada': 'Marcar internamente un área como "procesada o descubierta" en memoria para impedir que el algoritmo acabe atrapado construyendo bucles infinitos no deseados.'
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
