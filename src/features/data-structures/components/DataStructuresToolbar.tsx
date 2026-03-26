import { useState } from 'react';
import { DATA_STRUCTURES } from '../types';
import type { DataStructureType } from '../types';
import { UnderlineButton } from '../../../components/common/UnderlineButton';
import { CustomSelect } from '../../../components/common/CustomSelect';

interface DataStructuresToolbarProps {
  selectedStructure: DataStructureType;
  onStructureChange: (type: DataStructureType) => void;
  onPush: (val: string) => void;
  onPop: () => void;
  onPeek: () => void;
  onClear: () => void;
  maxSize: number;
  onMaxSizeChange: (size: number) => void;
}

export const DataStructuresToolbar = ({
  selectedStructure,
  onStructureChange,
  onPush,
  onPop,
  onPeek,
  onClear,
  maxSize,
  onMaxSizeChange
}: DataStructuresToolbarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handlePush = () => {
    if (inputValue.trim()) {
      onPush(inputValue.trim());
      setInputValue('');
    } else {
      const randomVal = Math.floor(Math.random() * 100000).toString();
      onPush(randomVal);
    }
  };

  return (
    <div className="toolbar-noborder items-center">
      {/* Left: Structure Selector */}
      <div className="flex items-center gap-4">
        <CustomSelect
          value={selectedStructure}
          onChange={(val) => onStructureChange(val as DataStructureType)}
          options={Object.values(DATA_STRUCTURES).map((ds) => ({ value: ds.id, label: ds.name }))}
          className="h-12 bg-[#f2f2f2] border-2 border-carbon text-carbon text-sm font-mono font-bold tracking-tight uppercase transition-all min-w-[200px]"
        />
      </div>

      {/* Center/Right: Controls */}
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-carbon/40">Capacity</span>
          <input
            type="number"
            min="1"
            max="12"
            value={maxSize}
            onChange={(e) => onMaxSizeChange(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 h-10 px-2 bg-crema border border-sepia text-sm font-mono focus:outline-none focus:border-carbon/20"
          />
        </div>

        <div className="w-[1px] h-8 bg-carbon/10 mx-2 hidden lg:block" />

        <div className="flex items-center gap-4 pr-4">
          <input
            type="text"
            placeholder="Value/Random"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-32 h-10 px-3 bg-crema border border-sepia text-sm font-mono focus:outline-none focus:border-carbon/20`}
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          />
          <button 
            onClick={handlePush}
            className="btn-primary"
          >
            {selectedStructure === 'QUEUE' ? 'Enqueue' : 'Push'}
          </button>
          <button 
            onClick={onPop}
            className="btn-primary"
          >
            {selectedStructure === 'QUEUE' ? 'Dequeue' : 'Pop'}
          </button>
          <button 
            onClick={onPeek}
            className="btn-primary"
          >
            Peek
          </button>
          <div className="w-[1px] h-8 bg-carbon/10 mx-2 hidden lg:block" />
          <UnderlineButton label="Clear" onClick={onClear} />
        </div>
      </div>
    </div>
  );
};
DataStructuresToolbar.displayName = 'DataStructuresToolbar';
