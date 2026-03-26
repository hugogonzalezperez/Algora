import { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export const CustomSelect = memo(({ value, onChange, options, disabled, className = '' }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full flex items-center justify-between px-4 outline-none transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer focus:ring-1 focus:ring-carbon'}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`shrink-0 ml-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-[-1px] right-[-1px] z-50 bg-[#f2f2f2] border border-carbon shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-3 text-sm font-mono font-bold tracking-tight uppercase transition-colors ${
                option.disabled 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-carbon hover:text-crema'
              } ${option.value === value && !option.disabled ? 'bg-carbon/5' : ''}`}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';
