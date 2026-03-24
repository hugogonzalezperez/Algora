import type { Step } from './index';

export const bfsMetadata = {
  id: 'bfs',
  name: 'Breadth-First Search (BFS)',
  description: 'BFS es un algoritmo de búsqueda para grafos que explora todos los nodos a una distancia k antes de pasar a los nodos a distancia k+1.',
  characteristics: [
    "Garantiza el camino más corto en grafos sin pesos.",
    "Complejidad temporal: O(V + E).",
    "Usa una estructura de cola (FIFO)."
  ],
  applications: [
    "Redes sociales (encontrar amigos de amigos).",
    "Motores de búsqueda (rastreo web).",
    "Sistemas de navegación GPS simples."
  ],
  isImplemented: true
};

export function* bfs(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const queue = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  yield { ...start, type: 'visited' };

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: Step[] = [];
      let curr: { x: number, y: number } | null = current;
      while (curr) {
        path.push({ ...curr, type: 'path' });
        curr = parent.get(`${curr.x},${curr.y}`) || null;
      }
      
      path.reverse();
      for (const step of path) {
        yield step;
      }
      return;
    }

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 && neighbor.x < cols &&
        neighbor.y >= 0 && neighbor.y < rows &&
        !grid[neighbor.y][neighbor.x] &&
        !visited.has(`${neighbor.x},${neighbor.y}`)
      ) {
        visited.add(`${neighbor.x},${neighbor.y}`);
        parent.set(`${neighbor.x},${neighbor.y}`, current);
        queue.push(neighbor);
        yield { ...neighbor, type: 'visited' };
      }
    }
  }
}