// ─────────────────────────────────────────────
// TerritoryBar — Animated territory progress bar
// ─────────────────────────────────────────────

import { memo } from 'react';
import { AGENT_COLORS, AGENT_NAMES } from '../constants';
import type { AgentType } from '../types';

interface TerritoryBarProps {
  agentId: number;
  type: AgentType;
  pct: number;
  cells: number;
  totalCells: number;
}

export const TerritoryBar = memo(({ type, pct, cells }: TerritoryBarProps) => {
  const color = AGENT_COLORS[type];
  const name  = AGENT_NAMES[type];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-carbon">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-carbon/50">{cells}</span>
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
