// ─────────────────────────────────────────────
// TerritoryBar — Animated territory progress bar
// ─────────────────────────────────────────────

import { memo } from 'react';
import { AGENT_COLORS, AGENT_NAMES, ATTACKER_COLORS } from '../constants';
import type { AgentType } from '../types';

interface TerritoryBarProps {
  agentId: number;
  type: AgentType;
  pct: number;
  cells: number;
  totalCells: number;
}

export const TerritoryBar = memo(({ agentId, type, pct, cells }: TerritoryBarProps) => {
  const name  = `Team ${agentId}`;
  const algoName = AGENT_NAMES[type];
  const color = ATTACKER_COLORS[agentId - 1] || AGENT_COLORS[type];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-carbon">
              {name}
            </span>
          </div>
          <span className="text-[9px] font-mono text-carbon/40 ml-4 lowercase">
            {algoName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-carbon/50">{cells} cells</span>
          <span
            className="text-[12px] font-black font-mono w-9 text-right"
            style={{ color }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress bar track */}
      <div className="w-full h-[3px] bg-sepia">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
});

TerritoryBar.displayName = 'TerritoryBar';
