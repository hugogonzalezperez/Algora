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
import type { AgentInstance, GamePhase } from '../types';

interface TerritoryCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rows: number;
  cols: number;
  phase: GamePhase;
  agents: AgentInstance[];
  draggingId: number | null;
  onCanvasReady: (width: number, height: number) => void;
  getCell: (row: number, col: number) => number;
  onMoveAgent: (id: number, row: number, col: number) => void;
  onSetDraggingId: (id: number | null) => void;
}

export const TerritoryCanvas = memo(({
  canvasRef,
  rows,
  cols,
  phase,
  agents,
  draggingId,
  onCanvasReady,
  getCell,
  onMoveAgent,
  onSetDraggingId,
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
    if (phase !== 'SETUP') { setHoverCell(null); return; }
    const cell = getCellFromEvent(e);
    setHoverCell(cell);
  }, [phase, getCellFromEvent]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'SETUP') return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    
    const clickedId = getCell(cell.row, cell.col);
    if (clickedId > 0) {
      onSetDraggingId(clickedId);
    }
  }, [phase, getCellFromEvent, getCell, onSetDraggingId]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'SETUP' || draggingId === null) return;
    const cell = getCellFromEvent(e);
    if (!cell) {
      onSetDraggingId(null);
      return;
    }

    onMoveAgent(draggingId, cell.row, cell.col);
    onSetDraggingId(null);
  }, [phase, draggingId, getCellFromEvent, onMoveAgent, onSetDraggingId]);

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null);
    if (draggingId) onSetDraggingId(null);
  }, [draggingId, onSetDraggingId]);

  // ── Hover overlay (drawn via CSS absolute div) ──────────────────────────
  const draggingAgent = draggingId ? agents.find(a => a.id === draggingId) : null;
  const hoverStyle: React.CSSProperties = hoverCell && draggingId && draggingAgent ? {
    position: 'absolute',
    left:   hoverCell.col * cellSize.w,
    top:    hoverCell.row * cellSize.h,
    width:  cellSize.w,
    height: cellSize.h,
    backgroundColor: (draggingAgent as any).rgba ? `rgba(${(draggingAgent as any).rgba.join(',')})` : '#000',
    opacity: 0.8,
    pointerEvents: 'none',
    border: '2px solid #1B1C1A',
    zIndex: 10,
  } : { display: 'none' };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-crema flex items-center justify-center overflow-hidden"
    >
      <div className="relative shadow-[8px_8px_0px_0px_rgba(27,28,26,0.1)]">
        <canvas
          ref={canvasRef}
          className={`block border-2 border-carbon transition-colors ${phase === 'SETUP' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        {/* Drag preview overlay */}
        <div style={hoverStyle} />
      </div>
    </div>
  );
});

TerritoryCanvas.displayName = 'TerritoryCanvas';
