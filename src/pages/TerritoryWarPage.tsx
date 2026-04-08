// ─────────────────────────────────────────────
// TerritoryWarPage — Main page component
//
// Layout:
//   Left (70%)  — Square TerritoryCanvas
//   Right (30%) — Dynamic Attacker Configuration
// ─────────────────────────────────────────────

import { useState, useCallback, useMemo, useEffect } from 'react';
import { TerritoryCanvas } from '../features/territory-war/components/TerritoryCanvas';
import { TerritoryPanel } from '../features/territory-war/components/TerritoryPanel';
import { TerritoryToolbar } from '../features/territory-war/components/TerritoryToolbar';
import { useTerritoryGame } from '../features/territory-war/hooks/useTerritoryGame';
import { TERRITORY_ALGORITHMS } from '../features/territory-war/algorithms';
import { AlgorithmInfo } from '../components/common/AlgorithmInfo';
import { Alert } from '../components/common/Alert';
import { DEFAULT_GRID_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE, SPEED_OPTIONS, ATTACKER_COLORS, ATTACKER_RGBA } from '../features/territory-war/constants';
import type { AgentType, AgentInstance } from '../features/territory-war/types';

export const TerritoryWarPage = () => {
  const [gridSize, setGridSize]           = useState(DEFAULT_GRID_SIZE);
  const [speed, setSpeed]                 = useState(SPEED_OPTIONS[0].value);
  const [attackerCount, setAttackerCount] = useState(4);
  const [attackerConfigs, setAttackerConfigs] = useState(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      algorithm: (['GREEDY', 'BORDER', 'HUNTER', 'RANDOM', 'GREEDY', 'BORDER'] as AgentType[])[i],
      color: ATTACKER_COLORS[i],
      rgba: ATTACKER_RGBA[i],
    }))
  );
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const {
    canvasRef,
    phase,
    generation,
    stats,
    agents,
    play,
    pause,
    reset,
    moveAgent,
    updateAgent,
    getCell,
  } = useTerritoryGame(gridSize, gridSize);

  // ── Grid size / Attacker count change ─────────────────────────────────────
  const spawnAttackers = useCallback((count: number, currentConfigs: any[], size: number) => {
    const newAgents: AgentInstance[] = [];
    const used = new Set<string>();

    for (let i = 0; i < count; i++) {
      let r, c;
      let attempts = 0;
      do {
        r = Math.floor(Math.random() * size);
        c = Math.floor(Math.random() * size);
        attempts++;
      } while (used.has(`${r},${c}`) && attempts < 100);
      used.add(`${r},${c}`);

      newAgents.push({
        id: currentConfigs[i].id,
        type: currentConfigs[i].algorithm,
        row: r,
        col: c,
        rgba: currentConfigs[i].rgba,
      } as any);
    }
    reset(newAgents);
  }, [reset]);

  const handleGridSizeChange = useCallback((size: number) => {
    const clamped = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, size));
    setGridSize(clamped);
    setDraggingId(null);
    spawnAttackers(attackerCount, attackerConfigs, clamped);
  }, [attackerCount, attackerConfigs, spawnAttackers]);

  const handleAttackerCountChange = useCallback((count: number) => {
    setAttackerCount(count);
    spawnAttackers(count, attackerConfigs, gridSize);
  }, [attackerConfigs, gridSize, spawnAttackers]);

  const handleAlgorithmChange = useCallback((id: number, algo: AgentType) => {
    setAttackerConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, algorithm: algo } : c
    ));
    updateAgent(id, algo);
  }, [updateAgent]);

  const handleMoveAgent = useCallback((id: number, row: number, col: number) => {
    moveAgent(id, row, col);
  }, [moveAgent]);

  // Initial spawn
  useEffect(() => {
    spawnAttackers(attackerCount, attackerConfigs, gridSize);
  }, []);

  const handlePlay = useCallback(() => play(speed), [play, speed]);

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s);
    if (phase === 'RUNNING') {
      pause();
      setTimeout(() => play(s), 16);
    }
  }, [speed, phase, pause, play]);

  const handleReset = useCallback(() => {
    spawnAttackers(attackerCount, attackerConfigs, gridSize);
    setDraggingId(null);
  }, [attackerCount, attackerConfigs, gridSize, spawnAttackers]);

  const handleCanvasReady = useCallback(() => {
    // No-op
  }, []);

  const canPlay = agents.length >= 2;

  // Determine winner for the alert
  const winnerInfo = useMemo(() => {
    if (phase !== 'FINISHED') return null;
    const sorted = Object.entries(stats).sort(([, a], [, b]) => b.cells - a.cells);
    if (sorted.length === 0) return null;
    const [, s] = sorted[0];
    return { id: Number(sorted[0][0]), type: s.type as AgentType, pct: s.pct };
  }, [phase, stats]);

  // ── Info section: show the first algo's info ──────────
  const activeAttacker = attackerConfigs.find(a => a.id === (draggingId || 1));
  const infoAlgo = TERRITORY_ALGORITHMS[activeAttacker?.algorithm ?? 'GREEDY'];

  return (
    <div className="page-container min-h-screen bg-crema flex flex-col font-mono">
      {/* ── Visualizer Area (Toolbar + Canvas + Panel) ── */}
      <div className="h-[calc(100vh-65px)] flex flex-col border-b border-sepia shrink-0 overflow-hidden">
        <TerritoryToolbar
          phase={phase}
          isRunning={phase === 'RUNNING'}
          gridSize={gridSize}
          speed={speed}
          attackerCount={attackerCount}
          onGridSizeChange={handleGridSizeChange}
          onAttackerCountChange={handleAttackerCountChange}
          onSpeedChange={handleSpeedChange}
          onPlay={handlePlay}
          onPause={pause}
          onReset={handleReset}
          canPlay={canPlay}
        />

        <div className="flex-1 flex overflow-hidden relative">
          {/* Victory Alert Overlay */}
          {winnerInfo && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-crema/40 backdrop-blur-sm p-8">
              <div className="max-w-md w-full animate-in fade-in zoom-in duration-300">
                <Alert
                  variant="success"
                  title="BATTLE CONCLUDED"
                  description={`Team ${winnerInfo.id} has conquered ${winnerInfo.pct}% of the territory!`}
                  onClose={handleReset}
                />
              </div>
            </div>
          )}

          {/* Left: Canvas Area (70%) */}
          <div className="flex-[0.7] h-full flex items-center justify-center bg-crema p-4 min-w-0 border-r border-sepia">
            <div className="aspect-square w-full max-w-[min(100%,calc(100vh-200px))]">
              <TerritoryCanvas
                canvasRef={canvasRef}
                rows={gridSize}
                cols={gridSize}
                phase={phase}
                agents={agents}
                draggingId={draggingId}
                onCanvasReady={handleCanvasReady}
                getCell={getCell}
                onMoveAgent={handleMoveAgent}
                onSetDraggingId={setDraggingId}
              />
            </div>
          </div>

          {/* Right: Panel (30%) */}
          <div className="flex-[0.3] shrink-0 h-full scrollbar-hide overflow-y-auto">
            <TerritoryPanel
              phase={phase}
              generation={generation}
              stats={stats}
              attackerConfigs={attackerConfigs.slice(0, attackerCount)}
              draggingId={draggingId}
              onAlgorithmChange={handleAlgorithmChange}
              onSetDraggingId={setDraggingId}
            />
          </div>
        </div>
      </div>

      {/* ── Info section (Below fold) ── */}
      <div className="bg-crema p-16 md:p-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40">
          <AlgorithmInfo
            title={infoAlgo.name}
            description={infoAlgo.description}
            characteristics={infoAlgo.characteristics}
            applications={infoAlgo.applications}
            pseudocode={infoAlgo.pseudocode}
          />

          {activeAttacker?.algorithm !== 'HUNTER' && (
            <AlgorithmInfo
              title={TERRITORY_ALGORITHMS.HUNTER.name}
              description={TERRITORY_ALGORITHMS.HUNTER.description}
              characteristics={TERRITORY_ALGORITHMS.HUNTER.characteristics}
              applications={TERRITORY_ALGORITHMS.HUNTER.applications}
              pseudocode={TERRITORY_ALGORITHMS.HUNTER.pseudocode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

TerritoryWarPage.displayName = 'TerritoryWarPage';
