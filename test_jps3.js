// Standalone JPS open space test
function* jps(grid, start, end, rows, cols) {
  const isWalkable = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];
  const h = (x, y) => {
    const dx = Math.abs(x - end.x);
    const dy = Math.abs(y - end.y);
    return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
  };
  const gScore = new Map();
  const parentMap = new Map();
  const openSet = [];
  const closedSet = new Set();
  gScore.set(`${start.x},${start.y}`, 0);
  parentMap.set(`${start.x},${start.y}`, null);
  openSet.push({ x: start.x, y: start.y, f: h(start.x, start.y), g: 0 });
  yield { ...start, type: 'visited' };
  const canMoveDiag = (cx, cy, dx, dy) => isWalkable(cx + dx, cy) && isWalkable(cx, cy + dy);

  function jump(cx, cy, dx, dy) {
    const nx = cx + dx;
    const ny = cy + dy;
    if (!isWalkable(nx, ny)) return null;
    if (dx !== 0 && dy !== 0 && !canMoveDiag(cx, cy, dx, dy)) return null;
    if (nx === end.x && ny === end.y) return { x: nx, y: ny };
    if (dx !== 0 && dy !== 0) {
      if (jump(nx, ny, dx, 0) !== null || jump(nx, ny, 0, dy) !== null) return { x: nx, y: ny };
    } else if (dx !== 0) {
      if ((!isWalkable(cx, ny + 1) && isWalkable(nx, ny + 1)) ||
          (!isWalkable(cx, ny - 1) && isWalkable(nx, ny - 1))) return { x: nx, y: ny };
    } else {
      if ((!isWalkable(nx + 1, cy) && isWalkable(nx + 1, ny)) ||
          (!isWalkable(nx - 1, cy) && isWalkable(nx - 1, ny))) return { x: nx, y: ny };
    }
    return jump(nx, ny, dx, dy);
  }

  function getNeighbors(node) {
    const dirs = [];
    const par = parentMap.get(`${node.x},${node.y}`);
    const x = node.x, y = node.y;
    if (!par) {
      for (let ddx = -1; ddx <= 1; ddx++) {
        for (let ddy = -1; ddy <= 1; ddy++) {
          if (ddx === 0 && ddy === 0) continue;
          if (!isWalkable(x + ddx, y + ddy)) continue;
          if (ddx !== 0 && ddy !== 0 && !canMoveDiag(x, y, ddx, ddy)) continue;
          dirs.push({ dx: ddx, dy: ddy });
        }
      }
      return dirs;
    }
    const dx = Math.sign(x - par.x);
    const dy = Math.sign(y - par.y);
    if (dx !== 0 && dy !== 0) {
      const canH = isWalkable(x + dx, y);
      const canV = isWalkable(x, y + dy);
      if (canH) dirs.push({ dx, dy: 0 });
      if (canV) dirs.push({ dx: 0, dy });
      if (canH && canV && isWalkable(x + dx, y + dy)) dirs.push({ dx, dy });
    } else if (dx !== 0) {
      if (isWalkable(x + dx, y)) dirs.push({ dx, dy: 0 });
      if (!isWalkable(x - dx, y + 1) && isWalkable(x, y + 1)) {
        dirs.push({ dx: 0, dy: 1 });
        if (isWalkable(x + dx, y)) dirs.push({ dx, dy: 1 });
      }
      if (!isWalkable(x - dx, y - 1) && isWalkable(x, y - 1)) {
        dirs.push({ dx: 0, dy: -1 });
        if (isWalkable(x + dx, y)) dirs.push({ dx, dy: -1 });
      }
    } else {
      if (isWalkable(x, y + dy)) dirs.push({ dx: 0, dy });
      if (!isWalkable(x + 1, y - dy) && isWalkable(x + 1, y)) {
        dirs.push({ dx: 1, dy: 0 });
        if (isWalkable(x, y + dy)) dirs.push({ dx: 1, dy });
      }
      if (!isWalkable(x - 1, y - dy) && isWalkable(x - 1, y)) {
        dirs.push({ dx: -1, dy: 0 });
        if (isWalkable(x, y + dy)) dirs.push({ dx: -1, dy });
      }
    }
    return dirs;
  }

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f !== b.f ? a.f - b.f : h(a.x, a.y) - h(b.x, b.y));
    const current = openSet.shift();
    const curKey = `${current.x},${current.y}`;
    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);
    yield { x: current.x, y: current.y, type: 'visited' };

    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let temp = current;
      while (temp) {
        const p = parentMap.get(`${temp.x},${temp.y}`);
        if (p) {
          const pdx = Math.sign(temp.x - p.x);
          const pdy = Math.sign(temp.y - p.y);
          let ix = temp.x, iy = temp.y;
          while (ix !== p.x || iy !== p.y) {
            path.push({ x: ix, y: iy, type: 'path' });
            ix -= pdx; iy -= pdy;
          }
        } else {
          path.push({ x: temp.x, y: temp.y, type: 'path' });
        }
        temp = p ?? null;
      }
      path.reverse();
      for (const step of path) yield step;
      return;
    }

    for (const dir of getNeighbors(current)) {
      const jp = jump(current.x, current.y, dir.dx, dir.dy);
      if (!jp) continue;
      const jKey = `${jp.x},${jp.y}`;
      if (closedSet.has(jKey)) continue;
      const d = Math.hypot(jp.x - current.x, jp.y - current.y);
      const newG = current.g + d;
      if (newG < (gScore.get(jKey) ?? Infinity)) {
        gScore.set(jKey, newG);
        parentMap.set(jKey, { x: current.x, y: current.y });
        openSet.push({ x: jp.x, y: jp.y, g: newG, f: newG + h(jp.x, jp.y) });
        yield { x: jp.x, y: jp.y, type: 'visited' };
      }
    }
  }
}

const rows = 10;
const cols = 10;
const grid = Array.from({ length: rows }, () => new Array(cols).fill(false));
const start = { x: 0, y: 0 };
const end = { x: 5, y: 5 }; // Target is exactly diagonal

const gen = jps(grid, start, end, rows, cols);
const path = [];
while (true) {
  const result = gen.next();
  if (result.done) break;
  if (result.value && result.value.type === 'path') path.push(result.value);
}

console.log("\nJPS Path (Totally Open Space):");
path.forEach(p => console.log(`(${p.x}, ${p.y})`));
