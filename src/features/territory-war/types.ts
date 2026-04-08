// ─────────────────────────────────────────────
// Territory War — Core Types
// ─────────────────────────────────────────────

export type AgentType = 'GREEDY' | 'BORDER' | 'HUNTER' | 'RANDOM';

export type GamePhase = 'SETUP' | 'RUNNING' | 'PAUSED' | 'FINISHED';

/**
 * A single agent instance placed on the grid.
 * `id` is unique within the game session.
 */
export interface AgentInstance {
  id: number;       // unique id (1..N)
  type: AgentType;
  col: number;
  row: number;
}

/**
 * Per-type configuration selected in the side panel.
 * `algorithm` can be cross-assigned (e.g. GREEDY type using HUNTER logic).
 */
export interface AgentTypeConfig {
  type: AgentType;
  algorithm: AgentType; // which algorithm drives this type
  count: number;        // 0–6 instances
}

/**
 * Live stats per agent id tracked at O(1) with counters.
 */
export interface AgentStats {
  [agentId: number]: {
    type: AgentType;
    cells: number;
    pct: number;
  };
}

/**
 * The grid is a flat Int16Array for cache-friendliness.
 * Value semantics:
 *   0  → empty cell
 *   >0 → occupied by agentId
 */
export type GridBuffer = Int16Array;

export interface GridState {
  buffer: GridBuffer;
  rows: number;
  cols: number;
}
