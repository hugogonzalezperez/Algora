import { memo } from 'react';
import type { AlgorithmMetadata } from '../types/pathfinding';
import { SpeedControl } from './ui/SpeedControl';
import { UnderlineButton } from './ui/UnderlineButton';

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

const PATHFINDING_SPEED_OPTIONS = [
  { label: 'x0.5', value: 50 },
  { label: 'x1',   value: 10 },
  { label: 'Max',  value: 1  },
];

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
        <button disabled={isRunning} onClick={onGenerate} className="btn-primary min-w-[100px] hover:ring-2 hover:ring-carbon hover:ring-offset-2 transition-all duration-300">
          Generate
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
              {algo.name} {!algo.isImplemented ? '- Coming soon' : ''}
            </option>
          ))}
        </select>
        <button
          disabled={isRunning || !pathAlgorithms[selectedPathAlgo]?.isImplemented}
          onClick={onRun}
          className="btn-primary min-w-[100px] hover:ring-2 hover:ring-carbon hover:ring-offset-2 transition-all duration-300"
        >
          Solve
        </button>
      </div>

      {/* Section 3: Controls */}
      <div className="flex items-center flex gap-6 pr-6">
        <SpeedControl speed={speed} onSpeedChange={onSpeedChange} options={PATHFINDING_SPEED_OPTIONS} />

        <UnderlineButton label="Stop" onClick={onStop} disabled={!isRunning} />
        <div className="hidden md:block w-[2px] h-10 bg-carbon/20 my-1"></div>
        <UnderlineButton label="Clear" onClick={onReset} disabled={isRunning} />
      </div>

    </div>
  );
});
