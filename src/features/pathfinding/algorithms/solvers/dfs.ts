import type { Step } from './index';

export const dfsMetadata = {
  id: 'dfs',
  name: 'Depth-First Search (DFS)',
  description: 'Depth-First Search (DFS) is an intrepid exploration algorithm that prioritizes depth over breadth. Imagine an explorer in a cave deciding to follow a single tunnel to its very end before backtracking to try another; that is the essence of DFS.\\n\\nIt is a "greedy" algorithm that moves forward until it hits a wall or obstacle, at which point it uses a technique called "Backtracking" to resume from the last known fork. While it does not guarantee the shortest path, it is extremely efficient for discovering the complete structure of a maze or detecting cycles in complex systems.',
  characteristics: [
    'Deep vertical exploration (goes to the bottom before branching).',
    'Does not guarantee the shortest path (may take massive detours).',
    'Data Structure: Uses a Stack following the LIFO principle.'
  ],
  applications: [
    'Generating and solving complex mazes.',
    'Cycle detection in network topologies and software dependencies.',
    'Board game analysis and decision-making in logic trees.'
  ],
  pseudocode: `Stack = [Start], Visited = {Start}
While Stack is not empty:
  Current = Pop last element from Stack (Pop)
  If Current == End: Return Path
  For each Neighbor of Current:
    If Neighbor is not Visited:
      Mark Neighbor as Visited
      Add Neighbor to Stack`,
  pseudocodeLegend: {
    'Stack': 'LIFO (Last In, First Out) structure. The last element to enter is always the first to be processed.',
    'Current': 'The node being explored in the current step of the algorithm.',
    'Backtracking': "The ability to step back on one's own tracks when reaching a dead end.",
    'Visited': 'Security filter that prevents the algorithm from entering infinite loops.'
  },
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
