// ─────────────────────────────────────────────
// Algorithm: BORDER
// Strategy: Expand to the empty cell that has the MOST enemy neighbors.
// This creates a "pressure on hotspots" behavior — the agent focuses on
// contested areas and tries to cut off enemy territory.
// ─────────────────────────────────────────────

import type { GridBuffer, AgentInstance } from '../types';

export function borderStep(
  grid: GridBuffer,
  rows: number,
  cols: number,
  agent: AgentInstance,
  frontier: number[],
): number | null {
  const agentId = agent.id;
  let bestIdx = -1;
  let bestScore = -1;

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

      // Score: count enemy cells adjacent to this empty candidate cell
      const nRow = (ni / cols) | 0;
      const nCol = ni % cols;
      let score = 0;

      const cands: number[] = [
        nRow > 0        ? (nRow - 1) * cols + nCol : -1,
        nRow < rows - 1 ? (nRow + 1) * cols + nCol : -1,
        nCol > 0        ? nRow * cols + (nCol - 1) : -1,
        nCol < cols - 1 ? nRow * cols + (nCol + 1) : -1,
      ];

      for (const ci of cands) {
        if (ci !== -1 && grid[ci] !== 0 && grid[ci] !== agentId) {
          score++;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestIdx = ni;
      }
    }
  }

  return bestIdx === -1 ? null : bestIdx;
}
