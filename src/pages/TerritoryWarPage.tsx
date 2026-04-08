// ─────────────────────────────────────────────
// TerritoryWarPage — Main page component
//
// Layout mirrors DataStructuresPage:
//   Left  (flex-grow): TerritoryCanvas
//   Right (w-72):      TerritoryPanel
// ─────────────────────────────────────────────

import { useState, useCallback, useRef, useMemo } from 'react';
import { TerritoryCanvas } from '../features/territory-war/components/TerritoryCanvas';
import { TerritoryPanel } from '../features/territory-war/components/TerritoryPanel';
import { TerritoryToolbar } from '../features/territory-war/components/TerritoryToolbar';
import { useTerritoryGame } from '../features/territory-war/hooks/useTerritoryGame';
import { TERRITORY_ALGORITHMS } from '../features/territory-war/algorithms';
import { AlgorithmInfo } from '../components/common/AlgorithmInfo';
import { Alert } from '../components/common/Alert';
import { DEFAULT_GRID_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE, SPEED_OPTIONS, AGENT_NAMES } from '../features/territory-war/constants';
import type { AgentType, AgentTypeConfig, AgentInstance } from '../features/territory-war/types';

const AGENT_TYPES: AgentType[] = ['GREEDY', 'BORDER', 'HUNTER', 'RANDOM'];

const defaultTypeConfigs = (): AgentTypeConfig[] =>
  AGENT_TYPES.map(type => ({ type, algorithm: type, count: 0 }));

export const TerritoryWarPage = () => {
  const [gridSize, setGridSize]         = useState(DEFAULT_GRID_SIZE);
  const [speed, setSpeed]               = useState(SPEED_OPTIONS[0].value);
  const [draggingType, setDraggingType] = useState<AgentType | null>(null);
  const [typeConfigs, setTypeConfigs]   = useState<AgentTypeConfig[]>(defaultTypeConfigs());
  const nextAgentId                     = useRef(1);

  const {
    canvasRef,
    phase,
    generation,
    stats,
    agents,
    play,
    pause,
    reset,
    placeAgent,
    getCell,
  } = useTerritoryGame(gridSize, gridSize);

  // ── Grid size change ──────────────────────────────────────────────────────
  const handleGridSizeChange = useCallback((size: number) => {
    const clamped = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, size));
    setGridSize(clamped);
    setDraggingType(null);
    nextAgentId.current = 1;
    setTypeConfigs(defaultTypeConfigs());
    // useTerritoryGame resets itself via the useEffect on rows/cols change
  }, []);

  // ── Agent placement ───────────────────────────────────────────────────────
  const handlePlaceAgent = useCallback((agent: AgentInstance) => {
    // find which algorithm this type is using
    const cfg = typeConfigs.find(c => c.type === agent.type);
    const resolvedAgent: AgentInstance = {
      ...agent,
      type: cfg?.algorithm ?? agent.type,
      id: nextAgentId.current++,
    };
    placeAgent(resolvedAgent);
  }, [typeConfigs, placeAgent]);

  const handleAlgorithmChange = useCallback((type: AgentType, algo: AgentType) => {
    setTypeConfigs(prev => prev.map(c => c.type === type ? { ...c, algorithm: algo } : c));
  }, []);

  const handleSetDragging = useCallback((type: AgentType | null) => {
    setDraggingType(t => t === type ? null : type);
  }, []);

  const handlePlay = useCallback(() => play(speed), [play, speed]);

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s);
    // If already running, restart loop with new speed
    if (phase === 'RUNNING') {
      pause();
      setTimeout(() => play(s), 16);
    }
  }, [speed, phase, pause, play]);

  const handleReset = useCallback(() => {
    reset();
    setDraggingType(null);
    nextAgentId.current = 1;
    setTypeConfigs(defaultTypeConfigs());
  }, [reset]);

  const handleCanvasReady = useCallback(() => {
    // Canvas resized — no extra action needed; useTerritoryGame reinits on size change
  }, []);

  const totalAgentsPlaced = agents.length;
  const canPlay = totalAgentsPlaced >= 2;

  // Determine winner for the alert
  const winnerInfo = useMemo(() => {
    if (phase !== 'FINISHED') return null;
    const sorted = Object.entries(stats).sort(([, a], [, b]) => b.cells - a.cells);
    if (sorted.length === 0) return null;
    const [, s] = sorted[0];
    return { type: s.type as AgentType, pct: s.pct };
  }, [phase, stats]);

  // ── Info section: show the first algo's info, or a generic intro ──────────
  const infoAlgo = TERRITORY_ALGORITHMS[draggingType ?? 'GREEDY'];

  return (
    <div className="page-container min-h-screen bg-crema flex flex-col font-mono">
      {/* ── Visualizer Area (Toolbar + Canvas + Panel) ── */}
      <div className="h-[calc(100vh-65px)] flex flex-col border-b border-sepia shrink-0">
        <TerritoryToolbar
          phase={phase}
          isRunning={phase === 'RUNNING'}
          gridSize={gridSize}
          speed={speed}
          onGridSizeChange={handleGridSizeChange}
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
                  description={`${AGENT_NAMES[winnerInfo.type]} has conquered ${winnerInfo.pct}% of the territory!`}
                  onClose={handleReset}
                />
              </div>
            </div>
          )}

          {/* Left: Canvas */}
          <TerritoryCanvas
            canvasRef={canvasRef}
            rows={gridSize}
            cols={gridSize}
            phase={phase}
            agents={agents}
            draggingType={draggingType}
            draggingId={nextAgentId.current}
            onPlaceAgent={handlePlaceAgent}
            onCanvasReady={handleCanvasReady}
            getCell={getCell}
          />

          {/* Right: Panel (固定宽度) */}
          <div className="w-72 shrink-0 h-full">
            <TerritoryPanel
              phase={phase}
              generation={generation}
              stats={stats}
              agentTypeConfigs={typeConfigs}
              totalAgentsPlaced={totalAgentsPlaced}
              draggingType={draggingType}
              onAlgorithmChange={handleAlgorithmChange}
              onSetDragging={handleSetDragging}
            />
          </div>
        </div>
      </div>

      {/* ── Info section (Below fold) ── */}
      <div className="bg-crema p-16 md:p-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40">
          {/* Left info: selected / hovered algo */}
          <AlgorithmInfo
            title={infoAlgo.name}
            description={infoAlgo.description}
            characteristics={infoAlgo.characteristics}
            applications={infoAlgo.applications}
            pseudocode={infoAlgo.pseudocode}
          />

          {/* Right info: Hunter (always interesting to explain) */}
          {draggingType !== 'HUNTER' && (
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
