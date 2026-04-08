// ─────────────────────────────────────────────
// AttackerRow — Config row for a single attacker instance
// ─────────────────────────────────────────────

import { memo } from 'react';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { ALGORITHM_OPTIONS } from '../constants';
import type { AgentType } from '../types';

interface AttackerRowProps {
  attacker: {
    id: number;
    algorithm: AgentType;
    color: string;
  };
  isDragging: boolean;
  isDisabled: boolean;
  onAlgorithmChange: (id: number, algo: AgentType) => void;
  onSetDragging: (id: number | null) => void;
}

export const AttackerRow = memo(({
  attacker,
  isDragging,
  isDisabled,
  onAlgorithmChange,
  onSetDragging,
}: AttackerRowProps) => {
  return (
    <div className={`py-3 border-b border-sepia last:border-b-0 transition-all ${isDragging ? 'bg-sepia/60' : ''}`}>
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-sm border border-carbon/20 shrink-0" 
          style={{ backgroundColor: attacker.color }}
        />
        <span className="text-[11px] font-black uppercase tracking-widest text-carbon flex-1">
          Attacker {attacker.id}
        </span>
        <button
          disabled={isDisabled}
          onClick={() => onSetDragging(isDragging ? null : attacker.id)}
          className={`
            text-[9px] font-black px-2 py-1 border transition-all uppercase tracking-widest
            ${isDragging 
              ? 'bg-carbon text-crema border-carbon' 
              : 'bg-transparent text-carbon border-carbon/20 hover:border-carbon/50'
            }
          `}
        >
          {isDragging ? 'Dragging...' : 'Move'}
        </button>
      </div>

      <div className="mt-2 pl-7 flex items-center gap-2">
        <div className="flex-1 h-7 text-[10px] font-mono font-bold bg-crema border border-carbon/10">
          <CustomSelect
            disabled={isDisabled}
            value={attacker.algorithm}
            onChange={(v) => onAlgorithmChange(attacker.id, v as AgentType)}
            options={ALGORITHM_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
});

AttackerRow.displayName = 'AttackerRow';
