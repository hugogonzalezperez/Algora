// ─────────────────────────────────────────────
// Territory War — Algorithm Registry
// ─────────────────────────────────────────────

import type { AgentType } from '../types';

export interface TerritoryAlgorithmMetadata {
  id: AgentType;
  name: string;
  description: string;
  characteristics: string[];
  applications: string[];
  pseudocode: string;
}

export const TERRITORY_ALGORITHMS: Record<AgentType, TerritoryAlgorithmMetadata> = {
  GREEDY: {
    id: 'GREEDY',
    name: 'Greedy',
    description:
      'The Greedy algorithm scans its frontier and claims the nearest available empty cell each tick. By always moving to the closest empty space, it maximizes short-term gain with minimal computation. It expands quickly in open areas but can be outmaneuvered by smarter strategies in contested zones.',
    characteristics: [
      'O(|frontier| × 4) per tick — very fast',
      'Grows radially from start positions',
      'No enemy awareness',
      'Consistent, predictable expansion pattern',
    ],
    applications: [
      'Nearest-neighbor heuristics',
      'Greedy graph coloring',
      'Voronoi diagram approximation',
      'Coverage path planning',
    ],
    pseudocode: `FOR EACH cell IN frontier (shuffled):
  FOR EACH neighbor OF cell:
    IF neighbor IS empty:
      CLAIM neighbor
      BREAK
  END FOR
END FOR`,
  },

  BORDER: {
    id: 'BORDER',
    name: 'Border',
    description:
      'The Border algorithm evaluates every empty expansion candidate and picks the one surrounded by the most enemy cells. This creates a natural "cutting" behavior — Border agents pressure hotspots and try to fragment enemy territory rather than simply expanding outward.',
    characteristics: [
      'Score function: count enemy neighbors of each candidate',
      'Thrives in contested multi-agent scenarios',
      'Slower in open space than Greedy',
      'Creates jagged, aggressive frontlines',
    ],
    applications: [
      'Conflict zone detection in area coverage',
      'Graph partitioning heuristics',
      'Territorial boundary analysis',
      'AI in real-time strategy games',
    ],
    pseudocode: `best = null; bestScore = -1
FOR EACH cell IN frontier:
  FOR EACH empty neighbor N OF cell:
    score = count of enemy cells adjacent to N
    IF score > bestScore:
      bestScore = score; best = N
    END IF
  END FOR
END FOR
CLAIM best`,
  },

  HUNTER: {
    id: 'HUNTER',
    name: 'Hunter',
    description:
      'The Hunter algorithm tracks the nearest enemy cell on the entire grid using Manhattan distance, then expands the frontier cell that moves it closest to that target. It actively pursues enemies instead of expanding neutrally — powerful in the mid-game when it can intercept expanding opponents.',
    characteristics: [
      'Global grid scan per tick — O(rows × cols)',
      'Manhattan distance heuristic for target selection',
      'Falls back to Greedy when no enemies present',
      'Most effective with 1-2 opponents to track',
    ],
    applications: [
      'Pursuit-evasion problems',
      'Intercept path planning',
      'Predator-prey simulations',
      'Enemy-aware AI in strategy games',
    ],
    pseudocode: `target = NEAREST enemy cell (Manhattan distance)
IF no target:
  APPLY greedy fallback
ELSE:
  best = frontier cell whose empty neighbor
         is closest to target
  CLAIM best`,
  },

  RANDOM: {
    id: 'RANDOM',
    name: 'Random',
    description:
      'The Random algorithm selects a random frontier cell and claims one of its empty neighbors at random. It has no strategic intent — its behavior is chaotic and unpredictable. Despite its simplicity, in large grids with many agents it can spread surprisingly well by avoiding the "stuck" patterns that deterministic algorithms can fall into.',
    characteristics: [
      'O(1) per tick — cheapest algorithm',
      'Unpredictable expansion pattern',
      'No convergence guarantee on isolated cells',
      'Best used in combination with other strategies',
    ],
    applications: [
      'Monte Carlo simulations',
      'Random walk models',
      'Baseline comparison for algorithm analysis',
      'Stochastic cellular automata',
    ],
    pseudocode: `REPEAT up to 20 times:
  fi = RANDOM cell from frontier
  neighbors = empty cells adjacent to fi
  IF neighbors not empty:
    CLAIM RANDOM neighbor
    BREAK
  END IF
END REPEAT`,
  },
};
