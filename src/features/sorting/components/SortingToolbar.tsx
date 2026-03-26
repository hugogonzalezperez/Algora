
import { memo } from 'react';
import type { SortingAlgorithmMetadata } from '../types';
import { SpeedControl } from '../../../components/common/SpeedControl';
import { UnderlineButton } from '../../../components/common/UnderlineButton';
import { CustomSelect } from '../../../components/common/CustomSelect';

interface SortingToolbarProps {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onGenerate: () => void;
  algorithms: Record<string, SortingAlgorithmMetadata>;
  selectedAlgo: string;
  onAlgoChange: (id: string) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
}

const SORTING_SPEED_OPTIONS = [
  { label: 'x0.5', value: 500 },
  { label: 'x1',   value: 200 },
  { label: 'Max',  value: 0   },
];

export const SortingToolbar = memo(({
  isRunning,
  isPaused,
  speed,
  onSpeedChange,
  onRun,
  onStop,
  onReset,
  onGenerate,
  algorithms,
  selectedAlgo,
  onAlgoChange,
  arraySize,
  onArraySizeChange,
}: SortingToolbarProps) => {
  return (
    <div className="toolbar-noborder">
      {/* Section 1: Array Generation */}
      <div className="flex items-center gap-2">
        <button disabled={isRunning || isPaused} onClick={onGenerate} className="btn-primary hover:ring-2 hover:ring-carbon hover:ring-offset-2 transition-all duration-300">
          Generate New Array
        </button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-[10px] font-black uppercase text-carbon/40">Size</span>
          <input
            type="number"
            min="1"
            max="50"
            value={arraySize}
            onChange={(e) => onArraySizeChange(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            disabled={isRunning || isPaused}
            className="w-16 h-10 px-2 bg-crema border border-sepia text-sm font-mono focus:outline-none focus:border-carbon/20"
          />
        </div>
      </div>

      {/* Section 2: Sorting Algorithm */}
      <div className="flex items-center gap-2 flex-grow justify-center pl-8">
        <CustomSelect
          disabled={isRunning || isPaused}
          value={selectedAlgo}
          onChange={onAlgoChange}
          options={Object.values(algorithms).map((algo) => ({ value: algo.id, label: algo.name }))}
          className="h-12 bg-[#f2f2f2] border-2 border-carbon text-carbon text-sm font-mono font-bold tracking-tight uppercase transition-all min-w-[240px]"
        />
        <button
          onClick={onRun}
          className="btn-primary min-w-[100px] hover:ring-2 hover:ring-carbon hover:ring-offset-2 transition-all duration-300"
          disabled={isRunning}
        >
          {isPaused ? 'Resume' : 'Sort'}
        </button>
      </div>

      {/* Section 3: Controls */}
      <div className="flex items-center gap-4">
        <SpeedControl speed={speed} onSpeedChange={onSpeedChange} options={SORTING_SPEED_OPTIONS} disabled={isRunning} />

        <div className="flex gap-6 pr-10">
          <UnderlineButton label="Stop" onClick={onStop} disabled={!isRunning} />
          <div className="hidden md:block w-[2px] h-10 bg-carbon/20 my-1"></div>
          <UnderlineButton label="Reset" onClick={onReset} disabled={isRunning} />
        </div>
      </div>
    </div>
  );
});
SortingToolbar.displayName = 'SortingToolbar';
