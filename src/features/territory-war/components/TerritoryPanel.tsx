// ─────────────────────────────────────────────
// TerritoryPanel — Right-side control panel
//
// Three sections separated by dividers:
//   1. ARMY CONFIG  — per-type agent config rows
//   2. TERRITORY %  — animated stats bars
//   3. CONTROLS     — play/pause/reset + speed + GEN counter
// ─────────────────────────────────────────────

import { memo } from 'react';
import { AgentConfigRow } from './AgentConfigRow';
import { TerritoryBar } from './TerritoryBar';
import { AGENT_NAMES } from '../constants';
import type { AgentType, AgentStats, GamePhase, AgentTypeConfig } from '../types';

const AGENT_TYPES: AgentType[] = ['GREEDY', 'BORDER', 'HUNTER', 'RANDOM'];

interface TerritoryPanelProps {
  phase: GamePhase;
  generation: number;
  stats: AgentStats;
  agentTypeConfigs: AgentTypeConfig[];   // one entry per AgentType
  totalAgentsPlaced: number;
  draggingType: AgentType | null;
  onAlgorithmChange: (type: AgentType, algo: AgentType) => void;
  onSetDragging: (type: AgentType | null) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-carbon/40">{children}</span>
    <div className="flex-1 h-[1px] bg-sepia" />
  </div>
);

export const TerritoryPanel = memo(({
  phase,
  generation,
  stats,
  agentTypeConfigs,
  totalAgentsPlaced,
  draggingType,
  onAlgorithmChange,
  onSetDragging,
}: TerritoryPanelProps) => {
  const isRunning  = phase === 'RUNNING';
  const isFinished = phase === 'FINISHED';
  const totalCells = (stats && Object.values(stats).reduce((s, a) => s + a.cells, 0)) || 0;

  // Find winner if finished
  const winner = isFinished
    ? Object.entries(stats).sort(([,a],[,b]) => b.cells - a.cells)[0]
    : null;

  // Counts per type from stats
  const countPerType: Partial<Record<AgentType, number>> = {};
  for (const s of Object.values(stats)) {
    const t = s.type as AgentType;
    countPerType[t] = (countPerType[t] ?? 0) + 1;
  }

  // Aggregate stats per type for the bars — use explicit typed variables to avoid implicit any
  type TypeStatEntry = { cells: number; pct: number; agentIds: number[] };
  const typeStats: Record<AgentType, TypeStatEntry | undefined> = {
    GREEDY: undefined, BORDER: undefined, HUNTER: undefined, RANDOM: undefined,
  };
  for (const s of Object.values(stats)) {
    const t = s.type as AgentType;
    const existing = typeStats[t];
    if (!existing) {
      typeStats[t] = { cells: s.cells, pct: s.pct, agentIds: [1] };
    } else {
      existing.cells += s.cells;
      existing.pct   += s.pct;
      existing.agentIds.push(1);
    }
  }

  return (
    <div className="h-full flex flex-col border-l-2 border-carbon bg-crema overflow-y-auto scrollbar-hide">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-3 border-b border-sepia shrink-0">
        <h1 className="text-base font-black uppercase tracking-[0.15em] text-carbon leading-tight">
          Territory War
        </h1>
        <p className="text-[10px] font-mono text-carbon/40 mt-0.5">
          4 strategies fight for space
        </p>
      </div>

      {/* ── Grid Config moved to Toolbar ── */}


      {/* ── Army Config ────────────────────────────────────────────────── */}
      <div className="px-5 py-3 shrink-0">
        <SectionLabel>Army Config</SectionLabel>

        {phase === 'SETUP' && (
          <p className="text-[9px] text-carbon/40 font-mono mb-2 leading-relaxed">
            Click <strong>+ Place</strong> then click the grid to deploy agents.
            {draggingType && (
              <> Placing <strong className="text-carbon">{AGENT_NAMES[draggingType]}</strong>…</>
            )}
          </p>
        )}

        {agentTypeConfigs.map(cfg => {
          const placed = Object.values(stats).filter(s => s.type === cfg.type).length;
          return (
            <AgentConfigRow
              key={cfg.type}
              type={cfg.type}
              algorithm={cfg.algorithm}
              count={placed}
              maxRemaining={24 - totalAgentsPlaced}
              isActive={draggingType === cfg.type}
              isDisabled={isRunning || isFinished}
              onAlgorithmChange={(algo) => onAlgorithmChange(cfg.type, algo)}
              onSetDragging={onSetDragging}
            />
          );
        })}
      </div>

      {/* ── Territory Stats ────────────────────────────────────────────── */}
      {Object.keys(stats).length > 0 && (
        <div className="px-5 py-3 border-t border-sepia shrink-0">
          <SectionLabel>Territory %</SectionLabel>
          <div className="space-y-3 mt-2">
            {AGENT_TYPES.map(type => {
              const ts = typeStats[type];
              if (!ts || ts.agentIds.length === 0) return null;
              const firstId = ts.agentIds[0];
              return (
                <TerritoryBar
                  key={type}
                  agentId={firstId}
                  type={type}
                  pct={ts.pct}
                  cells={ts.cells}
                  totalCells={totalCells}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Winner banner ──────────────────────────────────────────────── */}
      {isFinished && winner && (
        <div className="mx-5 mb-3 p-3 border-2 border-carbon bg-carbon text-crema shrink-0">
          <div className="text-[9px] uppercase tracking-widest font-bold text-crema/60">Winner</div>
          <div className="text-base font-black uppercase tracking-wider">
            {AGENT_NAMES[stats[Number(winner[0])].type]}
          </div>
          <div className="text-xs font-mono text-crema/60">{winner[1].pct}% of territory</div>
        </div>
      )}

      {/* ── Controls moved to Toolbar, only keeping Gen counter ── */}
      <div className="px-5 py-4 border-t border-sepia mt-auto shrink-0 space-y-4">
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-widest text-carbon/30 font-mono">Generation</div>
          <div className="text-3xl font-black font-mono text-carbon tabular-nums">
            {generation.toString().padStart(4, '0')}
          </div>
        </div>
      </div>
    </div>
  );
});

TerritoryPanel.displayName = 'TerritoryPanel';
