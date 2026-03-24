import type { Step } from './index';

export const astarMetadata = {
  id: 'astar',
  name: 'A* Algorithm',
  description: 'A* usa heurísticas (Distancia Manhattan) para garantizar encontrar el camino más corto de una de las maneras más eficientes posibles, yendo "directamente" hacia el objetivo.',
  characteristics: [
    'Garantiza el camino más corto.',
    'Usa heurísticas calculadas.',
    'El balance perfecto entre Rapidez y Precisión.'
  ],
  applications: [
    'Juegos y motores de Inteligencia Artificial.',
    'Rutas de mapas GPS en el mundo real (Google Maps).'
  ],
  isImplemented: true
};

export function* astar(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {

  const h = (x: number, y: number) => Math.abs(x - end.x) + Math.abs(y - end.y);

  // gScore[y][x] = coste real desde el inicio (Infinity si no visitado)
  const gScore: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  gScore[start.y][start.x] = 0;

  // Mapa de padres para reconstruir el camino
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const closedSet = new Set<string>();

  // Open set ordenado como min-heap implícito con array + sort.
  // Guardamos [f, g, x, y] para desempate determinista: menor f, luego menor h.
  type OpenNode = { f: number; g: number; x: number; y: number };
  const openSet: OpenNode[] = [{ f: h(start.x, start.y), g: 0, x: start.x, y: start.y }];

  yield { ...start, type: 'visited' };

  while (openSet.length > 0) {
    // Extraer nodo con menor f; en empate elegimos el que tenga menor h (más cerca del objetivo)
    openSet.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return h(a.x, a.y) - h(b.x, b.y);
    });
    const current = openSet.shift()!;
    const { x: cx, y: cy } = current;
    const curKey = `${cx},${cy}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);

    if (!(cx === start.x && cy === start.y)) {
      yield { x: cx, y: cy, type: 'visited' };
    }

    if (cx === end.x && cy === end.y) {
      // Reconstrucción del camino con ?? para evitar cortar prematuramente
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

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy:  0 },
      { dx: 0, dy:  1 },
      { dx: -1, dy: 0 },
    ];

    for (const { dx, dy } of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      if (grid[ny][nx]) continue; // es muro

      const nKey = `${nx},${ny}`;
      if (closedSet.has(nKey)) continue;

      const tentativeG = currentG + 1;

      if (tentativeG < gScore[ny][nx]) {
        gScore[ny][nx] = tentativeG;
        parent.set(nKey, { x: cx, y: cy });
        const f = tentativeG + h(nx, ny);
        openSet.push({ f, g: tentativeG, x: nx, y: ny });
      }
    }
  }
  // Sin camino encontrado
}