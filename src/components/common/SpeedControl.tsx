import { memo } from 'react';

interface SpeedOption {
  label: string;
  value: number;
}

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  options: SpeedOption[];
  disabled?: boolean;
}

export const SpeedControl = memo(({ speed, onSpeedChange, options, disabled }: SpeedControlProps) => (
  <div className="flex items-center gap-2 border border-sepia rounded bg-crema px-2 py-1">
    <span className="text-xs font-bold text-carbon/60 uppercase ring-2 ring-carbon/40 ring-offset-4">Speed</span>
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onSpeedChange(opt.value)}
        disabled={disabled}
        className={`${speed === opt.value ? 'btn-speed-active' : 'btn-speed-inactive'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
));
