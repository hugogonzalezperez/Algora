import { jps } from './src/algorithms/pathfinding/solvers/jps';

const rows = 10;
const cols = 10;

// S . . . . . . . . .
// . . . . . . . . . .
// . W W . . . . . . .
// . W W . . . . . . .
// . W W . . . . . . .
// . . . . . . . . . .
// . G . . . . . . . .

const grid = Array.from({ length: rows }, () => new Array(cols).fill(false));
grid[2][1] = true; grid[2][2] = true;
grid[3][1] = true; grid[3][2] = true;
grid[4][1] = true; grid[4][2] = true;

const start = { x: 0, y: 0 };
const end = { x: 1, y: 6 };

const gen = jps(grid, start, end, rows, cols);
let step;
const path = [];
const visited = [];

while (true) {
  const result = gen.next();
  if (result.done) break;
  if (result.value.type === 'path') {
    path.push(result.value);
  } else {
    visited.push(result.value);
  }
}

console.log("JPS Visited Nodes (Jump Points Evaluated):");
visited.forEach(v => console.log(`(${v.x}, ${v.y})`));

console.log("\nJPS Path:");
path.forEach(p => console.log(`(${p.x}, ${p.y})`));

