// ─────────────────────────────────────────────
// useTerritoryGame — Core game loop hook
//
// Architecture notes:
// • Grid state lives in a useRef(Int16Array) — never triggers re-renders
// • The canvas is written directly via ImageData (no React state per cell)
// • React state is ONLY used for: stats panel, generation counter, phase
// • Frontier sets per agent are maintained as flat arrays of grid indices
// • Dirty tracking: only changed cells are repainted per tick
// ─────────────────────────────────────────────

import { useRef, useState, useCallback, useEffect } from 'react';
import type { AgentInstance, AgentStats, GamePhase, AgentType } from '../types';
import { AGENT_RGBA, EMPTY_RGBA, GRID_LINE_RGBA } from '../constants';
import { greedyStep } from '../algorithms/greedy';
import { borderStep } from '../algorithms/border';
import { hunterStep } from '../algorithms/hunter';
import { randomStep } from '../algorithms/random';

// ── Internal helpers ───────────────────────────────────────────────────────

function idx(row: number, col: number, cols: number) {
  return row * cols + col;
}

function getNeighbors(i: number, rows: number, cols: number): number[] {
  const r = (i / cols) | 0;
  const c = i % cols;
  const ns: number[] = [];
  if (r > 0)        ns.push((r - 1) * cols + c);
  if (r < rows - 1) ns.push((r + 1) * cols + c);
  if (c > 0)        ns.push(r * cols + (c - 1));
  if (c < cols - 1) ns.push(r * cols + (c + 1));
  return ns;
}

/** Shuffle array in-place (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build frontier set for an agent from scratch */
function buildFrontier(grid: Int16Array, rows: number, cols: number, agentId: number): number[] {
  const frontier: number[] = [];
  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    if (grid[i] !== agentId) continue;
    const ns = getNeighbors(i, rows, cols);
    if (ns.some(n => grid[n] === 0)) frontier.push(i);
  }
  return frontier;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface TerritoryGameState {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  phase: GamePhase;
  generation: number;
  stats: AgentStats;
  agents: AgentInstance[];         // current placed agents (SETUP + RUNNING)
  hoveredCell: { row: number; col: number } | null;
  play: (speedMs?: number) => void;
  pause: () => void;
  reset: (newAgents?: AgentInstance[]) => void;
  placeAgent: (agent: AgentInstance) => void;
  removeAgent: (agentId: number) => void;
  moveAgent: (agentId: number, row: number, col: number) => void;
  updateAgent: (agentId: number, type: AgentType) => void;
  moveAgentPreview: (row: number, col: number) => void;
  clearHover: () => void;
  getCell: (row: number, col: number) => number; // returns agentId (0=empty)
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useTerritoryGame(
  rows: number,
  cols: number,
): TerritoryGameState {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Mutable refs (no re-renders) ──
  const gridRef        = useRef<Int16Array>(new Int16Array(rows * cols));
  const agentsRef      = useRef<AgentInstance[]>([]);
  const frontiersRef   = useRef<Map<number, number[]>>(new Map()); // agentId → frontier[]
  const cellCountsRef  = useRef<Map<number, number>>(new Map());   // agentId → cell count
  const rafRef         = useRef<number | null>(null);
  const lastTickRef    = useRef<number>(0);
  const stopRef        = useRef<boolean>(false);
  const generationRef  = useRef<number>(0);
  const rowsRef        = useRef(rows);
  const colsRef        = useRef(cols);
  const hoverRef       = useRef<{ row: number; col: number } | null>(null);

  // imageDataRef caches the pixel buffer; we write directly then putImageData
  const imageDataRef   = useRef<ImageData | null>(null);

  // ── React state (panel + header only) ──
  const [phase,      setPhase]      = useState<GamePhase>('SETUP');
  const [generation, setGeneration] = useState(0);
  const [stats,      setStats]      = useState<AgentStats>({});
  const [agentsState, setAgentsState] = useState<AgentInstance[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // ── Canvas helpers ────────────────────────────────────────────────────────

  const initImageData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = rowsRef.current;
    const c = colsRef.current;
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / c;
    const cellH = ch / r;

    // Create ImageData freshly
    const id = ctx.createImageData(cw, ch);
    const data = id.data;

    // Fill all pixels with empty color
    const [er, eg, eb, ea] = EMPTY_RGBA;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = er;
      data[i + 1] = eg;
      data[i + 2] = eb;
      data[i + 3] = ea;
    }

    // Draw grid lines (1px borders between cells)
    const [lr, lg, lb, la] = GRID_LINE_RGBA;
    for (let row = 0; row <= r; row++) {
      const py = Math.round(row * cellH);
      for (let px = 0; px < cw; px++) {
        const off = (py * cw + px) * 4;
        data[off] = lr; data[off+1] = lg; data[off+2] = lb; data[off+3] = la;
      }
    }
    for (let col = 0; col <= c; col++) {
      const px = Math.round(col * cellW);
      for (let row = 0; row < ch; row++) {
        const off = (row * cw + px) * 4;
        data[off] = lr; data[off+1] = lg; data[off+2] = lb; data[off+3] = la;
      }
    }

    imageDataRef.current = id;
    ctx.putImageData(id, 0, 0);
  }, []);

  /**
   * Paint a single grid cell using direct ImageData pixel writes.
   * This avoids fillRect overhead for bulk updates.
   */
  const paintCell = useCallback((row: number, col: number, rgba: [number, number, number, number]) => {
    const canvas = canvasRef.current;
    const id = imageDataRef.current;
    if (!canvas || !id) return;

    const r = rowsRef.current;
    const c = colsRef.current;
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / c;
    const cellH = ch / r;

    const x0 = Math.round(col * cellW) + 1;
    const y0 = Math.round(row * cellH) + 1;
    const x1 = Math.round((col + 1) * cellW) - 1;
    const y1 = Math.round((row + 1) * cellH) - 1;

    const [pr, pg, pb, pa] = rgba;
    const data = id.data;

    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        const off = (py * cw + px) * 4;
        data[off]     = pr;
        data[off + 1] = pg;
        data[off + 2] = pb;
        data[off + 3] = pa;
      }
    }
  }, []);

  const flushCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const id = imageDataRef.current;
    if (!canvas || !id) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(id, 0, 0);

    // Draw eyes for each active agent at their current position
    const r = rowsRef.current;
    const c = colsRef.current;
    const cellW = canvas.width / c;
    const cellH = canvas.height / r;

    for (const agent of agentsRef.current) {
      const cx = (agent.col + 0.5) * cellW;
      const cy = (agent.row + 0.5) * cellH;
      
      const eyeOffset = cellW * 0.18;
      const whiteSize = Math.max(2, cellW * 0.14);
      const pupilSize = Math.max(1, cellW * 0.07);

      // 1. Draw Whites
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx - eyeOffset, cy - eyeOffset, whiteSize, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffset, cy - eyeOffset, whiteSize, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Pupils
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx - eyeOffset, cy - eyeOffset, pupilSize, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffset, cy - eyeOffset, pupilSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // ── Stats recalculation (O(agents)) ──────────────────────────────────────

  const rebuildStats = useCallback(() => {
    const total = rowsRef.current * colsRef.current;
    const newStats: AgentStats = {};
    for (const agent of agentsRef.current) {
      const cells = cellCountsRef.current.get(agent.id) ?? 0;
      newStats[agent.id] = {
        type: agent.type,
        cells,
        pct: total > 0 ? Math.round((cells / total) * 100) : 0,
      };
    }
    setStats(newStats);
  }, []);


  // ── Game tick ─────────────────────────────────────────────────────────────

  const tick = useCallback((agents: AgentInstance[]) => {
    const grid = gridRef.current;
    const r    = rowsRef.current;
    const c    = colsRef.current;
    const colorMap = new Map<number, [number, number, number, number]>();
    for (const a of agents) colorMap.set(a.id, (a as any).rgba || AGENT_RGBA[a.type]);

    let anyMoved = false;

    // Process agents in shuffled order each tick for fairness
    const order = shuffle([...agents]);

    for (const agent of order) {
      const frontier = frontiersRef.current.get(agent.id);
      if (!frontier || frontier.length === 0) continue;

      // Shuffle frontier to avoid directional artifacts
      shuffle(frontier);

      let target: number | null = null;

      switch (agent.type) {
        case 'GREEDY': target = greedyStep(grid, r, c, agent, frontier); break;
        case 'BORDER': target = borderStep(grid, r, c, agent, frontier); break;
        case 'HUNTER': target = hunterStep(grid, r, c, agent, frontier, agents); break;
        case 'RANDOM': target = randomStep(grid, r, c, agent, frontier); break;
      }

      if (target === null || target < 0 || target >= grid.length) continue;
      if (grid[target] !== 0) continue; // race condition guard

      // Claim the cell
      grid[target] = agent.id;
      anyMoved = true;

      // Update cell count
      cellCountsRef.current.set(agent.id, (cellCountsRef.current.get(agent.id) ?? 0) + 1);

      // Paint the cell (dirty-tracking — only this cell)
      const tRow = (target / c) | 0;
      const tCol = target % c;
      paintCell(tRow, tCol, colorMap.get(agent.id)!);

      // Update frontier: new cell might be frontier if it has empty neighbors
      const newNeighbors = getNeighbors(target, r, c);
      const hasEmpty = newNeighbors.some(n => grid[n] === 0);
      if (hasEmpty && !frontier.includes(target)) frontier.push(target);

      // Update agent position tracking (for Hunter heuristic)
      agent.row = tRow;
      agent.col = tCol;
    }

    if (anyMoved) flushCanvas();

    // Check game end
    const totalEmpty = gridRef.current.filter(v => v === 0).length;
    if (totalEmpty === 0) return 'finished';
    return 'running';
  }, [paintCell, flushCanvas]);

  // ── RAF game loop ─────────────────────────────────────────────────────────

  const runLoop = useCallback((speed: number, agents: AgentInstance[]) => {
    const loop = (timestamp: number) => {
      if (stopRef.current) return;

      const elapsed = timestamp - lastTickRef.current;
      if (elapsed >= speed || speed === 0) {
        lastTickRef.current = timestamp;
        generationRef.current++;

        const result = tick(agents);

        // Update React state every N ticks to avoid too-frequent renders
        if (generationRef.current % 5 === 0 || result === 'finished') {
          setGeneration(generationRef.current);
          rebuildStats();
        }

        if (result === 'finished') {
          setPhase('FINISHED');
          setGeneration(generationRef.current);
          rebuildStats();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [tick, rebuildStats]);

  // ── Public API ────────────────────────────────────────────────────────────

  const play = useCallback((speedMs = 30) => {
    if (agentsRef.current.length < 2) return;
    stopRef.current = false;
    setPhase('RUNNING');
    runLoop(speedMs, agentsRef.current);
  }, [runLoop]);

  const pause = useCallback(() => {
    stopRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase('PAUSED');
  }, []);

  const reset = useCallback((newAgents?: AgentInstance[]) => {
    stopRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const r = rowsRef.current;
    const c = colsRef.current;
    gridRef.current = new Int16Array(r * c);
    frontiersRef.current = new Map();
    cellCountsRef.current = new Map();
    agentsRef.current = [];
    generationRef.current = 0;

    setPhase('SETUP');
    setGeneration(0);
    setStats({});
    setAgentsState([]);

    initImageData();

    // If new agents provided (e.g. random spawn), place them
    if (newAgents) {
      newAgents.forEach(a => placeAgent(a));
    }
  }, [initImageData]);

  const placeAgent = useCallback((agent: AgentInstance) => {
    const c = colsRef.current;
    const r = rowsRef.current;
    const gi = idx(agent.row, agent.col, c);

    // Ensure position is valid and empty
    if (agent.row < 0 || agent.row >= r || agent.col < 0 || agent.col >= c) return;
    if (gridRef.current[gi] !== 0) return;

    // Register agent
    agentsRef.current = [...agentsRef.current, agent];
    gridRef.current[gi] = agent.id;
    cellCountsRef.current.set(agent.id, 1);

    // Build initial frontier
    const frontier = buildFrontier(gridRef.current, r, c, agent.id);
    frontiersRef.current.set(agent.id, frontier);

    // Paint cell (use agentId to find color index or use fixed mapping if needed)
    // For simplicity, we'll assume color index comes from somewhere or we use a palette
    const rgba = (agent as any).rgba || AGENT_RGBA[agent.type] || [0,0,0,255];
    paintCell(agent.row, agent.col, rgba);
    flushCanvas();

    setAgentsState([...agentsRef.current]);
    rebuildStats();
  }, [paintCell, flushCanvas, rebuildStats]);

  const removeAgent = useCallback((agentId: number) => {
    const c = colsRef.current;
    const r = rowsRef.current;

    // Remove all cells belonging to this agent
    const grid = gridRef.current;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === agentId) {
        grid[i] = 0;
        const row = (i / c) | 0;
        const col = i % c;
        paintCell(row, col, EMPTY_RGBA);
      }
    }

    agentsRef.current = agentsRef.current.filter(a => a.id !== agentId);
    frontiersRef.current.delete(agentId);
    cellCountsRef.current.delete(agentId);

    // Rebuild frontiers for remaining agents
    for (const a of agentsRef.current) {
      frontiersRef.current.set(a.id, buildFrontier(grid, r, c, a.id));
    }

    flushCanvas();
    setAgentsState([...agentsRef.current]);
    rebuildStats();
  }, [paintCell, flushCanvas, rebuildStats]);

  const moveAgent = useCallback((agentId: number, row: number, col: number) => {
    const agent = agentsRef.current.find(a => a.id === agentId);
    if (!agent) return;

    const c = colsRef.current;
    const r = rowsRef.current;
    const oldIdx = idx(agent.row, agent.col, c);
    const newIdx = idx(row, col, c);

    if (row < 0 || row >= r || col < 0 || col >= c) return;
    if (gridRef.current[newIdx] !== 0 && gridRef.current[newIdx] !== agentId) return;

    // Clear old pos
    gridRef.current[oldIdx] = 0;
    paintCell(agent.row, agent.col, EMPTY_RGBA);

    // Update agent
    agent.row = row;
    agent.col = col;

    // Set new pos
    gridRef.current[newIdx] = agentId;
    const rgba = (agent as any).rgba || AGENT_RGBA[agent.type] || [0,0,0,255];
    paintCell(row, col, rgba);

    // Rebuild frontier for *all* agents because moving one might free up cells for others
    for (const a of agentsRef.current) {
      frontiersRef.current.set(a.id, buildFrontier(gridRef.current, r, c, a.id));
    }

    flushCanvas();
    setAgentsState([...agentsRef.current]);
    rebuildStats();
  }, [paintCell, flushCanvas, rebuildStats]);

  const updateAgent = useCallback((agentId: number, type: AgentType) => {
    const agent = agentsRef.current.find(a => a.id === agentId);
    if (!agent) return;

    agent.type = type;
    setAgentsState([...agentsRef.current]);
    rebuildStats();
  }, [rebuildStats]);

  const moveAgentPreview = useCallback((row: number, col: number) => {
    hoverRef.current = { row, col };
    setHoveredCell({ row, col });
  }, []);

  const clearHover = useCallback(() => {
    hoverRef.current = null;
    setHoveredCell(null);
  }, []);

  const getCell = useCallback((row: number, col: number): number => {
    const c = colsRef.current;
    return gridRef.current[idx(row, col, c)] ?? 0;
  }, []);

  // ── Initialize canvas on mount / grid resize ──────────────────────────────

  useEffect(() => {
    rowsRef.current = rows;
    colsRef.current = cols;

    // Reset everything on grid size change
    stopRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    gridRef.current = new Int16Array(rows * cols);
    frontiersRef.current = new Map();
    cellCountsRef.current = new Map();
    agentsRef.current = [];
    generationRef.current = 0;

    setPhase('SETUP');
    setGeneration(0);
    setStats({});
    setAgentsState([]);

    // Short delay to let canvas resize in DOM before drawing
    const t = setTimeout(initImageData, 50);
    return () => clearTimeout(t);
  }, [rows, cols, initImageData]);

  return {
    canvasRef,
    phase,
    generation,
    stats,
    agents: agentsState,
    hoveredCell,
    play,
    pause,
    reset,
    placeAgent,
    removeAgent,
    moveAgent,
    updateAgent,
    moveAgentPreview,
    clearHover,
    getCell,
  };
}
