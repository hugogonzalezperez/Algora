import { memo } from 'react';
import type { Bucket } from '../hooks/useHashTable';

interface HashTableVisualizerProps {
  table: Bucket[];
  highlightedBucket: number | null;
  highlightedKey: string | null;
}

export const HashTableVisualizer = memo(({ 
  table, 
  highlightedBucket, 
  highlightedKey 
}: HashTableVisualizerProps) => {

  return (
    <div className="flex flex-col items-start justify-start h-full p-8 w-full overflow-auto">
      <div className="flex flex-col gap-4 min-w-full">
        {table.map((bucket, bucketIdx) => {
          const isBucketHighlighted = highlightedBucket === bucketIdx;

          return (
            <div key={bucketIdx} className="flex items-center group">
              {/* Bucket Index */}
              <div 
                className={`w-14 h-14 border-2 border-carbon flex items-center justify-center font-mono text-sm font-black transition-all duration-300
                  ${isBucketHighlighted ? 'bg-carbon text-crema scale-110 z-10' : 'bg-crema text-carbon/40'}
                `}
              >
                [{bucketIdx}]
              </div>

              {/* Arrow to Chain */}
              <div className={`w-8 h-[2px] transition-colors duration-300 ${isBucketHighlighted ? 'bg-carbon' : 'bg-carbon/20'}`} />

              {/* Chain (Linked List) */}
              <div className="flex items-center gap-2">
                {bucket.length === 0 ? (
                  <span className="text-[10px] font-mono text-carbon/20 ml-2 uppercase tracking-widest">null</span>
                ) : (
                  bucket.map((entry, entryIdx) => {
                    const isKeyHighlighted = highlightedKey === entry.key;

                    return (
                      <div key={entry.id} className="flex items-center gap-2">
                        {/* Entry Box */}
                        <div 
                          className={`min-w-[100px] h-14 border-2 border-carbon p-2 flex flex-col items-center justify-center transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]
                            ${isKeyHighlighted ? 'bg-carbon text-crema scale-105 z-10 shadow-carbon/20' : 'bg-crema text-carbon'}
                          `}
                        >
                          <div className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${isKeyHighlighted ? 'text-crema/60' : 'text-carbon/40'}`}>
                            {entry.key}
                          </div>
                          <div className="text-sm font-bold font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                            {entry.value}
                          </div>
                        </div>

                        {/* Pointer to next or null */}
                        {entryIdx < bucket.length - 1 ? (
                          <div className={`w-6 h-[2px] ${isKeyHighlighted ? 'bg-carbon' : 'bg-carbon/20'}`} />
                        ) : (
                          <div className="ml-2 text-[10px] font-mono text-carbon/20 uppercase">ø</div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-12 p-4 border border-dashed border-carbon/20 w-full bg-carbon/[0.02]">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 text-carbon/40">Collision Strategy: Separate Chaining</h4>
        <p className="text-[11px] font-mono text-carbon/60 italic leading-tight">
          Keys hashing to the same bucket are stored in a linked list. This visualizer highlights the bucket and node being targeted by the hash function.
        </p>
      </div>
    </div>
  );
});

HashTableVisualizer.displayName = 'HashTableVisualizer';
