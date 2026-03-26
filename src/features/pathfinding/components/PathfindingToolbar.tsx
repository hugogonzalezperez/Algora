import { memo } from 'react';
import type { AlgorithmMetadata } from '../types';
import { SpeedControl } from '../../../components/common/SpeedControl';
import { UnderlineButton } from '../../../components/common/UnderlineButton';
import { CustomSelect } from '../../../components/common/CustomSelect';

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
  { label: 'X0.5', value: 100 },
  { label: 'X1', value: 50 },
  { label: 'MAX', value: 1 },
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
    <div className="flex items-center h-20 px-12 bg-crema gap-8 border-carbon border-b-2">

      {/* Maze Selection */}
      <div className="flex items-center gap-2">
        <CustomSelect
          disabled={isRunning}
          value={selectedMazeAlgo}
          onChange={onMazeAlgoChange}
          options={Object.values(mazeAlgorithms).map((algo) => ({ value: algo.id, label: algo.name }))}
          className="h-12 bg-[#f2f2f2] border border-carbon text-carbon text-sm font-mono font-bold tracking-tight uppercase transition-all min-w-[200px]"
        />
        <button
          disabled={isRunning}
          onClick={onGenerate}
          className="btn-primary min-w-[100px] h-12 px-8 uppercase font-black text-[13px] tracking-[0.2em] hover:ring-2 hover:ring-carbon transition-all whitespace-nowrap"
        >
          Generate
        </button>
      </div>

      {/* Algorithm Selection */}
      <div className="flex-grow flex items-center justify-center gap-2">
        <CustomSelect
          disabled={isRunning}
          value={selectedPathAlgo}
          onChange={onPathAlgoChange}
          options={Object.values(pathAlgorithms).map((algo) => ({ value: algo.id, label: algo.name, disabled: !algo.isImplemented }))}
          className="h-12 bg-[#f2f2f2] border border-carbon text-carbon text-sm font-mono font-bold tracking-tight uppercase transition-all min-w-[200px]"
        />
        <button
          disabled={isRunning || !pathAlgorithms[selectedPathAlgo]?.isImplemented}
          onClick={onRun}
          className="btn-primary min-w-[120px] h-12 px-10 uppercase font-black text-[13px] tracking-[0.2em] hover:ring-2 hover:ring-carbon transition-all whitespace-nowrap"
        >
          Solve
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center scale-95 origin-right">
          <SpeedControl speed={speed} onSpeedChange={onSpeedChange} options={PATHFINDING_SPEED_OPTIONS} disabled={isRunning} />
        </div>

        <div className="flex items-center gap-6 pr-6">
          <UnderlineButton label="Stop" onClick={onStop} disabled={!isRunning} />
          <div className="hidden md:block w-px h-8 bg-carbon/10 my-1"></div>
          <UnderlineButton label="Clear" onClick={onReset} disabled={isRunning} />
        </div>
      </div>
    </div>
  );
});
PathfindingToolbar.displayName = 'PathfindingToolbar';
