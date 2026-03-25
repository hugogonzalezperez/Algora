import type { Step } from './index';

export const astarMetadata = {
  id: 'astar',
  name: 'A* Algorithm',
  description: 'A* is the crown jewel of pathfinding. Its genius lies in its perfect fusion: it combines the mathematical robustness of Dijkstra with the intelligent intuition of a Heuristic.\\n\\nUnlike other algorithms, A* does not walk blindly; it has a "compass" that tells it at each step how far it theoretically is from the goal. This allows it to ignore irrelevant paths and shoot like a bullet toward the objective, always guaranteeing the most efficient route with the least computational effort.',
  characteristics: [
    'The most efficient algorithm for finding the shortest path.',
    'Uses Heuristics (Octile distance) to guide the search toward the goal.',
    'Supports diagonal movement with an optimal balance between speed and precision.'
  ],
  applications: [
    'Video game engines for character movement (AI).',
    'High-performance mapping and GPS systems.',
    'Path planning for autonomous robots and drones.'
  ],
  pseudocode: `Open = [Start], G[Start] = 0, F[Start] = H(Start)
While Open is not empty:
  Current = Node in Open with lowest F (G + H)
  If Current == End: Return Path
  For each Neighbor of Current:
    new_G = G[Current] + Weight(Current, Neighbor)
    If new_G < G[Neighbor]:
      G[Neighbor] = new_G
      F[Neighbor] = new_G + H(Neighbor)
      Add Neighbor to Open (Min-Heap)`,
  pseudocodeLegend: {
    'G': 'The actual cost accumulated from the start to the node.',
    'H': 'Heuristic: A smart estimate of the remaining distance to the goal.',
    'F': 'Total priority (G + H). A* always chooses the node with the lowest F value.',
    'Octile Distance': 'Mathematical equation that allows natural movement in 8 directions.'
  },
  isImplemented: true
};

// Priority Queue simple para A* (Min-Heap)
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

export function* astar(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {

  // Heurística Octile para movimiento en 8 direcciones
  const h = (x: number, y: number) => {
    const dx = Math.abs(x - end.x);
    const dy = Math.abs(y - end.y);
    const D = 1;
    const D2 = Math.sqrt(2);
    // Añadimos un pequeño factor de desempate (tie-breaking) para que el camino sea más recto
    const p = 1 / (rows * cols);
    return (D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)) * (1 + p);
  };

  const isWalkable = (x: number, y: number) => {
    return x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];
  };

  const gScore: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  gScore[start.y][start.x] = 0;

  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const closedSet = new Set<string>();

  type OpenNode = { f: number; g: number; x: number; y: number };
  const openSet = new PriorityQueue<OpenNode>((a, b) => {
    if (a.f !== b.f) return a.f - b.f;
    return h(a.x, a.y) - h(b.x, b.y);
  });

  openSet.push({ f: h(start.x, start.y), g: 0, x: start.x, y: start.y });

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
        // Los dos vecinos cardinales que forman la esquina
        const cardinal1 = isWalkable(nx, cy);
        const cardinal2 = isWalkable(cx, ny);
        // Si AMBOS están bloqueados, es un cuello de botella insalvable por diagonal
        if (!cardinal1 && !cardinal2) continue;
      }

      const nKey = `${nx},${ny}`;
      if (closedSet.has(nKey)) continue;

      const tentativeG = currentG + cost;

      if (tentativeG < gScore[ny][nx]) {
        gScore[ny][nx] = tentativeG;
        parent.set(nKey, { x: cx, y: cy });
        const f = tentativeG + h(nx, ny);
        openSet.push({ f, g: tentativeG, x: nx, y: ny });
      }
    }
  }
}