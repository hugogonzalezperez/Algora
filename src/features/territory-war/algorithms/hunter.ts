// ─────────────────────────────────────────────
// Algorithm: HUNTER
// Strategy: Move toward the enemy agent whose nearest cell is closest.
// Uses Manhattan distance as a heuristic to pick the target cell,
// then expands the frontier cell closest to that target.
// ─────────────────────────────────────────────

import type { GridBuffer, AgentInstance } from '../types';

export function hunterStep(
  grid: GridBuffer,
  rows: number,
  cols: number,
  agent: AgentInstance,
  frontier: number[],
  allAgents: AgentInstance[],
): number | null {
  const agentId = agent.id;

  // Find the nearest non-empty, non-self cell (enemy cell)
  // We sample the grid to find the closest enemy cell.
  // For large grids we limit the scan to O(rows+cols) heuristic samples.
  let targetRow = -1;
  let targetCol = -1;
  let minDist = Infinity;

  const totalCells = rows * cols;
  // Scan step: check every cell but break early once we find a very close one
  for (let i = 0; i < totalCells; i++) {
    const v = grid[i];
    if (v === 0 || v === agentId) continue;

    const r = (i / cols) | 0;
    const c = i % cols;
    const d = Math.abs(r - agent.row) + Math.abs(c - agent.col);

    if (d < minDist) {
      minDist = d;
      targetRow = r;
      targetCol = c;
      if (d <= 2) break; // close enough — stop searching
    }
  }

  if (targetRow === -1) {
    // No enemies found — fall back to greedy behavior
    for (const fi of frontier) {
      const fRow = (fi / cols) | 0;
      const fCol = fi % cols;
      const neighbors: number[] = [
        fRow > 0        ? (fRow - 1) * cols + fCol : -1,
        fRow < rows - 1 ? (fRow + 1) * cols + fCol : -1,
        fCol > 0        ? fRow * cols + (fCol - 1) : -1,
        fCol < cols - 1 ? fRow * cols + (fCol + 1) : -1,
      ];
      for (const ni of neighbors) {
        if (ni !== -1 && grid[ni] === 0) return ni;
      }
    }
    return null;
  }

  // From frontier, find the empty neighbor cell closest to (targetRow, targetCol)
  let bestIdx = -1;
  let bestDist = Infinity;

  for (const fi of frontier) {
    const fRow = (fi / cols) | 0;
    const fCol = fi % cols;

    const neighbors: number[] = [
      fRow > 0        ? (fRow - 1) * cols + fCol : -1,
      fRow < rows - 1 ? (fRow + 1) * cols + fCol : -1,
      fCol > 0        ? fRow * cols + (fCol - 1) : -1,
      fCol < cols - 1 ? fRow * cols + (fCol + 1) : -1,
    ];

    for (const ni of neighbors) {
      if (ni === -1 || grid[ni] !== 0) continue;
      const nr = (ni / cols) | 0;
      const nc = ni % cols;
      const d = Math.abs(nr - targetRow) + Math.abs(nc - targetCol);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = ni;
      }
    }
  }

  return bestIdx;
}
