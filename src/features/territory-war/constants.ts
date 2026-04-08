// ─────────────────────────────────────────────
// Territory War — Constants
// ─────────────────────────────────────────────

import type { AgentType } from './types';

/** Hex colors per agent type — matches the original game palette */
export const AGENT_COLORS: Record<AgentType, string> = {
  GREEDY: '#E8735A',   // coral
  BORDER: '#1B1C1A',   // carbon / black
  HUNTER: '#2D6A4F',   // dark green
  RANDOM: '#E9C46A',   // amber / yellow
};

/** RGBA pixel values for direct ImageData writes [R, G, B, A] */
export const AGENT_RGBA: Record<AgentType, [number, number, number, number]> = {
  GREEDY: [232, 115,  90, 255],
  BORDER: [ 27,  28,  26, 255],
  HUNTER: [ 45, 106,  79, 255],
  RANDOM: [233, 196, 106, 255],
};

/** Empty cell RGBA */
export const EMPTY_RGBA: [number, number, number, number] = [241, 239, 234, 255]; // sepia

/** Grid line RGBA — subtle overlay drawn between cells */
export const GRID_LINE_RGBA: [number, number, number, number] = [220, 218, 213, 255];

export const AGENT_NAMES: Record<AgentType, string> = {
  GREEDY: 'Greedy',
  BORDER: 'Border',
  HUNTER: 'Hunter',
  RANDOM: 'Random',
};

export const AGENT_DESCRIPTIONS: Record<AgentType, string> = {
  GREEDY: 'Expands toward nearest empty cell via BFS',
  BORDER: 'Scores cells by number of enemy neighbors',
  HUNTER: 'BFS toward nearest enemy territory',
  RANDOM: 'Picks a random frontier cell each tick',
};

/** Maximum agents per type */
export const MAX_AGENTS_PER_TYPE = 6;

/** Grid size constraints */
export const MIN_GRID_SIZE = 30;
export const MAX_GRID_SIZE = 80;
export const DEFAULT_GRID_SIZE = 40;

/** Algorithm options for the CustomSelect dropdown */
export const ALGORITHM_OPTIONS: { value: AgentType; label: string }[] = [
  { value: 'GREEDY', label: 'Greedy — nearest empty' },
  { value: 'BORDER', label: 'Border — enemy edges' },
  { value: 'HUNTER', label: 'Hunter — chase enemies' },
  { value: 'RANDOM', label: 'Random — anywhere' },
];

/** Speed options for SpeedControl */
export const SPEED_OPTIONS = [
  { label: 'x1',   value: 80  },
  { label: 'x2',   value: 30  },
  { label: 'x5',   value: 8   },
  { label: 'Max',  value: 0   },
];
