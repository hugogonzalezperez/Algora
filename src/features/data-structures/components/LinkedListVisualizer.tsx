import { memo } from 'react';
import type { LinkedListNode } from '../hooks/useLinkedList';

interface LinkedListVisualizerProps {
  nodes: LinkedListNode[];
  highlightedIndex: number | null;
}

export const LinkedListVisualizer = memo(({ nodes, highlightedIndex }: LinkedListVisualizerProps) => {

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 w-full">
      {/* Visual Container */}
      <div className="relative min-h-[400px] flex items-center justify-center w-full px-8 py-12 bg-crema border-y border-carbon/10">
        
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 font-mono text-sm uppercase tracking-[0.3em] z-0">
            <span>Empty List</span>
            <span className="text-[10px] mt-2">Head = null</span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-x-24 gap-y-32 relative px-10">
          {nodes.map((node, idx) => {
            const isLast = idx === nodes.length - 1;
            const isHighlighted = highlightedIndex === idx;
            
            const cols = 4;
            const row = Math.floor(idx / cols);
            const isEvenRow = row % 2 === 0;
            const colPos = isEvenRow ? (idx % cols) + 1 : cols - (idx % cols);
            const isRowEnd = (idx + 1) % cols === 0;

            return (
              <div 
                key={node.id} 
                className="relative flex flex-col items-center group"
                style={{ gridColumnStart: colPos, gridRowStart: row + 1 }}
              >
                
                {/* HEAD indicator for Node 0 */}
                {idx === 0 && (
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60">
                     <span className="text-[10px] font-black uppercase tracking-tighter text-carbon">Head</span>
                     <div className="w-6 h-[2px] bg-carbon" />
                  </div>
                )}

                {/* TAIL indicator for Last Node */}
                {isLast && nodes.length > 0 && (
                  <div className={`absolute -bottom-12 flex flex-col items-center opacity-60`}>
                     <div className="w-[1px] h-4 bg-carbon" />
                     <span className="text-[10px] font-black uppercase tracking-tighter text-carbon">Tail</span>
                  </div>
                )}
                
                {/* Node Box - Flip on odd (right-to-left) rows */}
                <div 
                  className={`flex ${isEvenRow ? 'flex-row' : 'flex-row-reverse'} border-2 border-carbon font-mono text-[16px] font-bold transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]
                    ${isHighlighted ? 'bg-carbon text-crema scale-110 z-10' : 'bg-crema text-carbon'}
                  `}
                  style={{ height: '54px', width: '100px' }}
                >
                  {/* Data Part */}
                  <div className={`flex-1 flex items-center justify-center px-1 overflow-hidden text-ellipsis whitespace-nowrap ${isEvenRow ? 'border-r-2' : 'border-l-2'} border-carbon`}>
                    {node.value}
                  </div>
                  
                  {/* Pointer Part (Always on the logical "next" side) */}
                  <div className={`w-8 flex items-center justify-center relative ${isHighlighted ? 'bg-carbon/20' : 'bg-carbon/5'}`}>
                    {isLast ? (
                      <span className="text-[12px] opacity-40 leading-none">ø</span>
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-crema' : 'bg-carbon'}`} />
                    )}

                    {/* Arrow to next node */}
                    {!isLast && (
                       <div className="absolute top-1/2 flex items-center justify-center pointer-events-none z-0 overflow-visible w-0 h-0">
                         {!isRowEnd ? (
                           // Horizontal arrow (direction depends on isEvenRow)
                           <div className={`relative ${isEvenRow ? 'left-[48px]' : 'right-[48px] rotate-180'}`}>
                             <div className={`h-[2px] w-[64px] ${isHighlighted ? 'bg-carbon' : 'bg-carbon/30'}`} />
                             <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] ${isHighlighted ? 'border-l-carbon' : 'border-l-carbon/30'}`} />
                           </div>
                         ) : (
                           // Vertical arrow at row break (Points DOWN to next row)
                           <div className={`absolute top-[27px] flex flex-col items-center`}>
                              {/* Straight line down into the next row's vertical space */}
                              <div className="w-[1px] h-[106px] bg-carbon/20 border-r border-dashed border-carbon/20" />
                              <div className="w-0 h-0 -translate-y-[1px] border-x-[4px] border-x-transparent border-t-[6px] border-t-carbon/30" />
                           </div>
                         )}
                       </div>
                    )}
                  </div>
                </div>

                {/* Node Index */}
                <div className="absolute -top-6 text-[9px] font-black font-mono text-carbon/40 tracking-widest uppercase opacity-70">
                  Node #{idx}
                </div>

              </div>
            );
          })}
        </div>
        
      </div>
      
      {/* Help info for the grid layout */}
      <div className="mt-8 flex gap-8">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 border border-carbon bg-carbon" />
           <span className="text-[10px] font-mono text-carbon/60">Selected/Current</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 border border-carbon border-dashed" />
           <span className="text-[10px] font-mono text-carbon/60">Next Connection</span>
        </div>
      </div>
    </div>
  );
});

LinkedListVisualizer.displayName = 'LinkedListVisualizer';

