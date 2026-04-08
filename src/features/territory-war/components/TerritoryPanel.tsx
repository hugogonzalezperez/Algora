import { memo } from 'react';
import { AttackerRow } from './AttackerRow';
import { TerritoryBar } from './TerritoryBar';
import type { AgentType, AgentStats, GamePhase } from '../types';

interface TerritoryPanelProps {
  phase: GamePhase;
  generation: number;
  stats: AgentStats;
  attackerConfigs: any[];
  draggingId: number | null;
  onAlgorithmChange: (id: number, algo: AgentType) => void;
  onSetDraggingId: (id: number | null) => void;
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
  attackerConfigs,
  draggingId,
  onAlgorithmChange,
  onSetDraggingId,
}: TerritoryPanelProps) => {
  const isRunning  = phase === 'RUNNING';
  const isFinished = phase === 'FINISHED';
  const totalCells = (stats && Object.values(stats).reduce((s, a) => s + a.cells, 0)) || 0;

  return (
    <div className="h-full flex flex-col bg-crema overflow-y-auto scrollbar-hide">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-3 border-b border-sepia shrink-0">
        <h1 className="text-base font-black uppercase tracking-[0.15em] text-carbon leading-tight">
          Territory War
        </h1>
        <p className="text-[10px] font-mono text-carbon/40 mt-0.5">
          Dynamic AI Battle Simulator
        </p>
      </div>

      {/* ── Army Config ────────────────────────────────────────────────── */}
      <div className="px-5 py-3 shrink-0">
        <SectionLabel>Army Config</SectionLabel>

        {phase === 'SETUP' && (
          <p className="text-[9px] text-carbon/40 font-mono mb-2 leading-relaxed">
            Drag attackers on the grid or use the <strong>Move</strong> buttons below.
          </p>
        )}

        <div className="space-y-1">
          {attackerConfigs.map(attacker => (
            <AttackerRow
              key={attacker.id}
              attacker={attacker}
              isDragging={draggingId === attacker.id}
              isDisabled={isRunning || isFinished}
              onAlgorithmChange={onAlgorithmChange}
              onSetDragging={onSetDraggingId}
            />
          ))}
        </div>
      </div>

      {/* ── Territory Stats ────────────────────────────────────────────── */}
      {Object.keys(stats).length > 0 && (
        <div className="px-5 py-3 border-t border-sepia shrink-0">
          <SectionLabel>Territory %</SectionLabel>
          <div className="space-y-3 mt-2">
            {Object.entries(stats).map(([id, s]) => (
              <TerritoryBar
                key={id}
                agentId={Number(id)}
                type={s.type as AgentType}
                pct={s.pct}
                cells={s.cells}
                totalCells={totalCells}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Generation counter ── */}
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

TerritoryPanel.displayName = 'TerritoryPanel';
