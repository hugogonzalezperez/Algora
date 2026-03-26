import { useState, useCallback } from 'react';
import { DataStructuresToolbar } from '../features/data-structures/components/DataStructuresToolbar';
import { StackVisualizer } from '../features/data-structures/components/StackVisualizer';
import { AlgorithmInfo } from '../components/common/AlgorithmInfo';
import { Alert } from '../components/common/Alert';
import { DATA_STRUCTURE_METADATA } from '../constants/dataStructures';
import type { DataStructureType } from '../features/data-structures/types';
import { useStack } from '../features/data-structures/hooks/useStack';

export const DataStructuresPage = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructureType>('STACK');
  const [errorAlert, setErrorAlert] = useState<{title: string, message: string} | null>(null);
  const {
      stack,
      peekedIndex,
      canPush,
      canPop,
      push,
      pop,
      peek,
      clear,
      maxSize,
      setMaxSize
  } = useStack([], 12);

  const handlePush = useCallback((value: string) => {
    if (!canPush) {
      setErrorAlert({ title: 'STACK OVERFLOW', message: 'Maximum capacity reached. Cannot push more elements.' });
      return;
    }
    setErrorAlert(null);
    push(value);
  }, [push, canPush]);

  const handlePop = useCallback(() => {
    if (!canPop) {
      setErrorAlert({ title: 'STACK UNDERFLOW', message: 'Stack is empty. Cannot pop elements.' });
      return;
    }
    setErrorAlert(null);
    pop();
  }, [pop, canPop]);

  const handlePeek = useCallback(() => {
    if (!canPop) {
      setErrorAlert({ title: 'STACK UNDERFLOW', message: 'Stack is empty. Cannot peek.' });
      return;
    }
    setErrorAlert(null);
    peek();
  }, [peek, canPop]);

  const activeMetadata = (DATA_STRUCTURE_METADATA as any)[selectedStructure] || DATA_STRUCTURE_METADATA.STACK;

  return (
    <div className="page-container flex flex-col h-[calc(100vh-65px)]">
      <DataStructuresToolbar
        selectedStructure={selectedStructure}
        onStructureChange={setSelectedStructure}
        onPush={handlePush}
        onPop={handlePop}
        onPeek={handlePeek}
        onClear={() => {
          setErrorAlert(null);
          clear();
        }}
        maxSize={maxSize}
        onMaxSizeChange={(size) => {
          setErrorAlert(null);
          setMaxSize(size);
        }}
      />
      
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden border-t border-sepia">
        {/* Left Column: Visualizer (60%) */}
        <div className="lg:w-[60%] border-r-2 border-carbon flex flex-col h-full bg-crema relative items-center justify-center">
          {errorAlert && (
              <div className="absolute translate-y-[-50%] z-50 max-w-md w-full px-1 animate-in fade-in slide-in-from-top-4 duration-300">
                  <Alert 
                      variant="error" 
                      title={errorAlert.title} 
                      description={errorAlert.message} 
                      onClose={() => setErrorAlert(null)} 
                  />
              </div>
          )}
          
          {selectedStructure === 'STACK' && (
            <StackVisualizer stack={stack} peekedIndex={peekedIndex} maxSize={maxSize} />
          )}
        </div>

        {/* Right Column: Info Panel (40%) */}
        <div className="lg:w-[40%] bg-crema flex flex-col h-full overflow-y-auto p-12">
          <AlgorithmInfo 
            title={activeMetadata.name}
            description={activeMetadata.description}
            characteristics={activeMetadata.characteristics}
            applications={activeMetadata.applications}
            commonErrors={(activeMetadata as any).commonErrors}
          />
        </div>
      </div>
    </div>
  );
};
DataStructuresPage.displayName = 'DataStructuresPage';
