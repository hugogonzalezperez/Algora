import { useState, useCallback, useRef } from 'react';
import { PATHFINDING_METADATA } from '../algorithms';
import { MAZE_ALGORITHMS } from '../algorithms/maze';

const createEmptyGrid = (rows: number, cols: number) => 
    Array.from({ length: rows }, () => Array(cols).fill(false));

export const usePathfindingAnimation = (
  algorithmId: string,
  speed: number,
  rows: number,
  cols: number,
  onResult?: (result: { variant: 'success' | 'error'; title: string; description: string }) => void
) => {
  const [grid, setGrid] = useState<boolean[][]>(createEmptyGrid(rows, cols));
  const [startNode, setStartNode] = useState({ x: 5, y: 10 });
  const [endNode, setEndNode] = useState({ x: cols - 6, y: 10 });
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Drag Start/End • Click to draw walls • Scroll down for Info ↓');
  
  const timerRef = useRef<any>(null);
  const stopRequested = useRef(false);

  const clearVisualPath = useCallback(() => {
    const nodes = document.querySelectorAll('rect[id^="node-"]');
    nodes.forEach(n => {
        const fill = (n as any).style.fill;
        if (fill !== 'rgb(26, 26, 26)' && fill !== '#1a1a1a') {
            (n as any).style.fill = 'transparent';
        }
    });
    document.querySelectorAll('.path-marker').forEach(el => el.remove());
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    
    const algorithm = PATHFINDING_METADATA[algorithmId];
    if (!algorithm || !algorithm.execute) return;

    setIsRunning(true);
    stopRequested.current = false;
    clearVisualPath();
    setStatusMessage(`Resolving: ${algorithm.name}...`);

    const startTime = performance.now();
    let pathLength = 0;
    let pathFound = false;

    const generator = algorithm.execute(grid, startNode, endNode, rows, cols);
    
    const animate = () => {
      if (stopRequested.current) {
          setIsRunning(false);
          setStatusMessage('Execution stopped');
          return;
      }

      const { value, done } = generator.next();
      
      if (done) {
        setIsRunning(false);
        const duration = ((performance.now() - startTime) / 1000).toFixed(2);
        if (pathFound) {
            setStatusMessage(`Path Found: Distance ${pathLength} • Time ${duration}s`);
            onResult?.({
                variant: 'success',
                title: 'PATH FOUND',
                description: `Minimum Distance: ${pathLength} nodes • Time: ${duration}s`,
            });
        } else {
            setStatusMessage('No path found');
            onResult?.({
                variant: 'error',
                title: 'NO SOLUTION',
                description: 'No valid path exists between start and end nodes.',
            });
        }
        return;
      }

      if (value) {
        const { x, y, type } = value;
        const node = document.getElementById(`node-${x}-${y}`);
        if (node && type) {
          if (type === 'visited') {
              node.style.fill = '#9c9c9cff'; // Same as path
          }
          if (type === 'path') {
            pathFound = true;
            pathLength++;
            node.style.fill = '#9c9c9cff';
            
            // Draw path circle
            const svg = node.closest('svg');
            if (svg) {
                const rectX = parseFloat(node.getAttribute('x') || '0');
                const rectY = parseFloat(node.getAttribute('y') || '0');
                const width = parseFloat(node.getAttribute('width') || '0');
                
                const isStart = parseInt(node.id.split('-')[1]) === (startNode?.x ?? -1) && parseInt(node.id.split('-')[2]) === (startNode?.y ?? -1);
                const isEnd   = parseInt(node.id.split('-')[1]) === (endNode?.x   ?? -1) && parseInt(node.id.split('-')[2]) === (endNode?.y   ?? -1);

                if (!isStart && !isEnd) {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', (rectX + width/2).toString());
                    circle.setAttribute('cy', (rectY + width/2).toString());
                    circle.setAttribute('r', (width/6).toString());
                    circle.setAttribute('fill', '#1a1a1a');
                    circle.setAttribute('class', 'path-marker');
                    const foreign = svg.querySelector('foreignObject');
                    if (foreign) svg.insertBefore(circle, foreign);
                    else svg.appendChild(circle);
                }
            }
          }
        }
      }

      timerRef.current = setTimeout(animate, speed);
    };

    animate();
  }, [algorithmId, grid, isRunning, speed, startNode, endNode, rows, cols, clearVisualPath]);

  const handleReset = useCallback(() => {
    stopRequested.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setGrid(createEmptyGrid(rows, cols));
    setStatusMessage('Grid cleared');
    
    const nodes = document.querySelectorAll('rect[id^="node-"]');
    nodes.forEach(n => ((n as any).style.fill = 'transparent'));
    document.querySelectorAll('.path-marker').forEach(el => el.remove());
  }, [rows, cols]);

  const handleStop = useCallback(() => {
    stopRequested.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setStatusMessage('Execution stopped');
  }, []);

  const handleToggleWall = useCallback((x: number, y: number) => {
    if (isRunning) return;
    if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) return;

    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[y][x] = !newGrid[y][x];
      
      const node = document.getElementById(`node-${x}-${y}`);
      if (node) {
        (node as any).style.fill = newGrid[y][x] ? '#1a1a1a' : 'transparent';
      }
      return newGrid;
    });
    clearVisualPath();
  }, [isRunning, startNode, endNode, clearVisualPath]);

  const handleClearWallAt = useCallback((x: number, y: number) => {
    if (isRunning || !grid[y]?.[x]) return; // Only do something if there's a wall here
    
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[y][x] = false;
      return newGrid;
    });
    
    const node = document.getElementById(`node-${x}-${y}`);
    if (node) (node as any).style.fill = 'transparent';
  }, [isRunning, grid]);

  const handleSetStart = useCallback((x: number, y: number) => {
    if (isRunning) return;
    if (x === endNode.x && y === endNode.y) return;
    
    setStartNode({ x, y });
    clearVisualPath();
  }, [isRunning, endNode, clearVisualPath]);

  const handleSetEnd = useCallback((x: number, y: number) => {
    if (isRunning) return;
    if (x === startNode.x && y === startNode.y) return;

    setEndNode({ x, y });
    clearVisualPath();
  }, [isRunning, startNode, clearVisualPath]);

  const handleGenerateMaze = useCallback((mazeId: string) => {
    if (isRunning) return;
    handleReset();
    
    const algorithm = MAZE_ALGORITHMS[mazeId];
    if (!algorithm || !algorithm.execute) return;

    setStatusMessage(`Generating: ${algorithm.name}...`);
    setIsRunning(true);
    stopRequested.current = false;

    // Pre-fill walls visual
    const nodes = document.querySelectorAll('rect[id^="node-"]');
    nodes.forEach(n => {
        const id = n.id;
        const [_, xStr, yStr] = id.split('-');
        const x = parseInt(xStr);
        const y = parseInt(yStr);
        if (!((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y))) {
            (n as any).style.fill = '#1a1a1a';
        }
    });

    const generator = algorithm.execute(rows, cols);
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(true));
    if (newGrid[startNode.y] && newGrid[startNode.y][startNode.x] !== undefined) newGrid[startNode.y][startNode.x] = false;
    if (newGrid[endNode.y] && newGrid[endNode.y][endNode.x] !== undefined) newGrid[endNode.y][endNode.x] = false;

    const animateMaze = () => {
      if (stopRequested.current) {
          setIsRunning(false);
          return;
      }

      const { value, done } = generator.next();
      
      if (done) {
        setGrid(newGrid);
        setIsRunning(false);
        setStatusMessage('Maze generated');
        return;
      }

      if (value) {
        const { x, y, type } = value;
        if (!((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y))) {
            newGrid[y][x] = type === 'wall';
            const node = document.getElementById(`node-${x}-${y}`);
            if (node) {
                (node as any).style.fill = type === 'wall' ? '#1a1a1a' : 'transparent';
            }
        }
      }

      timerRef.current = setTimeout(animateMaze, 2);
    };

    setTimeout(animateMaze, 10);
  }, [handleReset, isRunning, rows, cols, startNode, endNode]);

  return {
    grid,
    startNode,
    endNode,
    isRunning,
    statusMessage,
    handleRun,
    handleStop,
    handleReset,
    handleToggleWall,
    handleClearWallAt,
    handleSetStart,
    handleSetEnd,
    handleGenerateMaze,
  };
};
