import { useState, useCallback } from 'react';
import { DataStructuresToolbar } from '../features/data-structures/components/DataStructuresToolbar';
import { StackVisualizer } from '../features/data-structures/components/StackVisualizer';
import { QueueVisualizer } from '../features/data-structures/components/QueueVisualizer';
import { AlgorithmInfo } from '../components/common/AlgorithmInfo';
import { Alert } from '../components/common/Alert';
import { DATA_STRUCTURE_METADATA } from '../constants/dataStructures';
import type { DataStructureType } from '../features/data-structures/types';
import { useStack } from '../features/data-structures/hooks/useStack';
import { useQueue } from '../features/data-structures/hooks/useQueue';

export const DataStructuresPage = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructureType>('STACK');
  const [errorAlert, setErrorAlert] = useState<{title: string, message: string} | null>(null);
  const [maxSize, setMaxSize] = useState(12);

  const stackStore = useStack([], maxSize);
  const queueStore = useQueue([], maxSize);

  const isStack = selectedStructure === 'STACK';
  const activeStore = isStack ? stackStore : queueStore;

  const handlePush = useCallback((value: string) => {
    if (!activeStore.canPush) {
      setErrorAlert({ 
        title: isStack ? 'STACK OVERFLOW' : 'QUEUE OVERFLOW', 
        message: 'Maximum capacity reached. Cannot add more elements.' 
      });
      return;
    }
    setErrorAlert(null);
    if (isStack) stackStore.push(value);
    else queueStore.enqueue(value);
  }, [activeStore.canPush, isStack, stackStore, queueStore]);

  const handlePop = useCallback(() => {
    if (!activeStore.canPop) {
      setErrorAlert({ 
        title: isStack ? 'STACK UNDERFLOW' : 'QUEUE UNDERFLOW', 
        message: isStack ? 'Stack is empty. Cannot pop elements.' : 'Queue is empty. Cannot dequeue elements.' 
      });
      return;
    }
    setErrorAlert(null);
    if (isStack) stackStore.pop();
    else queueStore.dequeue();
  }, [activeStore.canPop, isStack, stackStore, queueStore]);

  const handlePeek = useCallback(() => {
    if (!activeStore.canPop) {
      setErrorAlert({ 
        title: isStack ? 'STACK UNDERFLOW' : 'QUEUE UNDERFLOW', 
        message: isStack ? 'Stack is empty. Cannot peek.' : 'Queue is empty. Cannot peek.' 
      });
      return;
    }
    setErrorAlert(null);
    activeStore.peek();
  }, [activeStore.canPop, isStack, activeStore]);

  const handleClear = useCallback(() => {
      setErrorAlert(null);
      activeStore.clear();
  }, [activeStore]);

  const handleMaxSizeChange = useCallback((size: number) => {
      setErrorAlert(null);
      setMaxSize(size);
      stackStore.setMaxSize(size);
      queueStore.setMaxSize(size);
  }, [stackStore, queueStore]);

  const activeMetadata = (DATA_STRUCTURE_METADATA as any)[selectedStructure] || DATA_STRUCTURE_METADATA.STACK;

  return (
    <div className="page-container flex flex-col h-[calc(100vh-65px)]">
      <DataStructuresToolbar
        selectedStructure={selectedStructure}
        onStructureChange={(type) => {
            setErrorAlert(null);
            setSelectedStructure(type);
        }}
        onPush={handlePush}
        onPop={handlePop}
        onPeek={handlePeek}
        onClear={handleClear}
        maxSize={maxSize}
        onMaxSizeChange={handleMaxSizeChange}
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
          
          {isStack ? (
            <StackVisualizer stack={stackStore.stack} peekedIndex={stackStore.peekedIndex} maxSize={maxSize} />
          ) : (
            <QueueVisualizer queue={queueStore.queue} peekedIndex={queueStore.peekedIndex} maxSize={maxSize} />
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
