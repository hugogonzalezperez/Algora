import { useState, useCallback } from 'react';
import { DataStructuresToolbar } from '../features/data-structures/components/DataStructuresToolbar';
import { StackVisualizer } from '../features/data-structures/components/StackVisualizer';
import { QueueVisualizer } from '../features/data-structures/components/QueueVisualizer';
import { LinkedListVisualizer } from '../features/data-structures/components/LinkedListVisualizer';
import { HashTableVisualizer } from '../features/data-structures/components/HashTableVisualizer';
import { AlgorithmInfo } from '../components/common/AlgorithmInfo';
import { Alert } from '../components/common/Alert';
import { DATA_STRUCTURE_METADATA } from '../constants/dataStructures';
import type { DataStructureType } from '../features/data-structures/types';
import { useStack } from '../features/data-structures/hooks/useStack';
import { useQueue } from '../features/data-structures/hooks/useQueue';
import { useLinkedList } from '../features/data-structures/hooks/useLinkedList';
import { useHashTable } from '../features/data-structures/hooks/useHashTable';

export const DataStructuresPage = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructureType>('STACK');
  const [errorAlert, setErrorAlert] = useState<{title: string, message: string} | null>(null);
  const [maxSize, setMaxSize] = useState(12);

  const stackStore = useStack([], maxSize);
  const queueStore = useQueue([], maxSize);
  const linkedListStore = useLinkedList([], maxSize);
  const hashTableStore = useHashTable(8); // Default 8 buckets for hash table

  const handleAction = useCallback((actionType: string, value?: string, key?: string) => {
    setErrorAlert(null);
    
    switch (selectedStructure) {
      case 'STACK':
        if (actionType === 'PUSH') {
          if (!stackStore.canPush) {
            setErrorAlert({ title: 'STACK FULL', message: 'Maximum capacity (12) reached.' });
            return;
          }
          stackStore.push(value || '');
        } else if (actionType === 'POP') {
          if (!stackStore.canPop) {
            setErrorAlert({ title: 'STACK EMPTY', message: 'No items to remove.' });
            return;
          }
          stackStore.pop();
        } else if (actionType === 'PEEK') {
          if (!stackStore.canPop) {
            setErrorAlert({ title: 'STACK EMPTY', message: 'Nothing to see here.' });
            return;
          }
          stackStore.peek();
        }
        break;
        
      case 'QUEUE':
        if (actionType === 'PUSH') {
          if (!queueStore.canPush) {
            setErrorAlert({ title: 'QUEUE FULL', message: 'Maximum capacity (12) reached.' });
            return;
          }
          queueStore.enqueue(value || '');
        } else if (actionType === 'POP') {
          if (!queueStore.canPop) {
            setErrorAlert({ title: 'QUEUE EMPTY', message: 'No items in line.' });
            return;
          }
          queueStore.dequeue();
        } else if (actionType === 'PEEK') {
          if (!queueStore.canPop) {
            setErrorAlert({ title: 'QUEUE EMPTY', message: 'Queue is currently empty.' });
            return;
          }
          queueStore.peek();
        }
        break;

      case 'LINKED_LIST':
        if (actionType === 'APPEND') {
          if (!linkedListStore.canAdd) {
            setErrorAlert({ title: 'VISUAL LIMIT', message: 'Linked List reached maximum display capacity (12).' });
            return;
          }
          linkedListStore.append(value || '');
        } else if (actionType === 'PREPEND') {
          if (!linkedListStore.canAdd) {
            setErrorAlert({ title: 'VISUAL LIMIT', message: 'Linked List reached maximum display capacity (12).' });
            return;
          }
          linkedListStore.prepend(value || '');
        } else if (actionType === 'DELETE') {
          if (!linkedListStore.canRemove) {
             setErrorAlert({ title: 'LIST EMPTY', message: 'No nodes to delete.' });
             return;
          }
          linkedListStore.removeValue(value || '');
        } else if (actionType === 'SEARCH') {
          const found = linkedListStore.search(value || '');
          if (!found && value) {
            setErrorAlert({ title: 'NOT FOUND', message: `Value "${value}" not in list.` });
          }
        }
        break;

      case 'HASH_TABLE':
        if (actionType === 'INSERT') {
          hashTableStore.insert(key || '', value || '');
        } else if (actionType === 'DELETE') {
          hashTableStore.remove(key || '');
        } else if (actionType === 'SEARCH') {
          const entry = hashTableStore.search(key || '');
          if (!entry && key) {
            setErrorAlert({ title: 'NOT FOUND', message: `Key "${key}" not in hash table.` });
          }
        }
        break;

      default:
        break;
    }
  }, [selectedStructure, stackStore, queueStore, linkedListStore, hashTableStore]);

  const handleClear = useCallback(() => {
      setErrorAlert(null);
      if (selectedStructure === 'STACK') stackStore.clear();
      else if (selectedStructure === 'QUEUE') queueStore.clear();
      else if (selectedStructure === 'LINKED_LIST') linkedListStore.clear();
      else if (selectedStructure === 'HASH_TABLE') hashTableStore.clear();
  }, [selectedStructure, stackStore, queueStore, linkedListStore, hashTableStore]);

  const handleMaxSizeChange = useCallback((size: number) => {
      setErrorAlert(null);
      setMaxSize(size);
      stackStore.setMaxSize(size);
      queueStore.setMaxSize(size);
      linkedListStore.setMaxSize(size);
      if (selectedStructure === 'HASH_TABLE') hashTableStore.setTableCapacity(size);
  }, [selectedStructure, stackStore, queueStore, linkedListStore, hashTableStore]);

  const activeMetadata = (DATA_STRUCTURE_METADATA as any)[selectedStructure] || DATA_STRUCTURE_METADATA.STACK;

  const renderVisualizer = () => {
    switch (selectedStructure) {
      case 'STACK':
        return <StackVisualizer stack={stackStore.stack} peekedIndex={stackStore.peekedIndex} maxSize={maxSize} />;
      case 'QUEUE':
        return <QueueVisualizer queue={queueStore.queue} peekedIndex={queueStore.peekedIndex} maxSize={maxSize} />;
      case 'LINKED_LIST':
        return <LinkedListVisualizer nodes={linkedListStore.nodes} highlightedIndex={linkedListStore.highlightedIndex} />;
      case 'HASH_TABLE':
        return (
          <HashTableVisualizer 
            table={hashTableStore.table} 
            highlightedBucket={hashTableStore.highlightedBucket} 
            highlightedKey={hashTableStore.highlightedKey} 
          />
        );
      default:
        return <div className="text-carbon/20 font-mono text-xs">Visualizer not yet implemented</div>;
    }
  };

  return (
    <div className="page-container flex flex-col h-full overflow-hidden">
      <DataStructuresToolbar
        selectedStructure={selectedStructure}
        onStructureChange={(type) => {
            setErrorAlert(null);
            setSelectedStructure(type);
        }}
        onAction={handleAction}
        onClear={handleClear}
        maxSize={maxSize}
        onMaxSizeChange={handleMaxSizeChange}
      />
      
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden border-t border-sepia">
        {/* Left Column: Visualizer (60%) */}
        <div className="lg:w-[60%] border-r-2 border-carbon flex flex-col h-full bg-crema relative items-start justify-start overflow-hidden">
          {errorAlert && (
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-1 animate-in fade-in slide-in-from-top-4 duration-300">
                  <Alert 
                      variant="error" 
                      title={errorAlert.title} 
                      description={errorAlert.message} 
                      onClose={() => setErrorAlert(null)} 
                   />
              </div>
          )}
          
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {renderVisualizer()}
          </div>
        </div>

        {/* Right Column: Info Panel (40%) */}
        <div className="lg:w-[40%] bg-crema flex flex-col h-full overflow-y-auto px-10 py-6 scrollbar-hide">
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
