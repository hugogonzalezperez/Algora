import { useState, useCallback, useEffect, useRef } from 'react';
import { Grid } from '../components/Grid';
import { PathfindingToolbar } from '../components/PathfindingToolbar';
import { AlgorithmInfo } from '../components/AlgorithmInfo';
import { PATHFINDING_ALGORITHMS } from '../algorithms/pathfinding/solvers';
import { MAZE_ALGORITHMS } from '../algorithms/pathfinding/maze';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';

const TARGET_CELL_SIZE = 25;

export const PathfindingPage = () => {
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0, cellSize: { x: TARGET_CELL_SIZE, y: TARGET_CELL_SIZE } });
  const [startNode, setStartNode] = useState({ x: 0, y: 0 });
  const [endNode, setEndNode] = useState({ x: 0, y: 0 });
  const [resultAlert, setResultAlert] = useState<{
    variant: 'info' | 'error' | 'success';
    title: string;
    description: string;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(10); // Delay en ms (x1)
  const stopRequested = useRef(false);
  const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null);
  const initialDragPosition = useRef<{ x: number, y: number } | null>(null);
  const prevDraggingNode = useRef<'start' | 'end' | null>(null);

  useEffect(() => {
    if (prevDraggingNode.current !== null && draggingNode === null) {
      if (prevDraggingNode.current === 'start') {
        const node = document.getElementById(`node-${startNode.x}-${startNode.y}`);
        if (node) node.setAttribute('fill', 'transparent');
      } else if (prevDraggingNode.current === 'end') {
        const node = document.getElementById(`node-${endNode.x}-${endNode.y}`);
        if (node) node.setAttribute('fill', 'transparent');
      }
    }
    prevDraggingNode.current = draggingNode;
  }, [draggingNode, startNode, endNode]);


  const [selectedPathAlgo, setSelectedPathAlgo] = useState('bfs');
  const [selectedMazeAlgo, setSelectedMazeAlgo] = useState('none');

  const containerRef = useRef<HTMLDivElement>(null);

  const calculateGridSize = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth: width, clientHeight: height } = containerRef.current;

      const cols = Math.floor(width / TARGET_CELL_SIZE);
      const rows = Math.floor(height / TARGET_CELL_SIZE);

      const actualCellSize = {
        x: width / cols,
        y: height / rows
      };

      setGridSize({ rows, cols, cellSize: actualCellSize });
      // Solo resetear nodos si se salen de los límites o es la primera vez
      setStartNode(prev => (prev.x === 0 && prev.y === 0) || prev.x >= cols || prev.y >= rows ? { x: Math.floor(cols / 4), y: Math.floor(rows / 2) } : prev);
      setEndNode(prev => (prev.x === 0 && prev.y === 0) || prev.x >= cols || prev.y >= rows ? { x: Math.floor(3 * cols / 4), y: Math.floor(rows / 2) } : prev);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(calculateGridSize, 50);
    window.addEventListener('resize', calculateGridSize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateGridSize);
    };
  }, [calculateGridSize]);

  const clearPath = useCallback(() => {
    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        const node = document.getElementById(`node-${x}-${y}`);
        if (node) {
          const fill = node.getAttribute('fill');
          // Solo limpiar si no es un muro
          if (fill !== '#1a1a1a' && fill !== 'rgb(26, 26, 26)') {
            node.setAttribute('fill', 'transparent');
            node.style.transitionDelay = '0ms';
          }
        }
      }
    }
    // Limpiar lineas y puntos del camino que se dibujan nativamente
    document.querySelectorAll('.path-extra-element').forEach(el => el.remove());
  }, [gridSize]);

  const handleInteraction = useCallback((x: number, y: number, isHover: boolean) => {
    if (isRunning) return;

    if (draggingNode === 'start') {
      // Prevenir que el nodo de inicio se superponga con el nodo final
      if (x === endNode.x && y === endNode.y) return;
      setStartNode({ x, y });
      clearPath();
      return;
    }

    if (draggingNode === 'end') {
      // Prevenir que el nodo final se superponga con el nodo de inicio
      if (x === startNode.x && y === startNode.y) return;
      setEndNode({ x, y });
      clearPath();
      return;
    }

    // Evitar pintar muro sobre inicio/fin
    if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) return;

    if (!isHover || window.isDragging) {
      const node = document.getElementById(`node-${x}-${y}`);
      if (node) {
        const currentFill = node.getAttribute('fill');
        if (currentFill === '#1a1a1a' || currentFill === 'rgb(26, 26, 26)') {
          node.setAttribute('fill', 'transparent');
        } else {
          node.setAttribute('fill', '#1a1a1a');
        }
      }
    }
  }, [isRunning, startNode, endNode, draggingNode, clearPath]);

  const handleNodeDragStart = useCallback((nodeType: 'start' | 'end' | null) => {
    if (isRunning) return;

    if (nodeType !== null) {
      // Guardar posición inicial al empezar el arrastre
      initialDragPosition.current = nodeType === 'start' ? { ...startNode } : { ...endNode };
    } else {
      // Al soltar el nodo, comprobar si hay colisión
      if (draggingNode === 'start') {
        if (startNode.x === endNode.x && startNode.y === endNode.y) {
          if (initialDragPosition.current) setStartNode(initialDragPosition.current);
        }
      } else if (draggingNode === 'end') {
        if (endNode.x === startNode.x && endNode.y === startNode.y) {
          if (initialDragPosition.current) setEndNode(initialDragPosition.current);
        }
      }
      initialDragPosition.current = null;
    }
    setDraggingNode(nodeType);
  }, [isRunning, draggingNode, startNode, endNode]);

  const runAlgorithm = async () => {
    if (isRunning || !gridSize.rows || !gridSize.cols) return;

    if (selectedPathAlgo === 'none') {
      setResultAlert({
        variant: 'warning',
        title: 'ALGORITHM REQUIRED',
        description: 'Please select a pathfinding algorithm in the toolbar before starting the execution.',
      });
      return;
    }

    const algo = PATHFINDING_ALGORITHMS[selectedPathAlgo];
    if (!algo || !algo.isImplemented) return;

    setIsRunning(true);
    stopRequested.current = false;
    clearPath();
    const startTime = performance.now();
    let pathFound = false;
    let pathLength = 0;

    const currentGrid: boolean[][] = Array.from({ length: gridSize.rows }, (_, y) =>
      Array.from({ length: gridSize.cols }, (_, x) => {
        const node = document.getElementById(`node-${x}-${y}`);
        if (!node) return false;
        const fill = node.getAttribute('fill');
        return fill !== 'transparent' && fill !== 'none' && fill !== '';
      })
    );

    const generator = algo.execute(
      currentGrid,
      startNode,
      endNode,
      gridSize.rows,
      gridSize.cols
    );

    for (const step of generator) {
      if (stopRequested.current) break;

      const { x, y, type } = step;
      if (type === 'path') {
        pathFound = true;
        pathLength++;
      }

      const node = document.getElementById(`node-${x}-${y}`);
      if (node && node.getAttribute('fill') !== '#1a1a1a') {
        if (type === 'path') {
          node.setAttribute('fill', '#9c9c9cff');

          const svg = node.closest('svg');
          if (svg) {
            const rectX = parseFloat(node.getAttribute('x') || '0');
            const rectY = parseFloat(node.getAttribute('y') || '0');
            const size = parseFloat(node.getAttribute('width') || '0');
            const cx = rectX + size / 2;
            const cy = rectY + size / 2;

            const isStart = x === startNode.x && y === startNode.y;
            const isEnd = x === endNode.x && y === endNode.y;

            if (!isStart && !isEnd) {
              const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              circle.setAttribute('cx', cx.toString());
              circle.setAttribute('cy', cy.toString());
              circle.setAttribute('r', (size / 6).toString());
              circle.setAttribute('fill', '#1a1a1a');
              circle.classList.add('path-extra-element');

              const foreign = svg.querySelector('foreignObject');
              if (foreign) svg.insertBefore(circle, foreign);
              else svg.appendChild(circle);
            }
          }

        } else {
          node.setAttribute('fill', '#9c9c9cff');
        }
        node.style.transitionDelay = '0ms';
      }
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);

    if (pathFound) {
      setResultAlert({
        variant: 'success',
        title: 'PATH FOUND',
        description: `Minimum Distance: ${pathLength} nodes • Time: ${duration}s`,
      });
    } else if (!stopRequested.current) {
      setResultAlert({
        variant: 'error',
        title: 'NO SOLUTION',
        description: 'No valid path exists between start and end nodes.',
      });
    }

    setIsRunning(false);
  };

  const resetGrid = () => {
    stopRequested.current = true;
    setIsRunning(false);

    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        const node = document.getElementById(`node-${x}-${y}`);
        if (node) {
          node.setAttribute('fill', 'transparent');
          node.style.transitionDelay = '0ms';
        }
      }
    }
    // Limpiar también los puntos nativos del camino
    document.querySelectorAll('.path-extra-element').forEach(el => el.remove());
  };

  const generateMaze = async () => {
    if (isRunning) return;
    if (selectedMazeAlgo === 'none') {
      setResultAlert({
        variant: 'warning',
        title: 'ALGORITHM REQUIRED',
        description: 'Please select a maze generation algorithm in the toolbar before starting the generation.',
      });
      resetGrid();
      return;
    }

    setIsRunning(true);
    stopRequested.current = false;
    clearPath();

    // 1. Llenamos toda la cuadrícula de MUROS
    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        const node = document.getElementById(`node-${x}-${y}`);
        if (node && !(x === startNode.x && y === startNode.y) && !(x === endNode.x && y === endNode.y)) {
          node.setAttribute('fill', '#1a1a1a');
          node.style.transitionDelay = '0ms';
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    const algo = MAZE_ALGORITHMS[selectedMazeAlgo];
    if (!algo || !algo.isImplemented) {
      setResultAlert({
        variant: 'error',
        title: 'NOT IMPLEMENTED',
        description: 'This maze algorithm is currently under development.',
      });
      setIsRunning(false);
      return;
    }

    const generator = algo.execute(gridSize.rows, gridSize.cols);

    let stepCount = 0;

    for (const step of generator) {
      if (stopRequested.current) break;

      const { x, y, type } = step;
      const node = document.getElementById(`node-${x}-${y}`);
      if (node && !(x === startNode.x && y === startNode.y) && !(x === endNode.x && y === endNode.y)) {
        if (type === 'air') {
          node.setAttribute('fill', 'transparent');
        } else if (type === 'wall') {
          node.setAttribute('fill', '#1a1a1a');
        }
        node.style.transitionDelay = '0ms';
      }

      stepCount++;
      if (speed < 5) {
        if (stepCount % 5 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      } else {
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    setIsRunning(false);
  };

  const stopExecution = () => {
    stopRequested.current = true;
  };

  return (
    <div className= "page-container" >
    {/* Visualizer Section: Exactly 100vh minus navbar (approx 65px) */ }
    < div className = "visualizer-container" >
      <PathfindingToolbar
          isRunning={ isRunning }
  speed = { speed }
  onSpeedChange = { setSpeed }
  onRun = { runAlgorithm }
  onStop = { stopExecution }
  onReset = { resetGrid }
  onGenerate = { generateMaze }
  pathAlgorithms = { PATHFINDING_ALGORITHMS }
  selectedPathAlgo = { selectedPathAlgo }
  onPathAlgoChange = { setSelectedPathAlgo }
  mazeAlgorithms = { MAZE_ALGORITHMS }
  selectedMazeAlgo = { selectedMazeAlgo }
  onMazeAlgoChange = { setSelectedMazeAlgo }
    />

    {/* Grid Container */ }

    < div
  ref = { containerRef }
  className = "relative flex-grow w-full overflow-hidden bg-crema flex flex-col items-center justify-start"
    >
  {
    gridSize.rows > 0 && (
      <Grid
              rows={ gridSize.rows }
  cols = { gridSize.cols }
  cellSize = { gridSize.cellSize }
  startNode = { startNode }
  endNode = { endNode }
  onInteraction = { handleInteraction }
  onNodeDragStart = { handleNodeDragStart }
    />
          )}

<div className="floating-badge" >
  Drag Start / End • Click to draw walls • Scroll down for Info ↓
</div>
  </div>
  </div>

{/* Info Section */ }
<section className="info-section" >
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-stretch" >
    {/* Generation Algorithm Column */ }
    < div className = "flex-1" >
      <AlgorithmInfo
              title={ MAZE_ALGORITHMS[selectedMazeAlgo]?.name || 'Generation Algorithm' }
description = { MAZE_ALGORITHMS[selectedMazeAlgo]?.description || 'Select a maze generation algorithm in the toolbar.' }
characteristics = { MAZE_ALGORITHMS[selectedMazeAlgo]?.characteristics || [] }
applications = { MAZE_ALGORITHMS[selectedMazeAlgo]?.applications || [] }
pseudocode = { MAZE_ALGORITHMS[selectedMazeAlgo]?.pseudocode || '' }
pseudocodeLegend = { MAZE_ALGORITHMS[selectedMazeAlgo]?.pseudocodeLegend || {} }
  />
  </div>

  < div className = "hidden lg:block w-[1px] bg-carbon/20 my-16" > </div>

{/* Resolution Algorithm Column */ }
<div className="flex-1" >
  <AlgorithmInfo
              title={ PATHFINDING_ALGORITHMS[selectedPathAlgo]?.name || 'Resolution Algorithm' }
description = { PATHFINDING_ALGORITHMS[selectedPathAlgo]?.description || 'Select a pathfinding algorithm in the toolbar.' }
characteristics = { PATHFINDING_ALGORITHMS[selectedPathAlgo]?.characteristics || [] }
applications = { PATHFINDING_ALGORITHMS[selectedPathAlgo]?.applications || [] }
pseudocode = { PATHFINDING_ALGORITHMS[selectedPathAlgo]?.pseudocode || '' }
pseudocodeLegend = { PATHFINDING_ALGORITHMS[selectedPathAlgo]?.pseudocodeLegend || {} }
  />
  </div>
  </div>
  </section>

  < Modal isOpen = {!!resultAlert} onClose = {() => setResultAlert(null)}>
    { resultAlert && (
      <Alert 
            variant={ resultAlert.variant }
title = { resultAlert.title }
description = { resultAlert.description }
onClose = {() => setResultAlert(null)}
          />
        )}
</Modal>
  </div>
  );
};