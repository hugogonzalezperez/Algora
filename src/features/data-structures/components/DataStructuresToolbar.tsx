import { useState } from 'react';
import { DATA_STRUCTURES } from '../types';
import type { DataStructureType } from '../types';
import { UnderlineButton } from '../../../components/common/UnderlineButton';
import { CustomSelect } from '../../../components/common/CustomSelect';

interface DataStructuresToolbarProps {
  selectedStructure: DataStructureType;
  onStructureChange: (type: DataStructureType) => void;
  onAction: (actionType: string, value?: string, key?: string) => void;
  onClear: () => void;
  maxSize: number;
  onMaxSizeChange: (size: number) => void;
}

export const DataStructuresToolbar = ({
  selectedStructure,
  onStructureChange,
  onAction,
  onClear,
  maxSize,
  onMaxSizeChange
}: DataStructuresToolbarProps) => {
  const [inputValue, setInputValue] = useState('');
  const [keyValue, setKeyValue] = useState('');

  const handleAction = (actionType: string, requiresInput: boolean = false, requiresKey: boolean = false) => {
    let finalVal = inputValue.trim();
    let finalKey = keyValue.trim();
    
    if (requiresInput && !finalVal && actionType !== 'DELETE' && actionType !== 'SEARCH') {
        finalVal = Math.floor(Math.random() * 100).toString();
    }
    
    if (requiresKey && !finalKey && actionType !== 'DELETE' && actionType !== 'SEARCH') {
        finalKey = `k${Math.floor(Math.random() * 100)}`;
    }

    onAction(actionType, finalVal, finalKey);
    setInputValue('');
    if (actionType !== 'SEARCH') setKeyValue('');
  };

  const renderButtons = () => {
    switch(selectedStructure) {
      case 'STACK':
        return (
          <>
            <button onClick={() => handleAction('PUSH', true)} className="btn-primary">Push</button>
            <button onClick={() => handleAction('POP')} className="btn-primary">Pop</button>
            <button onClick={() => handleAction('PEEK')} className="btn-primary">Peek</button>
          </>
        );
      case 'QUEUE':
        return (
          <>
            <button onClick={() => handleAction('PUSH', true)} className="btn-primary">Enqueue</button>
            <button onClick={() => handleAction('POP')} className="btn-primary">Dequeue</button>
            <button onClick={() => handleAction('PEEK')} className="btn-primary">Peek</button>
          </>
        );
      case 'LINKED_LIST':
        return (
          <>
            <button onClick={() => handleAction('APPEND', true)} className="btn-primary">Append</button>
            <button onClick={() => handleAction('PREPEND', true)} className="btn-primary">Prepend</button>
            <button onClick={() => handleAction('SEARCH', true)} className="btn-primary !bg-transparent !text-carbon hover:!bg-carbon/5">Search</button>
            <button onClick={() => handleAction('DELETE', true)} className="btn-primary bg-carbon text-crema hover:bg-carbon/80">Delete</button>
          </>
        );
      case 'HASH_TABLE':
        return (
          <>
            <button onClick={() => handleAction('INSERT', true, true)} className="btn-primary">Insert</button>
            <button onClick={() => handleAction('SEARCH', false, true)} className="btn-primary !bg-transparent !text-carbon hover:!bg-carbon/5">Search</button>
            <button onClick={() => handleAction('DELETE', false, true)} className="btn-primary bg-carbon text-crema hover:bg-carbon/80">Delete</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="toolbar-noborder items-center">
      {/* Left: Structure Selector */}
      <div className="flex items-center gap-4">
        <CustomSelect
          value={selectedStructure}
          onChange={(val) => {
            onStructureChange(val as DataStructureType);
            setInputValue('');
            setKeyValue('');
          }}
          options={Object.values(DATA_STRUCTURES).filter(ds => ds.id !== 'TREE').map((ds) => ({ value: ds.id, label: ds.name }))}
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
          
          {selectedStructure === 'HASH_TABLE' && (
            <input
              type="text"
              placeholder="Key"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="w-24 h-10 px-3 bg-crema border border-sepia text-sm font-mono focus:outline-none focus:border-carbon/20"
              onKeyDown={(e) => e.key === 'Enter' && handleAction('INSERT', true, true)}
            />
          )}

          <input
            type="text"
            placeholder={selectedStructure === 'HASH_TABLE' ? "Value" : "Value/Rand"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-28 h-10 px-3 bg-crema border border-sepia text-sm font-mono focus:outline-none focus:border-carbon/20"
            onKeyDown={(e) => e.key === 'Enter' && handleAction(selectedStructure === 'HASH_TABLE' ? 'INSERT' : (selectedStructure === 'LINKED_LIST' ? 'APPEND' : 'PUSH'), true, selectedStructure === 'HASH_TABLE')}
          />
          
          {renderButtons()}
          
          <div className="w-[1px] h-8 bg-carbon/10 mx-2 hidden lg:block" />
          <UnderlineButton label="Clear" onClick={onClear} />
        </div>
      </div>
    </div>
  );
};
DataStructuresToolbar.displayName = 'DataStructuresToolbar';
