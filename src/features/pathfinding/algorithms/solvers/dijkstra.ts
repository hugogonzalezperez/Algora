import type { Step } from './index';

export const dijkstraMetadata = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description: 'Named after the legendary Edsger W. Dijkstra, this algorithm is the "founding father" of modern pathfinding. Its approach is purely mathematical and guaranteed: it expands a uniform ripple from the origin, calculating the exact cost to reach every corner of the map without leaving any option to chance.\\n\\nUnlike A*, Dijkstra does not use a compass (heuristic); it is a "blind" but infallible search that explores all possibilities until it finds the goal. Its true magic happens in terrains with variable costs, where it must decide whether to go around a mountain or cross a swamp based solely on the path\'s accumulated weight.',
  characteristics: [
    'Always guarantees the shortest path mathematically and unconditionally.',
    'Uniform search in all directions (no bias toward the goal).',
    'Ideal for weighted graphs (e.g., difficult terrains, tolls).'
  ],
  applications: [
    'Internet routing protocols (like OSPF).',
    'Logistics and distribution with dynamic transport costs.',
    'High-complexity electrical grids and piping systems.'
  ],
  pseudocode: `Open = [Start], G[Start] = 0
While Open is not empty:
  Current = Node in Open with lowest G
  If Current == End: Return Path
  For each Neighbor of Current:
    new_G = G[Current] + Weight(Current, Neighbor)
    If new_G < G[Neighbor]:
      G[Neighbor] = new_G
      Add Neighbor to Open (Min-Heap)`,
  pseudocodeLegend: {
    'Open': 'Priority Queue (Min-Heap) that keeps discovered nodes in check, always prioritizing the one with the lowest accumulated cost.',
    'G': 'The actual and tangible cost accumulated from the starting point to the node in question.',
    'Weight': 'The numerical value of moving to a neighbor (1 for straights, √2 for diagonals).',
    'Current': 'The node with the shortest verified path so far in the waiting list.'
  },
  isImplemented: true
};

// Priority Queue simple para Dijkstra / A* (Min-Heap)
class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  push(item: T) {
    this.heap.push(item);
    this.siftUp();
  }

  pop(): T | undefined {
    if (this.size() === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.size() > 0) {
      this.heap[0] = last;
      this.siftDown();
    }
    return top;
  }

  size() {
    return this.heap.length;
  }

  private siftUp() {
    let nodeIdx = this.heap.length - 1;
    while (nodeIdx > 0) {
      const parentIdx = (nodeIdx - 1) >>> 1;
      if (this.comparator(this.heap[nodeIdx], this.heap[parentIdx]) < 0) {
        [this.heap[nodeIdx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[nodeIdx]];
        nodeIdx = parentIdx;
      } else break;
    }
  }

  private siftDown() {
    let nodeIdx = 0;
    while (true) {
      let smallestIdx = nodeIdx;
      const leftChildIdx = (nodeIdx << 1) + 1;
      const rightChildIdx = (nodeIdx << 1) + 2;

      if (leftChildIdx < this.heap.length && this.comparator(this.heap[leftChildIdx], this.heap[smallestIdx]) < 0) {
        smallestIdx = leftChildIdx;
      }
      if (rightChildIdx < this.heap.length && this.comparator(this.heap[rightChildIdx], this.heap[smallestIdx]) < 0) {
        smallestIdx = rightChildIdx;
      }

      if (smallestIdx !== nodeIdx) {
        [this.heap[nodeIdx], this.heap[smallestIdx]] = [this.heap[smallestIdx], this.heap[nodeIdx]];
        nodeIdx = smallestIdx;
      } else break;
    }
  }
}

export function* dijkstra(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {

  const isWalkable = (x: number, y: number) => {
    return x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];
  };

  const gScore: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  gScore[start.y][start.x] = 0;

  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const closedSet = new Set<string>();

  type DijkstraNode = { g: number; x: number; y: number };
  const openSet = new PriorityQueue<DijkstraNode>((a, b) => a.g - b.g);

  openSet.push({ g: 0, x: start.x, y: start.y });

  yield { ...start, type: 'visited' };

  while (openSet.size() > 0) {
    const current = openSet.pop()!;
    const { x: cx, y: cy } = current;
    const curKey = `${cx},${cy}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);

    if (!(cx === start.x && cy === start.y)) {
      yield { x: cx, y: cy, type: 'visited' };
    }

    if (cx === end.x && cy === end.y) {
      const path: Step[] = [];
      let curr: { x: number; y: number } | null = { x: cx, y: cy };
      while (curr !== null) {
        path.push({ x: curr.x, y: curr.y, type: 'path' });
        curr = parent.get(`${curr.x},${curr.y}`) ?? null;
      }
      path.reverse();
      for (const step of path) yield step;
      return;
    }

    const currentG = gScore[cy][cx];

    // 8 Direcciones: Cardinales + Diagonales
    const dirs = [
      { dx: 1, dy: 0, cost: 1 },
      { dx: -1, dy: 0, cost: 1 },
      { dx: 0, dy: 1, cost: 1 },
      { dx: 0, dy: -1, cost: 1 },
      { dx: 1, dy: 1, cost: Math.sqrt(2) },
      { dx: 1, dy: -1, cost: Math.sqrt(2) },
      { dx: -1, dy: 1, cost: Math.sqrt(2) },
      { dx: -1, dy: -1, cost: Math.sqrt(2) },
    ];

    for (const { dx, dy, cost } of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (!isWalkable(nx, ny)) continue;

      // REGLA DE ESQUINAS RELAJADA: Solo prohibir diagonal si AMBOS vecinos cardinales son muros
      if (dx !== 0 && dy !== 0) {
        if (!isWalkable(nx, cy) && !isWalkable(cx, ny)) continue;
      }

      const nKey = `${nx},${ny}`;
      if (closedSet.has(nKey)) continue;

      const tentativeG = currentG + cost;

      if (tentativeG < gScore[ny][nx]) {
        gScore[ny][nx] = tentativeG;
        parent.set(nKey, { x: cx, y: cy });
        openSet.push({ g: tentativeG, x: nx, y: ny });
      }
    }
  }
}
