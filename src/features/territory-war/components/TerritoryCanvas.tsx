// ─────────────────────────────────────────────
// TerritoryCanvas — High-performance game canvas
//
// Renders via <canvas> with ImageData written by useTerritoryGame.
// This component only handles:
//   • Sizing the canvas to fill its container
//   • Mouse events for drag-to-place (SETUP phase)
//   • Forwarding the canvasRef from the hook
// ─────────────────────────────────────────────

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { AgentInstance, AgentType, GamePhase } from '../types';
import { AGENT_COLORS } from '../constants';

interface TerritoryCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rows: number;
  cols: number;
  phase: GamePhase;
  agents: AgentInstance[];
  draggingType: AgentType | null;      // set when user is dragging from panel
  draggingId: number;                   // next agent id to assign
  onPlaceAgent: (agent: AgentInstance) => void;
  onCanvasReady: (width: number, height: number) => void; // fires after size is known
  getCell: (row: number, col: number) => number;
}

export const TerritoryCanvas = memo(({
  canvasRef,
  rows,
  cols,
  phase,
  draggingType,
  draggingId,
  onPlaceAgent,
  onCanvasReady,
  getCell,
}: TerritoryCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState({ w: 12, h: 12 });
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  // ── Measure container and size canvas ──────────────────────────────────

  const measure = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const { clientWidth: cw, clientHeight: ch } = container;

    // Compute cell size that fits both dimensions
    const cellW = Math.floor(cw / cols);
    const cellH = Math.floor(ch / rows);
    const cell = Math.max(4, Math.min(cellW, cellH)); // square cells, min 4px

    canvas.width  = cell * cols;
    canvas.height = cell * rows;

    setCellSize({ w: cell, h: cell });
    onCanvasReady(canvas.width, canvas.height);
  }, [canvasRef, cols, rows, onCanvasReady]);

  useEffect(() => {
    const t = setTimeout(measure, 30);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [measure]);

  // ── Mouse interaction for SETUP drag-to-place ───────────────────────────

  const getCellFromEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize.w);
    const row = Math.floor(y / cellSize.h);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return null;
    return { row, col };
  }, [canvasRef, cellSize, cols, rows]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'SETUP' || !draggingType) { setHoverCell(null); return; }
    const cell = getCellFromEvent(e);
    setHoverCell(cell);
  }, [phase, draggingType, getCellFromEvent]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'SETUP' || !draggingType) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    if (getCell(cell.row, cell.col) !== 0) return; // occupied

    onPlaceAgent({
      id: draggingId,
      type: draggingType,
      row: cell.row,
      col: cell.col,
    });
  }, [phase, draggingType, draggingId, getCellFromEvent, getCell, onPlaceAgent]);

  const handleMouseLeave = useCallback(() => setHoverCell(null), []);

  // ── Hover overlay (drawn via CSS absolute div) ──────────────────────────
  const hoverStyle: React.CSSProperties = hoverCell && draggingType ? {
    position: 'absolute',
    left:   hoverCell.col * cellSize.w,
    top:    hoverCell.row * cellSize.h,
    width:  cellSize.w,
    height: cellSize.h,
    backgroundColor: AGENT_COLORS[draggingType],
    opacity: 0.6,
    pointerEvents: 'none',
    border: '1px solid rgba(27,28,26,0.4)',
  } : { display: 'none' };

  return (
    <div
      ref={containerRef}
      className="relative flex-grow w-full h-full flex items-center justify-center bg-crema overflow-hidden"
    >
      <div className="relative" style={{ display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          className={`block border border-carbon/20 ${phase === 'SETUP' && draggingType ? 'cursor-crosshair' : 'cursor-default'}`}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
        />
        {/* Drag preview overlay */}
        <div style={hoverStyle} />
      </div>
    </div>
  );
});

TerritoryCanvas.displayName = 'TerritoryCanvas';
