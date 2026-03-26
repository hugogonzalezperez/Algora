import { useState, useEffect } from 'react';
import { SortingToolbar } from '../features/sorting/components/SortingToolbar';
import { SortingCanvas } from '../features/sorting/components/SortingCanvas';
import { SortingAlgorithmInfo } from '../features/sorting/components/SortingAlgorithmInfo';
import { SORTING_METADATA } from '../features/sorting/algorithms/index.ts';
import type { SortingAlgorithmMetadata } from '../features/sorting/types';
import { AlgorithmCode } from '../features/sorting/components/AlgorithmCode';
import { useSortingAnimation } from '../features/sorting/hooks/useSortingAnimation';

const DEFAULT_ARRAY_SIZE = 50;
const INITIAL_SPEED = 200;

export const SortingPage = () => {
  const [activeAlgorithmId, setActiveAlgorithmId] = useState('bubble');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);

  const {
    array,
    comparingIndices,
    swappingIndices,
    pivotingIndices,
    sortedIndices,
    overwritingIndices,
    activeLine,
    statusMessage,
    isSorting,
    isPaused,
    handleSort,
    handleStop,
    handleReset,
    generateArray,
  } = useSortingAnimation(activeAlgorithmId, speed);

  useEffect(() => {
    generateArray(arraySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize]);

  const handleAlgoChange = (id: string) => {
    setActiveAlgorithmId(id);
  };

  const activeMetadata: SortingAlgorithmMetadata = SORTING_METADATA[activeAlgorithmId];

  return (
    <div className="page-container min-h-screen bg-crema">
        <div className="visualizer-container h-[calc(100vh-65px)] border-b border-sepia">
            <SortingToolbar
          isRunning={isSorting}
          isPaused={isPaused}
          speed={speed}
          onSpeedChange={setSpeed}
          onRun={handleSort}
          onStop={handleStop}
          onReset={handleReset}
          onGenerate={() => generateArray(arraySize)}
          algorithms={SORTING_METADATA}
          selectedAlgo={activeAlgorithmId}
          onAlgoChange={handleAlgoChange}
          arraySize={arraySize}
          onArraySizeChange={setArraySize}
        />

        <div className="flex-grow w-full overflow-hidden bg-crema flex flex-col lg:flex-row p-0 border-t border-sepia">
            {/* Left Column: Visualizer (70%) */}
            <div className="lg:w-[70%] border-r border-sepia flex flex-col h-full bg-crema relative">
                <div className="flex-grow flex items-center justify-center p-8 min-h-[500px]">
                    <SortingCanvas
                    array={array}
                    comparingIndices={comparingIndices}
                    swappingIndices={swappingIndices}
                    pivotingIndices={pivotingIndices}
                    sortedIndices={sortedIndices}
                    overwritingIndices={overwritingIndices}
                    />
                </div>

                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-6 py-2 bg-sepia shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-carbon border border-carbon/20 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-carbon rounded-full animate-pulse" />
                        {statusMessage}
                    </div>
                </div>

                {/* Color Legend */}
                <div className="absolute bottom-6 left-8 z-20 flex flex-wrap gap-x-6 gap-y-2 px-6 py-3 bg-crema/90 backdrop-blur-md border border-carbon shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-carbon/40" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-carbon/60">Unprocessed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-sepia border border-carbon" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-carbon/60">Comparing / Swap</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-2.5 bg-caution border border-carbon" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-carbon/60">Pivot</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-carbon" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-carbon/60">Sorted</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Code Visualizer (30%) */}
            <div className="lg:w-[30%] bg-carbon flex flex-col h-full overflow-y-auto">
                <div className="p-8 space-y-6">
                    <header className="border-b border-crema/10 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-crema">Execution Code</h3>
                    </header>
                    <AlgorithmCode 
                        code={activeMetadata.headerCode || []} 
                        activeLine={activeLine} 
                    />
                </div>
            </div>
        </div>
      </div>

      <SortingAlgorithmInfo metadata={activeMetadata} />
    </div>
  );
};
SortingPage.displayName = 'SortingPage';
