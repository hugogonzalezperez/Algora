// ─────────────────────────────────────────────
// TerritoryToolbar — Performance-focused top toolbar
//
// Features: Grid size slider, Speed controls, Play/Pause, Reset
// Matches the visual language of Sorting and Pathfinding.
// ─────────────────────────────────────────────

import { memo } from 'react';
import { SpeedControl } from '../../../components/common/SpeedControl';
import { UnderlineButton } from '../../../components/common/UnderlineButton';
import { MIN_GRID_SIZE, MAX_GRID_SIZE, SPEED_OPTIONS } from '../constants';
import type { GamePhase } from '../types';

interface TerritoryToolbarProps {
  phase: GamePhase;
  isRunning: boolean;
  gridSize: number;
  speed: number;
  onGridSizeChange: (val: number) => void;
  onSpeedChange: (val: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  canPlay: boolean;
}

export const TerritoryToolbar = memo(({
  phase,
  isRunning,
  gridSize,
  speed,
  onGridSizeChange,
  onSpeedChange,
  onPlay,
  onPause,
  onReset,
  canPlay
}: TerritoryToolbarProps) => {
  const isFinished = phase === 'FINISHED';

  return (
    <div className="toolbar-noborder border-b border-sepia">
      {/* Section 1: Grid Configuration */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-carbon/40 mb-1">Grid Size</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold w-12">{gridSize}×{gridSize}</span>
            <input
              type="range"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              step={5}
              value={gridSize}
              disabled={isRunning || isFinished}
              onChange={(e) => onGridSizeChange(Number(e.target.value))}
              className="accent-carbon h-1 w-32 cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Main Play Controls */}
      <div className="flex items-center gap-4 flex-grow justify-center">
        <button
          onClick={isRunning ? onPause : onPlay}
          disabled={!canPlay && !isRunning}
          className="btn-primary min-w-[140px] hover:ring-2 hover:ring-carbon hover:ring-offset-2 transition-all duration-300"
        >
          {isRunning ? 'Pause' : isFinished ? 'Battle Ended' : phase === 'PAUSED' ? 'Resume' : 'Start Simulation'}
        </button>
      </div>

      {/* Section 3: Speed & Reset */}
      <div className="flex items-center gap-6">
        <SpeedControl 
          speed={speed} 
          onSpeedChange={onSpeedChange} 
          options={SPEED_OPTIONS} 
          disabled={isRunning && speed === 0} 
        />
        
        <div className="flex items-center gap-6 pr-4">
          <UnderlineButton 
            label="Stop" 
            onClick={onPause} 
            disabled={!isRunning} 
          />
          <div className="w-[1px] h-8 bg-sepia" />
          <UnderlineButton 
            label="Reset Grid" 
            onClick={onReset} 
            disabled={isRunning} 
          />
        </div>
      </div>
    </div>
  );
});

TerritoryToolbar.displayName = 'TerritoryToolbar';
