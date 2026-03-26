import type { Step } from './index';

export const jpsMetadata = {
  id: 'jps',
  name: 'Jump Point Search (JPS)',
  description: 'Jump Point Search (JPS) is an amazing optimization of the A* algorithm designed for open spaces. Its secret is "teleportation": instead of checking every cell, it shoots directional rays to jump large distances and only stop at critical "turning points" (obstacle corners).\\n\\nThis technique allows it to completely ignore corridors and empty areas, drastically reducing the number of nodes in the waiting list. It is, without a doubt, the fastest algorithm for moving agents on large, clear maps without losing the shortest-path guarantee.',
  characteristics: [
    'Much faster than A* in maps with large open areas.',
    'Jumps over irrelevant cells searching only for inflection points.',
    'Guarantees the shortest path by optimizing asymmetrical exploration.'
  ],
  applications: [
    'Real-time strategy (RTS) games with giant maps.',
    'Drone navigation in large warehouses or outdoor spaces.',
    'Crowd simulation in clear urban environments.'
  ],
  pseudocode: `Open = [Start]
While Open is not empty:
  Current = Pop node with lowest F from Open
  If Current == End: Return Path
  For each Direction:
    JumpPoint = Jump(Current, Direction)
    If JumpPoint exists:
      Add JumpPoint to Open`,
  pseudocodeLegend: {
    'Jump Point': 'A strategic node where the path must necessarily change direction.',
    'Jump': 'The action of scanning in a straight line until a wall or a point of interest is found.',
    'Efficiency': 'JPS stands out by reducing the number of visited nodes by an order of magnitude.'
  },
  isImplemented: true
};

// Priority Queue simple para JPS (Min-Heap)
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

export function* jps(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {

  const isWalkable = (x: number, y: number) =>
    x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];

  // Distancia Octile para heurística
  const h = (x: number, y: number) => {
    const dx = Math.abs(x - end.x);
    const dy = Math.abs(y - end.y);
    const D = 1;
    const D2 = Math.sqrt(2);
    const p = 1 / (rows * cols);
    return (D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)) * (1 + p);
  };

  const gScore = new Map<string, number>();
  const parentMap = new Map<string, { x: number, y: number } | null>();
  const closedSet = new Set<string>();

  type JPSNode = { x: number, y: number, f: number, g: number };
  const openSet = new PriorityQueue<JPSNode>((a, b) => {
    if (a.f !== b.f) return a.f - b.f;
    return h(a.x, a.y) - h(b.x, b.y);
  });

  gScore.set(`${start.x},${start.y}`, 0);
  parentMap.set(`${start.x},${start.y}`, null);
  openSet.push({ x: start.x, y: start.y, f: h(start.x, start.y), g: 0 });

  yield { ...start, type: 'visited' };

  function jump(cx: number, cy: number, dx: number, dy: number): { x: number, y: number } | null {
    let nx = cx + dx;
    let ny = cy + dy;

    if (!isWalkable(nx, ny)) return null;

    // Strict No-Corner-Cutting: block diagonal moves through walls
    if (dx !== 0 && dy !== 0) {
      if (!isWalkable(cx + dx, cy) && !isWalkable(cx, cy + dy)) return null;
    }

    if (nx === end.x && ny === end.y) return { x: nx, y: ny };

    // Check forced neighbors
    if (dx !== 0 && dy !== 0) {
      // Diagonal
      if ((isWalkable(nx - dx, ny + dy) && !isWalkable(nx - dx, ny)) ||
        (isWalkable(nx + dx, ny - dy) && !isWalkable(nx, ny - dy))) {
        return { x: nx, y: ny };
      }
      // Recursive cardinal jumps
      if (jump(nx, ny, dx, 0) !== null || jump(nx, ny, 0, dy) !== null) {
        return { x: nx, y: ny };
      }
    } else if (dx !== 0) {
      // Horizontal
      if ((isWalkable(nx + dx, ny + 1) && !isWalkable(nx, ny + 1)) ||
        (isWalkable(nx + dx, ny - 1) && !isWalkable(nx, ny - 1))) {
        return { x: nx, y: ny };
      }
    } else {
      // Vertical
      if ((isWalkable(nx + 1, ny + dy) && !isWalkable(nx + 1, ny)) ||
        (isWalkable(nx - 1, ny + dy) && !isWalkable(nx - 1, ny))) {
        return { x: nx, y: ny };
      }
    }

    return jump(nx, ny, dx, dy);
  }

  function getNeighborDirections(node: JPSNode): { dx: number, dy: number }[] {
    const parent = parentMap.get(`${node.x},${node.y}`);
    if (!parent) {
      // Start node: all 8 directions
      return [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
      ];
    }

    const dx = Math.sign(node.x - parent.x);
    const dy = Math.sign(node.y - parent.y);
    const dirs: { dx: number, dy: number }[] = [];

    if (dx !== 0 && dy !== 0) {
      // Diagonal
      if (isWalkable(node.x + dx, node.y)) dirs.push({ dx, dy: 0 });
      if (isWalkable(node.x, node.y + dy)) dirs.push({ dx: 0, dy });
      if (isWalkable(node.x + dx, node.y + dy)) {
        // Natural diagonal only if no strict corner cut
        if (isWalkable(node.x + dx, node.y) || isWalkable(node.x, node.y + dy)) {
          dirs.push({ dx, dy });
        }
      }
      // Forced neighbors
      if (!isWalkable(node.x - dx, node.y) && isWalkable(node.x - dx, node.y + dy)) dirs.push({ dx: -dx, dy });
      if (!isWalkable(node.x, node.y - dy) && isWalkable(node.x + dx, node.y - dy)) dirs.push({ dx, dy: -dy });
    } else if (dx !== 0) {
      // Horizontal
      if (isWalkable(node.x + dx, node.y)) {
        dirs.push({ dx, dy: 0 });
        if (!isWalkable(node.x, node.y + 1) && isWalkable(node.x + dx, node.y + 1)) dirs.push({ dx, dy: 1 });
        if (!isWalkable(node.x, node.y - 1) && isWalkable(node.x + dx, node.y - 1)) dirs.push({ dx, dy: -1 });
      }
    } else {
      // Vertical
      if (isWalkable(node.x, node.y + dy)) {
        dirs.push({ dx: 0, dy });
        if (!isWalkable(node.x + 1, node.y) && isWalkable(node.x + 1, node.y + dy)) dirs.push({ dx: 1, dy });
        if (!isWalkable(node.x - 1, node.y) && isWalkable(node.x - 1, node.y + dy)) dirs.push({ dx: -1, dy });
      }
    }
    return dirs;
  }

  while (openSet.size() > 0) {
    const current = openSet.pop()!;
    const curKey = `${current.x},${current.y}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);

    yield { x: current.x, y: current.y, type: 'visited' };

    if (current.x === end.x && current.y === end.y) {
      const path: Step[] = [];
      let temp: { x: number, y: number } | null = current;
      while (temp) {
        const parent = parentMap.get(`${temp.x},${temp.y}`);
        if (parent) {
          const dx = Math.sign(temp.x - parent.x);
          const dy = Math.sign(temp.y - parent.y);
          let ix = temp.x;
          let iy = temp.y;
          while (ix !== parent.x || iy !== parent.y) {
            path.push({ x: ix, y: iy, type: 'path' });
            ix -= dx;
            iy -= dy;
          }
        } else {
          path.push({ x: temp.x, y: temp.y, type: 'path' });
        }
        temp = parent ?? null;
      }
      path.reverse();
      for (const step of path) yield step;
      return;
    }

    for (const d of getNeighborDirections(current)) {
      const jp = jump(current.x, current.y, d.dx, d.dy);
      if (jp) {
        const jKey = `${jp.x},${jp.y}`;
        if (closedSet.has(jKey)) continue;

        const dist = Math.hypot(jp.x - current.x, jp.y - current.y);
        const tentativeG = current.g + dist;

        if (tentativeG < (gScore.get(jKey) ?? Infinity)) {
          gScore.set(jKey, tentativeG);
          parentMap.set(jKey, { x: current.x, y: current.y });
          openSet.push({ x: jp.x, y: jp.y, g: tentativeG, f: tentativeG + h(jp.x, jp.y) });
          // Note: we don't yield 'visited' here because we want to show the expansion one jump point at a time
        }
      }
    }
  }
}
