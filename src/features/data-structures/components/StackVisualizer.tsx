import { memo, useState, useEffect } from 'react';
import type { StackItem } from '../hooks/useStack';

interface StackVisualizerProps {
  stack: StackItem[];
  peekedIndex: number | null;
  maxSize: number;
}

const StackElement = memo(({ 
  value, 
  idx, 
  elementHeight, 
  gap, 
  isPeeked, 
  containerHeight 
}: { 
  value: string; 
  idx: number; 
  elementHeight: number; 
  gap: number; 
  isPeeked: boolean; 
  containerHeight: number;
}) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Initial mount starting from top
    const raf = requestAnimationFrame(() => {
      setIsRendered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const targetBottom = idx * (elementHeight + gap) + 4;
  const entryBottom = containerHeight;

  return (
    <div 
      className={`absolute w-[calc(100%-8px)] border-2 border-carbon flex items-center justify-center font-mono text-[17px] font-bold transition-all duration-500 ease-in-out
        ${isPeeked ? 'bg-carbon text-crema scale-105 shadow-lg z-10 shadow-carbon/20' : 'bg-crema text-carbon'}`}
      style={{ 
          height: `${elementHeight}px`,
          bottom: `${isRendered ? targetBottom : entryBottom}px`,
          left: '4px'
      }}
    >
      {value}
    </div>
  );
});

StackElement.displayName = 'StackElement';

export const StackVisualizer = memo(({ stack, peekedIndex, maxSize }: StackVisualizerProps) => {
  const CONTAINER_HEIGHT = 460;
  const GAP = 4;
  const PADDING = 8;
  
  const elementHeight = (CONTAINER_HEIGHT - PADDING - (maxSize - 1) * GAP) / maxSize;

  const memoryStrip = Array.from({ length: maxSize }, (_, i) => {
    const item = stack[i];
    return {
      addr: `0x${(i * 4).toString(16).toUpperCase().padStart(2, '0')}`,
      val: item?.value || '--'
    };
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-12">
      {/* Visual Stack Container */}
      <div 
        className="relative w-48 border-x-4 border-b-4 border-carbon bg-caution overflow-hidden"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
      >
        {stack.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 font-mono text-xs uppercase tracking-[0.3em] rotate-90 select-none">
            Empty Stack
          </div>
        )}
        
        {/* Element Layer */}
        <div className="absolute inset-0">
            {stack.map((item, idx) => (
              <StackElement 
                key={item.id}
                value={item.value}
                idx={idx}
                elementHeight={elementHeight}
                gap={GAP}
                isPeeked={peekedIndex === idx}
                containerHeight={CONTAINER_HEIGHT}
              />
            ))}
        </div>

        {/* Top Pointer */}
        {stack.length > 0 && (
          <div 
            className="absolute -right-27 flex items-center gap-2 transition-all duration-500 z-20 pointer-events-none"
            style={{ 
                bottom: `${(stack.length - 1) * (elementHeight + GAP) + (elementHeight / 2) + 4}px`,
                transform: 'translateX(8px)'
            }}
          >
            <div className="w-8 h-[2px] bg-carbon" />
            <span className="text-[12px] font-black uppercase tracking-tighter select-none">Stack Top</span>
          </div>
        )}
      </div>

      {/* Memory Representation Strip */}
      <div className="flex bg-crema border-x border-carbon shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] mt-12">
        {memoryStrip.map((cell, idx) => (
          <div key={idx} className="relative w-20 border-y border-r border-carbon p-2 flex flex-col items-center gap-1 group">
            {/* Top Pointer Arrow */}
            {idx === stack.length - 1 && (
              <div className="absolute -top-7 flex flex-col items-center animate-bounce">
                 <span className="text-[11px] font-black uppercase tracking-tighter mb-0.5 text-carbon select-none">Top</span>
                 <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-carbon" />
              </div>
            )}
            
            <span className="text-[10px] font-mono text-carbon/60 pt-1 group-hover:text-carbon/60 transition-colors uppercase">
              {cell.addr}
            </span>
            <div className={`text-[15px] font-mono font-bold ${cell.val === '--' ? 'opacity-20' : 'text-carbon'}`}>
              {cell.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

StackVisualizer.displayName = 'StackVisualizer';
