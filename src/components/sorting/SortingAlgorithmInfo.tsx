import React from 'react';
import type { SortingAlgorithmMetadata } from '../../types/sorting';

interface SortingAlgorithmInfoProps {
  metadata: SortingAlgorithmMetadata;
}

export const SortingAlgorithmInfo: React.FC<SortingAlgorithmInfoProps> = ({ metadata }) => {
  return (
    <div className="bg-crema border-t border-sepia px-12 py-20 pb-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20">
        {/* Left Column: Description & Technical Note */}
        <div className="space-y-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-carbon">
            {metadata.name}
          </h1>
          
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-carbon/80 text-justify font-mono">
              {metadata.description}
            </p>
          </div>

          {metadata.technicalNote && (
            <div className="border-l-4 border-carbon pl-8 py-3 bg-sepia/30">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-carbon/40 mb-3">Technical Note:</h3>
              <p className="text-sm italic text-carbon/70 font-mono leading-relaxed">
                {metadata.technicalNote}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Complexities & Tags */}
        <div className="space-y-12">
          {/* Time Complexity */}
          <div className="space-y-6">
            <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-carbon border-b border-sepia pb-3 font-bold">Time Complexity</h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center border-b border-sepia pb-2">
                <span className="text-[12px] font-black uppercase tracking-widest text-carbon/40">Worst Case</span>
                <span className="text-base font-black text-carbon">{metadata.worstCase}</span>
              </div>
              <div className="flex justify-between items-center border-b border-sepia pb-2">
                <span className="text-[12px] font-black uppercase tracking-widest text-carbon/40">Average Case</span>
                <span className="text-base font-black text-carbon">{metadata.averageCase}</span>
              </div>
              <div className="flex justify-between items-center border-b border-sepia pb-2">
                <span className="text-[12px] font-black uppercase tracking-widest text-carbon/40">Best Case</span>
                <span className="text-base font-black text-carbon">{metadata.bestCase}</span>
              </div>
            </div>
          </div>

          {/* Space Complexity */}
          <div className="space-y-6">
            <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-carbon border-b border-sepia pb-3">Space Complexity</h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center border-b border-sepia pb-2">
                <span className="text-[12px] font-black uppercase tracking-widest text-carbon/40">Auxiliary Space</span>
                <span className="text-base font-black text-carbon">{metadata.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* High Contrast Tags */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-sepia p-5 border border-carbon/10 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-carbon/30 block mb-2">Stability</span>
              <span className="text-xs font-black uppercase tracking-tight text-carbon">{metadata.stability.toUpperCase()} SORT</span>
            </div>
            <div className="bg-sepia p-5 border border-carbon/10 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-carbon/30 block mb-2">Method</span>
              <span className="text-xs font-black uppercase tracking-tight text-carbon">{metadata.method.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
