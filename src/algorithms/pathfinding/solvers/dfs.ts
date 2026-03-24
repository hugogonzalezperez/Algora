import type { Step } from './index';

export const dfsMetadata = {
  id: 'dfs',
  name: 'Depth-First Search (DFS)',
  description: 'DFS es un algoritmo de búsqueda que explora tan profundo como sea posible a lo largo de cada rama antes de retroceder. No garantiza encontrar el camino más corto, pero gasta muy poca memoria.',
  characteristics: [
    "No garantiza el camino más corto.",
    "Complejidad temporal: O(V + E).",
    "Usa una estructura de pila (LIFO)."
  ],
  applications: [
    "Generación y resolución de laberintos.",
    "Detección de ciclos en grafos.",
    "Búsquedas exhaustivas donde la profundidad importa."
  ],
  isImplemented: true
};

export function* dfs(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const stack = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  yield { ...start, type: 'visited' };

  while (stack.length > 0) {
    const current = stack.pop()!;

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

    // Para que el DFS visualmente parezca más natural (explorando Arriba, Derecha, Abajo, Izquierda),
    // empujamos a la pila en el orden inverso (Izquierda, Abajo, Derecha, Arriba).
    // Al hacer pop(), saldrá Arriba primero, luego Derecha, etc.
    const neighbors = [
      { x: current.x, y: current.y - 1 }, // Arriba
      { x: current.x - 1, y: current.y }, // Izquierda
      { x: current.x, y: current.y + 1 }, // Abajo
      { x: current.x + 1, y: current.y }, // Derecha
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
        stack.push(neighbor);
        yield { ...neighbor, type: 'visited' };
      }
    }
  }
}
