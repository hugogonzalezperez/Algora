// ─────────────────────────────────────────────
// AgentConfigRow — One row in the Army Config section
//
// Shows: color swatch | name | stepper (−/N/+) | algorithm select | drag handle
// Drag handle: clicking it sets the "active dragging type" so the user can
//              click on the canvas to drop agents.
// ─────────────────────────────────────────────

import { memo } from 'react';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { AGENT_COLORS, AGENT_NAMES, AGENT_DESCRIPTIONS, ALGORITHM_OPTIONS, MAX_AGENTS_PER_TYPE } from '../constants';
import type { AgentType } from '../types';

interface AgentConfigRowProps {
  type: AgentType;
  algorithm: AgentType;
  count: number;           // how many of this type currently placed on grid
  maxRemaining: number;    // slots still available (global cap enforcement)
  isActive: boolean;       // is this type the active dragging type?
  isDisabled: boolean;     // true when game is running
  onAlgorithmChange: (algo: AgentType) => void;
  onSetDragging: (type: AgentType | null) => void; // toggle active drag mode
}

export const AgentConfigRow = memo(({
  type,
  algorithm,
  count,
  maxRemaining,
  isActive,
  isDisabled,
  onAlgorithmChange,
  onSetDragging,
}: AgentConfigRowProps) => {
  const color = AGENT_COLORS[type];
  const name  = AGENT_NAMES[type];
  const desc  = AGENT_DESCRIPTIONS[type];
  const canAdd = count < MAX_AGENTS_PER_TYPE && maxRemaining > 0;

  return (
    <div
      className={`py-3 border-b border-sepia last:border-b-0 transition-all duration-150 ${isActive ? 'bg-sepia/60' : ''}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2">
        {/* Color swatch */}
        <div
          className="w-3.5 h-3.5 shrink-0 border border-carbon/20"
          style={{ backgroundColor: color }}
        />

        {/* Name */}
        <span className="text-[11px] font-black uppercase tracking-widest text-carbon flex-1">
          {name}
        </span>

        {/* Agent count badge */}
        <span className="text-[10px] font-mono text-carbon/50 bg-sepia px-1.5 py-0.5 border border-sepia">
          {count}/{MAX_AGENTS_PER_TYPE}
        </span>

        {/* Drag-to-place toggle button */}
        <button
          disabled={isDisabled || (!canAdd && !isActive)}
          onClick={() => onSetDragging(isActive ? null : type)}
          title={isActive ? 'Click to stop placing' : `Click canvas to place ${name} agents`}
          className={`
            text-[11px] font-mono px-2 py-0.5 border transition-all duration-150 uppercase tracking-wider
            ${isActive
              ? 'bg-carbon text-crema border-carbon'
              : 'bg-transparent text-carbon border-carbon/30 hover:border-carbon'
            }
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
        >
          {isActive ? 'Placing…' : '+ Place'}
        </button>
      </div>

      {/* Algorithm select */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[9px] uppercase tracking-widest text-carbon/40 w-16 shrink-0">
          Algorithm
        </span>
        <div className="flex-1 border border-carbon/20 h-7 text-[10px] font-mono font-bold tracking-tight bg-crema hover:bg-sepia transition-colors">
          <CustomSelect
            disabled={isDisabled}
            value={algorithm}
            onChange={(v) => onAlgorithmChange(v as AgentType)}
            options={ALGORITHM_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mt-1 text-[9px] text-carbon/40 font-mono leading-snug">{desc}</p>
    </div>
  );
});

AgentConfigRow.displayName = 'AgentConfigRow';
