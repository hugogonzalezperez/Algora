import type { Step } from './index';

export const bfsMetadata = {
  id: 'bfs',
  name: 'Breadth-First Search (BFS)',
  description: 'Breadth-First Search (BFS) is one of the most fundamental and elegant graph traversal algorithms in computer science. It operates like a ripple in a pond: systematically exploring each layer of distance before venturing to the next.\\n\\nIn unweighted grids (where every step has the same cost), BFS is mathematically guaranteed to find the absolute shortest path. It is the perfect tool for finding the quickest route when only the total number of steps matters.',
  characteristics: [
    'Always guarantees the shortest path in uniform-cost environments.',
    'Concentric wave exploration (layer by layer).',
    'Data Structure: Uses a Queue following the FIFO principle.'
  ],
  applications: [
    'Finding degrees of separation in social networks.',
    'Navigation in simple grids and basic GPS routing.',
    'Flood Fill algorithms for digital painting tools.'
  ],
  pseudocode: `Queue = [Start], Visited = {Start}
While Queue is not empty:
  Current = Pop first element from Queue
  If Current == End: Return Path
  For each Neighbor of Current:
    If Neighbor is not Visited:
      Mark Neighbor as Visited
      Add Neighbor to Queue`,
  pseudocodeLegend: {
    'Queue': 'FIFO (First In, First Out) structure. Nodes enter on one side and exit on the other in strict arrival order.',
    'Current': 'The cell currently being analyzed by the algorithm in this processing cycle.',
    'Neighbor': 'Adjacent perpendicular cells (Up, Down, Left, Right).',
    'Visited': 'Memory log that prevents the algorithm from uselessly backtracking.'
  },
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