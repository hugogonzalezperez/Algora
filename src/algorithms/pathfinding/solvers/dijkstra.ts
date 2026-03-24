import type { Step } from './index';

export const dijkstraMetadata = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description: 'Un algoritmo clásico y riguroso. Garantiza encontrar el camino más corto calculando meticulosamente la distancia real de todos los nodos posibles extendiéndose equitativamente en forma circular.',
  characteristics: [
    'Garantiza el camino más corto absolutamente.',
    'Poco eficiente sin heurística (más lento que A*).',
    'Explora "a bulto" en todas direcciones uniformemente.'
  ],
  applications: [
    'Enrutamiento de redes (algoritmos OSPF).',
    'Cálculo de rutas con costes variables o terrenos difíciles.'
  ],
  isImplemented: true
};

interface DijkstraNode {
  x: number;
  y: number;
  g: number;
}

export function* dijkstra(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const openSet: DijkstraNode[] = [{ x: start.x, y: start.y, g: 0 }];
  const inOpenSet = new Map<string, DijkstraNode>();
  inOpenSet.set(`${start.x},${start.y}`, openSet[0]);
  
  const closedSet = new Set<string>();
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const gScore = new Map<string, number>();
  gScore.set(`${start.x},${start.y}`, 0);

  yield { ...start, type: 'visited' };

  while (openSet.length > 0) {
    // Dijkstra solo procesa por peso real G (sin distancia hacia la meta)
    openSet.sort((a, b) => a.g - b.g);
    const current = openSet.shift()!;
    const curKey = `${current.x},${current.y}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);
    inOpenSet.delete(curKey);

    if (!(current.x === start.x && current.y === start.y)) {
      yield { x: current.x, y: current.y, type: 'visited' };
    }

    if (current.x === end.x && current.y === end.y) {
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

    const currentG = gScore.get(curKey) ?? Infinity;

    const neighbors = [
      { x: current.x, y: current.y - 1 },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x - 1, y: current.y },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 && neighbor.x < cols &&
        neighbor.y >= 0 && neighbor.y < rows &&
        !grid[neighbor.y][neighbor.x]
      ) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = currentG + 1; // Coste uniforme de moverse 1 bloque
        
        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          parent.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          
          const existing = inOpenSet.get(neighborKey);
          if (!existing) {
            const newNode = { x: neighbor.x, y: neighbor.y, g: tentativeG };
            openSet.push(newNode);
            inOpenSet.set(neighborKey, newNode);
          } else {
             existing.g = tentativeG;
          }
        }
      }
    }
  }
}
