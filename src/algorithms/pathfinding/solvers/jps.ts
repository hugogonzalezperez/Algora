import type { Step } from './index';

export const jpsMetadata = {
  id: 'jps',
  name: 'Jump Point Search (JPS)',
  description: 'Obra maestra de la optimización del A*. Se "teletransporta" a través de pasillos vacíos saltando celdas redundantes mediante análisis algebraico, buscando "Puntos de Salto" (esquinas forzadas).',
  characteristics: [
    'Garantiza el camino más corto.',
    'Evalúa una fracción ínfima de los nodos frente a A* en zonas despejadas.',
    'Avanza en cruz barriendo líneas completas de un tirón.'
  ],
  applications: [
    'Sistemas RPG sin diagonales.',
    'Motores de movimiento automático modernos.'
  ],
  isImplemented: true
};

interface JPSNode {
  x: number;
  y: number;
  g: number;
  f: number;
  px: number | null;
  py: number | null;
}

export function* jps(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const openSet: JPSNode[] = [];
  const inOpenSet = new Map<string, JPSNode>();
  const closedSet = new Set<string>();
  
  const parent = new Map<string, {x: number, y: number} | null>();
  parent.set(`${start.x},${start.y}`, null);

  const gScore = new Map<string, number>();
  gScore.set(`${start.x},${start.y}`, 0);

  const hScore = (x: number, y: number) => Math.abs(x - end.x) + Math.abs(y - end.y);

  openSet.push({ x: start.x, y: start.y, g: 0, f: hScore(start.x, start.y), px: null, py: null });
  inOpenSet.set(`${start.x},${start.y}`, openSet[0]);

  yield { ...start, type: 'visited' };

  // Iterative Jump Check to avoid Maximum Call Stack Exceeded
  function* jump(cx: number, cy: number, dx: number, dy: number): Generator<Step, {x: number, y: number} | null, unknown> {
    let currX = cx;
    let currY = cy;

    while (true) {
      const nx = currX + dx;
      const ny = currY + dy;

      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || grid[ny][nx]) return null;
      
      yield { x: nx, y: ny, type: 'visited' };

      if (nx === end.x && ny === end.y) return {x: nx, y: ny};

      if (dx !== 0) { // Horizontal
        if (ny - 1 >= 0 && !grid[ny - 1][nx] && grid[ny - 1][nx - dx]) return {x: nx, y: ny};
        if (ny + 1 < rows && !grid[ny + 1][nx] && grid[ny + 1][nx - dx]) return {x: nx, y: ny};
      } else if (dy !== 0) { // Vertical
        if (nx + 1 < cols && !grid[ny][nx + 1] && grid[ny - dy][nx + 1]) return {x: nx, y: ny};
        if (nx - 1 >= 0 && !grid[ny][nx - 1] && grid[ny - dy][nx - 1]) return {x: nx, y: ny};
        
        // Inline horizontal check spawn
        const checkHoriz = function*(hx: number): Generator<Step, {x: number, y: number} | null, unknown> {
          let cx2 = nx;
          let cy2 = ny;
          while (true) {
            let nx2 = cx2 + hx;
            let ny2 = cy2;
            if (nx2 < 0 || nx2 >= cols || ny2 < 0 || ny2 >= rows || grid[ny2][nx2]) return null;
            yield { x: nx2, y: ny2, type: 'visited' };
            if (nx2 === end.x && ny2 === end.y) return {x: nx2, y: ny2};
            if (ny2 - 1 >= 0 && !grid[ny2 - 1][nx2] && grid[ny2 - 1][nx2 - hx]) return {x: nx2, y: ny2};
            if (ny2 + 1 < rows && !grid[ny2 + 1][nx2] && grid[ny2 + 1][nx2 - hx]) return {x: nx2, y: ny2};
            cx2 = nx2;
          }
        };
        
        const j1 = yield* checkHoriz(1);
        if (j1 !== null) return {x: nx, y: ny};
        const j2 = yield* checkHoriz(-1);
        if (j2 !== null) return {x: nx, y: ny};
      }

      currX = nx;
      currY = ny;
    }
  }

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const curKey = `${current.x},${current.y}`;

    inOpenSet.delete(curKey);
    
    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);

    if (current.x === end.x && current.y === end.y) {
      // Reconstruir interpolando los saltos
      const path: Step[] = [];
      let currEl: {x: number, y: number} | null = current;
      
      while (currEl) {
        const p = parent.get(`${currEl.x},${currEl.y}`);
        if (!p) {
          path.push({ x: currEl.x, y: currEl.y, type: 'path' });
          break;
        }
        // Interpolate straight lines between leaps
        let ix = currEl.x;
        let iy = currEl.y;
        while (ix !== p.x || iy !== p.y) {
          path.push({ x: ix, y: iy, type: 'path' });
          if (ix > p.x) ix--;
          else if (ix < p.x) ix++;
          else if (iy > p.y) iy--;
          else if (iy < p.y) iy++;
        }
        currEl = p;
      }
      
      path.reverse();
      for (const step of path) {
        yield step;
      }
      return;
    }

    const currentG = gScore.get(curKey) ?? Infinity;

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];

    for (const dir of dirs) {
      const jPoint = yield* jump(current.x, current.y, dir.dx, dir.dy);
      
      if (jPoint) {
        const jKey = `${jPoint.x},${jPoint.y}`;
        if (closedSet.has(jKey)) continue;

        const dist = Math.abs(jPoint.x - current.x) + Math.abs(jPoint.y - current.y);
        const tentativeG = currentG + dist;

        if (tentativeG < (gScore.get(jKey) ?? Infinity)) {
          parent.set(jKey, { x: current.x, y: current.y });
          gScore.set(jKey, tentativeG);
          const f = tentativeG + hScore(jPoint.x, jPoint.y);

          const existing = inOpenSet.get(jKey);
          if (!existing) {
            const newNode = { x: jPoint.x, y: jPoint.y, g: tentativeG, f, px: current.x, py: current.y };
            openSet.push(newNode);
            inOpenSet.set(jKey, newNode);
          } else {
            existing.f = f;
            existing.g = tentativeG;
            existing.px = current.x;
            existing.py = current.y;
          }
        }
      }
    }
  }
}
