import React from 'react';

interface SortingCanvasProps {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  pivotingIndices: number[];
  sortedIndices: Set<number>;
  overwritingIndices: number[];
}

export const SortingCanvas: React.FC<SortingCanvasProps> = ({
  array,
  comparingIndices,
  swappingIndices,
  pivotingIndices,
  sortedIndices,
  overwritingIndices,
}) => {
  const maxValue = Math.max(...array, 1);
  const barWidth = Math.min(80, Math.floor(800 / array.length));

  return (
    <div className="relative flex-grow w-full h-full overflow-hidden bg-crema flex items-center justify-center p-8 pt-24 pb-12 gap-[2px]">
      {array.map((value, idx) => {
        const heightPercentage = (value / maxValue) * 90;
        
        let bgColor = "bg-carbon/20";
        let borderClasses = "";
        let zIndex = "z-0";

        const isComparing = comparingIndices.includes(idx);
        const isSwapping = swappingIndices.includes(idx) || overwritingIndices.includes(idx);
        const isPivoting = pivotingIndices.includes(idx);
        const isSorted = sortedIndices.has(idx);

        let overrideBg = "";
        if (isSwapping) {
          overrideBg = "var(--color-white)";
          borderClasses = "border-[2px] border-carbon";
          zIndex = "z-10";
        } else if (isComparing) {
          overrideBg = "color-mix(in srgb, var(--color-white) 40%, transparent)";
          borderClasses = "border-[2px] border-carbon";
          zIndex = "z-10";
        } else if (isPivoting) {
          bgColor = "bg-caution";
          borderClasses = "border-[2px] border-carbon";
          zIndex = "z-10";
        } else if (isSorted) {
          bgColor = "bg-carbon";
        } else {
          bgColor = "bg-carbon/20";
        }

        return (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-end h-full"
            style={{ width: `${barWidth}px`, minWidth: '2px' }}
          >
            <div
                className={`w-full ${bgColor} ${borderClasses} ${zIndex} transition-all duration-150 box-border`}
                style={{ 
                    height: `${heightPercentage}%`, 
                    backgroundColor: overrideBg || undefined
                }}
            />
            <span className={`mt-2 text-[9px] font-bold font-mono transition-colors duration-300 ${isComparing || isSwapping ? 'text-carbon' : 'text-carbon/20'}`}>
                {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
