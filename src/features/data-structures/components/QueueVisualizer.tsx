import { memo, useState, useEffect } from 'react';
import type { QueueItem } from '../hooks/useQueue';

interface QueueVisualizerProps {
  queue: QueueItem[];
  peekedIndex: number | null;
  maxSize: number;
}

const QueueElement = memo(({ 
  value, 
  idx, 
  elementWidth, 
  gap, 
  isPeeked, 
  containerWidth 
}: { 
  value: string; 
  idx: number; 
  elementWidth: number; 
  gap: number; 
  isPeeked: boolean; 
  containerWidth: number;
}) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Initial mount starting from right
    const raf = requestAnimationFrame(() => {
      setIsRendered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const targetLeft = idx * (elementWidth + gap) + 8;
  const entryLeft = containerWidth;

  return (
    <div 
      className={`absolute border-2 border-carbon flex items-center justify-center font-mono text-[17px] font-bold transition-all duration-500 ease-in-out
        ${isPeeked ? 'bg-carbon text-crema scale-105 shadow-lg z-10' : 'bg-crema text-carbon'}`}
      style={{ 
          width: `${elementWidth}px`, 
          height: '60px',
          left: `${isRendered ? targetLeft : entryLeft}px`,
      }}
    >
      {value}
    </div>
  );
});

QueueElement.displayName = 'QueueElement';

export const QueueVisualizer = memo(({ queue, peekedIndex, maxSize }: QueueVisualizerProps) => {
  const CONTAINER_WIDTH = 700;
  const GAP = 8;
  const PADDING = 16;
  
  const elementWidth = (CONTAINER_WIDTH - PADDING - (maxSize - 1) * GAP) / maxSize;

  const memoryStrip = Array.from({ length: maxSize }, (_, i) => {
    const item = queue[i];
    return {
      addr: `0x${(i * 4).toString(16).toUpperCase().padStart(2, '0')}`,
      val: item?.value || '--'
    };
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-16">
      {/* Visual Queue Container Wrapper (to allow labels to exceed bounds) */}
      <div className="relative pt-16" style={{ width: `${CONTAINER_WIDTH}px` }}>
        
        {/* Front Pointer (Multiple elements) */}
        {queue.length > 1 && (
          <div 
            className="absolute top-0 flex flex-col items-center transition-all duration-500 z-30"
            style={{ left: `${8 + elementWidth/2}px` }}
          >
            <span className="text-[12px] font-black uppercase tracking-tighter mb-1 select-none">Front</span>
            <div className="w-[2px] h-6 bg-carbon" />
          </div>
        )}

        {/* Rear Pointer (Multiple elements) */}
        {queue.length > 1 && (
          <div 
            className="absolute top-0 flex flex-col items-center transition-all duration-500 z-30"
            style={{ left: `${(queue.length - 1) * (elementWidth + GAP) + 8 + elementWidth/2}px` }}
          >
            <span className="text-[12px] font-black uppercase tracking-tighter mb-1 select-none">Rear</span>
            <div className="w-[2px] h-6 bg-carbon" />
          </div>
        )}

        {/* Dual Pointer (Single element) */}
        {queue.length === 1 && (
          <div 
            className="absolute top-0 flex flex-col items-center transition-all duration-500 z-30"
            style={{ left: `${8 + elementWidth/2}px`, transform: 'translateY(-14px)' }}
          >
            <span className="text-[10px] font-black uppercase leading-none select-none">Front</span>
            <span className="text-[10px] font-black uppercase leading-none select-none">&</span>
            <span className="text-[10px] font-black uppercase leading-none mb-1 select-none">Rear</span>
            <div className="w-[2px] h-6 bg-carbon" />
          </div>
        )}

        {/* The Tube (Overflow hidden) */}
        <div 
          className="relative border-y-4 border-carbon bg-caution overflow-hidden h-[100px] w-full"
        >
          {/* Open ends (no side borders) */}
          <div className="absolute -left-1 top-0 bottom-0 w-2 bg-crema z-20" />
          <div className="absolute -right-1 top-0 bottom-0 w-2 bg-crema z-20" />

          {queue.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 font-mono text-xs uppercase tracking-[0.3em] z-0">
              Empty Queue
            </div>
          )}
          
          {/* Element Layer */}
          <div className="relative w-full h-full flex items-center px-2">
              {queue.map((item, idx) => (
                <QueueElement 
                  key={item.id}
                  value={item.value}
                  idx={idx}
                  elementWidth={elementWidth}
                  gap={GAP}
                  isPeeked={peekedIndex === idx}
                  containerWidth={CONTAINER_WIDTH}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Memory Representation Strip */}
      <div className="flex bg-crema border-x border-carbon shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] mt-12">
        {memoryStrip.map((cell, idx) => (
          <div key={idx} className="relative w-20 border-y border-r border-carbon p-2 flex flex-col items-center gap-1 group">
            {/* Front Pointer Arrow (Multiple elements) */}
            {queue.length > 1 && idx === 0 && (
              <div className="absolute -top-7 flex flex-col items-center animate-bounce">
                 <span className="text-[10px] font-black uppercase tracking-tighter mb-0.5 text-carbon select-none">Front</span>
                 <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-carbon" />
              </div>
            )}

            {/* Rear Pointer Arrow */}
            {queue.length > 0 && idx === queue.length - 1 && idx !== 0 && (
                <div className="absolute -top-7 flex flex-col items-center animate-bounce">
                    <span className="text-[10px] font-black uppercase tracking-tighter mb-0.5 text-carbon select-none">Rear</span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-carbon" />
                </div>
            )}

            {/* Dual pointer if only one element */}
            {queue.length === 1 && idx === 0 && (
                <div className="absolute -top-12 flex flex-col items-center select-none text-carbon animate-bounce">
                    <span className="text-[8px] font-black uppercase leading-none">Front</span>
                    <span className="text-[8px] font-black uppercase leading-none">&</span>
                    <span className="text-[8px] font-black uppercase leading-none mb-0.5">Rear</span>
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

QueueVisualizer.displayName = 'QueueVisualizer';
