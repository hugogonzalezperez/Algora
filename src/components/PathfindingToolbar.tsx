import { memo } from 'react';
import type { AlgorithmMetadata } from '../algorithms/pathfinding/solvers';

interface PathfindingToolbarProps {
  isRunning: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onGenerate: () => void;
  pathAlgorithms: Record<string, AlgorithmMetadata>;
  selectedPathAlgo: string;
  onPathAlgoChange: (id: string) => void;
  mazeAlgorithms: Record<string, { id: string, name: string }>;
  selectedMazeAlgo: string;
  onMazeAlgoChange: (id: string) => void;
}

export const PathfindingToolbar = memo(({
  isRunning,
  speed,
  onSpeedChange,
  onRun,
  onStop,
  onReset,
  onGenerate,
  pathAlgorithms,
  selectedPathAlgo,
  onPathAlgoChange,
  mazeAlgorithms,
  selectedMazeAlgo,
  onMazeAlgoChange
}: PathfindingToolbarProps) => {
  return (
    <div className="toolbar">

      {/* Section 1: Maze Generation */}
      <div className="flex items-center gap-2">
        <select
          disabled={isRunning}
          value={selectedMazeAlgo}
          onChange={(e) => onMazeAlgoChange(e.target.value)}
          className="form-select-primary"
        >
          {Object.values(mazeAlgorithms).map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
        <button disabled={isRunning} onClick={onGenerate} className="btn-primary">
          Generar
        </button>
      </div>

      {/* Section 2: Pathfinding Algorithm */}
      <div className="flex items-center gap-2 flex-grow justify-center">
        <select
          disabled={isRunning}
          value={selectedPathAlgo}
          onChange={(e) => onPathAlgoChange(e.target.value)}
          className="form-select-primary"
        >
          {Object.values(pathAlgorithms).map((algo) => (
            <option key={algo.id} value={algo.id} disabled={!algo.isImplemented}>
              {algo.name} {!algo.isImplemented ? '- Muy pronto' : ''}
            </option>
          ))}
        </select>
        <button
          disabled={isRunning || !pathAlgorithms[selectedPathAlgo]?.isImplemented}
          onClick={onRun}
          className="btn-primary"
        >
          Resolver
        </button>
      </div>

      {/* Section 3: Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-sepia rounded bg-crema px-2 py-1">
          <span className="text-xs font-bold text-carbon/60 uppercase">Velocidad</span>
          <button onClick={() => onSpeedChange(50)} className={speed === 50 ? 'btn-speed-active' : 'btn-speed-inactive'}>x0.5</button>
          <button onClick={() => onSpeedChange(10)} className={speed === 10 ? 'btn-speed-active' : 'btn-speed-inactive'}>x1</button>
          <button onClick={() => onSpeedChange(1)} className={speed === 1 ? 'btn-speed-active' : 'btn-speed-inactive'}>Max</button>
        </div>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className="btn-danger"
        >
          Parar
        </button>
        <button
          onClick={onReset}
          disabled={isRunning}
          className="btn-outline"
        >
          Limpiar Grid
        </button>
      </div>

    </div>
  );
});
