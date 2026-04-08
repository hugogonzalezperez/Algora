// ─────────────────────────────────────────────
// Algorithm: GREEDY
// Strategy: BFS from each frontier cell toward the nearest empty cell.
// Each tick: pick the frontier cell with the smallest BFS distance to
// any empty neighbor, then claim that empty neighbor.
// ─────────────────────────────────────────────

import type { GridBuffer, AgentInstance } from '../types';

/**
 * Returns the cell (row, col) that this agent should claim this tick.
 * Returns null if the agent has no valid expansion target.
 */
export function greedyStep(
  grid: GridBuffer,
  rows: number,
  cols: number,
  _agent: AgentInstance,
  frontier: number[], // flat indices of cells owned by this agent that border empty cells
): number | null {
  // Collect all empty neighbors from the frontier (O(frontier × 4))
  let bestIdx = -1;

  for (const fi of frontier) {
    const fRow = (fi / cols) | 0;
    const fCol = fi % cols;

    // Check 4-connected neighbors
    const neighbors: number[] = [
      fRow > 0          ? (fRow - 1) * cols + fCol : -1,
      fRow < rows - 1   ? (fRow + 1) * cols + fCol : -1,
      fCol > 0          ? fRow * cols + (fCol - 1) : -1,
      fCol < cols - 1   ? fRow * cols + (fCol + 1) : -1,
    ];

    for (const ni of neighbors) {
      if (ni === -1) continue;
      if (grid[ni] === 0) {
        // Greedy picks the first empty neighbor found; shuffling the frontier
        // order upstream provides enough randomness to avoid artifacts.
        if (bestIdx === -1) bestIdx = ni;
        break;
      }
    }
    if (bestIdx !== -1) break;
  }

  return bestIdx === -1 ? null : bestIdx;
}
