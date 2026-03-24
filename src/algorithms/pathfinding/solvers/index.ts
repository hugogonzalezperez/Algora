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
    name: 'Solucionador de Caminos...',
    description: 'Aún no has seleccionado ningún algoritmo de resolución de caminos en la barra de herramientas superior.\n\nLos algoritmos de resolución o Pathfinding se encargan de encontrar de forma inteligente y matemática la ruta existente entre un punto de Inicio y un punto de Fin. Algunos algoritmos son simples búsquedas exhaustivas a ciegas que se expanden hacia todos lados, mientras que otros están dotados de heurísticas calculadas que les permiten dirigirse casi rígidamente hacia la meta de forma veloz.',
    characteristics: [],
    applications: [],
    pseudocode: '',
    pseudocodeLegend: {
      'Inicio': 'El nodo de partida desde donde el algoritmo de pathfinding arranca.',
      'Fin': 'El nodo destino o meta que el algoritmo debe alcanzar para terminar.',
      'Camino': 'La ruta final consolidada desde el Inicio hasta el Fin obtenida trazando los nodos correspondientes de paso en paso.'
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


