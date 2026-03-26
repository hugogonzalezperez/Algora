import { memo } from 'react';
import { MapPin, User } from 'lucide-react';

export const PathfindingCanvas = memo(({ rows, cols, cellSize, startNode, endNode, onInteraction, onNodeDragStart }: any) => {
  return (
    <div className="relative overflow-hidden border border-sepia rounded-sm shadow-sm bg-crema w-full h-full">
      <svg
        width={cols * cellSize.x}
        height={rows * cellSize.y}
        className="cursor-crosshair block"
        onMouseUp={() => { window.isDragging = false; onNodeDragStart(null); }}
        onMouseLeave={() => { window.isDragging = false; onNodeDragStart(null); }}
      >
        {/* Grid Nodes */}
        {Array.from({ length: rows }).map((_, y) =>
          Array.from({ length: cols }).map((_, x) => (
            <rect
              key={`${x}-${y}`}
              id={`node-${x}-${y}`}
              x={x * cellSize.x}
              y={y * cellSize.y}
              width={cellSize.x}
              height={cellSize.y}
              fill="transparent"
              stroke="#f1efea"
              strokeWidth="0.5"
              onMouseEnter={() => (window.isDragging || onNodeDragStart) && onInteraction(x, y, true)}
              onMouseDown={() => { window.isDragging = true; onInteraction(x, y, false); }}
              className="transition-colors duration-300 ease-out"
            />
          ))
        )}

        {/* Start Node Icon */}
        {startNode && (
          <foreignObject
            x={startNode.x * cellSize.x}
            y={startNode.y * cellSize.y}
            width={cellSize.x}
            height={cellSize.y}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => { e.stopPropagation(); onNodeDragStart('start'); }}
            onMouseEnter={() => { if (onNodeDragStart) onInteraction(startNode.x, startNode.y, true); }}
          >
            <div className="flex items-center justify-center w-full h-full pointer-events-none">
              <User size={cellSize.x * 0.8} color="#1a1a1a" />
            </div>
          </foreignObject>
        )}

        {/* End Node Icon */}
        {endNode && (
          <foreignObject
            x={endNode.x * cellSize.x}
            y={endNode.y * cellSize.y}
            width={cellSize.x}
            height={cellSize.y}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => { e.stopPropagation(); onNodeDragStart('end'); }}
            onMouseEnter={() => { if (onNodeDragStart) onInteraction(endNode.x, endNode.y, true); }}
          >
            <div className="flex items-center justify-center w-full h-full pointer-events-none">
              <MapPin size={cellSize.x * 0.8} color="#1a1a1a" />
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
});
PathfindingCanvas.displayName = 'PathfindingCanvas';