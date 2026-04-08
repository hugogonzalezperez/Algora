// ─────────────────────────────────────────────
// Algorithm: RANDOM
// Strategy: Pick a random frontier cell and claim one of its
// empty neighbors at random. Simple but chaotic.
// ─────────────────────────────────────────────

import type { GridBuffer, AgentInstance } from '../types';

export function randomStep(
  grid: GridBuffer,
  rows: number,
  cols: number,
  _agent: AgentInstance,
  frontier: number[],
): number | null {
  if (frontier.length === 0) return null;

  // Shuffle-pick: try random frontier cells until we find one with an empty neighbor
  const maxAttempts = Math.min(frontier.length, 20);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const fi = frontier[(Math.random() * frontier.length) | 0];
    const fRow = (fi / cols) | 0;
    const fCol = fi % cols;

    const neighbors: number[] = [
      fRow > 0        ? (fRow - 1) * cols + fCol : -1,
      fRow < rows - 1 ? (fRow + 1) * cols + fCol : -1,
      fCol > 0        ? fRow * cols + (fCol - 1) : -1,
      fCol < cols - 1 ? fRow * cols + (fCol + 1) : -1,
    ].filter(n => n !== -1 && grid[n] === 0);

    if (neighbors.length > 0) {
      return neighbors[(Math.random() * neighbors.length) | 0];
    }
  }

  return null;
}
