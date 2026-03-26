import { useState, useCallback, useEffect, useRef } from 'react';
import { PathfindingToolbar } from '../features/pathfinding/components/PathfindingToolbar';
import { PathfindingCanvas } from '../features/pathfinding/components/PathfindingCanvas';
import { PATHFINDING_METADATA } from '../features/pathfinding/algorithms/index.ts';
import { MAZE_ALGORITHMS } from '../features/pathfinding/algorithms/maze/index.ts';
import { usePathfindingAnimation } from '../features/pathfinding/hooks/usePathfindingAnimation';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';

const TARGET_CELL_SIZE = 24;

export const PathfindingPage = () => {
    const [gridSize, setGridSize] = useState({ rows: 25, cols: 50, cellSize: { x: TARGET_CELL_SIZE, y: TARGET_CELL_SIZE } });
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMazeAlgo, setSelectedMazeAlgo] = useState('none');
    const [activeAlgorithmId, setActiveAlgorithmId] = useState('none');
    const [speed, setSpeed] = useState(50);
    const [resultAlert, setResultAlert] = useState<{ 
        variant: 'info' | 'error' | 'success' | 'warning';
        title: string;
        description: string; 
    } | null>(null);

    const {
        startNode,
        endNode,
        isRunning,
        handleRun,
        handleStop,
        handleReset,
        handleToggleWall,
        handleClearWallAt,
        handleSetStart,
        handleSetEnd,
        handleGenerateMaze,
    } = usePathfindingAnimation(activeAlgorithmId, speed, gridSize.rows, gridSize.cols, setResultAlert);

    const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null);

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
            handleReset(); // Always reset on resize to prevent algorithm out-of-bounds crashes
        }
    }, [handleReset]);

    useEffect(() => {
        const timeout = setTimeout(calculateGridSize, 100);
        window.addEventListener('resize', calculateGridSize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', calculateGridSize);
        };
    }, [calculateGridSize]);

    const prevDraggingNode = useRef<'start' | 'end' | null>(null);

    useEffect(() => {
        if (prevDraggingNode.current !== null && draggingNode === null) {
            if (prevDraggingNode.current === 'start') {
                handleClearWallAt(startNode.x, startNode.y);
            } else if (prevDraggingNode.current === 'end') {
                handleClearWallAt(endNode.x, endNode.y);
            }
        }
        prevDraggingNode.current = draggingNode;
    }, [draggingNode, startNode, endNode, handleClearWallAt]);

    const activePathMetadata = PATHFINDING_METADATA[activeAlgorithmId] || PATHFINDING_METADATA.none;
    const activeMazeMetadata = MAZE_ALGORITHMS[selectedMazeAlgo] || MAZE_ALGORITHMS.none;

    const onRun = async () => {
        if (activeAlgorithmId === 'none') {
            setResultAlert({
                variant: 'warning',
                title: 'ALGORITHM REQUIRED',
                description: 'Please select a pathfinding algorithm in the toolbar before starting the execution.',
            });
            return;
        }
        await handleRun();
    };

    const onGenerate = () => {
        if (selectedMazeAlgo === 'none') {
            setResultAlert({
                variant: 'warning',
                title: 'ALGORITHM REQUIRED',
                description: 'Please select a maze generation algorithm in the toolbar before starting the generation.',
            });
            return;
        }
        handleGenerateMaze(selectedMazeAlgo);
    };

    return (
        <div className="page-container min-h-screen bg-crema flex flex-col font-mono">
            {/* Visualizer Area */}
            <div className="h-[calc(100vh-65px)] flex flex-col border-b border-sepia">
                <PathfindingToolbar
                    isRunning={isRunning}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    onRun={onRun}
                    onStop={handleStop}
                    onReset={handleReset}
                    onGenerate={onGenerate}
                    pathAlgorithms={PATHFINDING_METADATA}
                    selectedPathAlgo={activeAlgorithmId}
                    onPathAlgoChange={setActiveAlgorithmId}
                    mazeAlgorithms={MAZE_ALGORITHMS}
                    selectedMazeAlgo={selectedMazeAlgo}
                    onMazeAlgoChange={setSelectedMazeAlgo}
                />

                <div
                    ref={containerRef}
                    className="relative flex-grow w-full overflow-hidden bg-crema flex flex-col items-center justify-start"
                >
                    {gridSize.rows > 0 && (
                        <PathfindingCanvas
                            rows={gridSize.rows}
                            cols={gridSize.cols}
                            cellSize={gridSize.cellSize}
                            startNode={startNode}
                            endNode={endNode}
                            onInteraction={(x: number, y: number, isHover: boolean) => {
                                if (draggingNode === 'start') handleSetStart(x, y);
                                else if (draggingNode === 'end') handleSetEnd(x, y);
                                else if (!isHover || window.isDragging) handleToggleWall(x, y);
                            }}
                            onNodeDragStart={setDraggingNode}
                        />
                    )}

                    <div className="floating-badge">
                        Drag Start/End • Click to draw walls • Scroll down for Info ↓
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div className="bg-crema p-16 md:p-32 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40">
                    <section className="space-y-8">
                        <header className="space-y-3">
                           <h2 className="text-4xl lg:text-5xl font-black text-carbon tracking-tighter uppercase">{activeMazeMetadata.name}</h2>
                           <div className="w-16 h-1 bg-carbon/10" />
                        </header>
                        <p className="text-[15px] text-justify text-carbon/70 leading-relaxed font-medium">
                            {activeMazeMetadata.description}
                        </p>
                    </section>

                    <section className="space-y-8">
                        <header className="space-y-3">
                            <h2 className="text-4xl lg:text-5xl font-black text-carbon tracking-tighter uppercase">{activePathMetadata.name}</h2>
                            <div className="w-16 h-1 bg-carbon/10" />
                        </header>
                        <p className="text-[15px] text-justify text-carbon/70 leading-relaxed font-medium">
                            {activePathMetadata.description}
                        </p>
                    </section>
                </div>
            </div>

            <Modal isOpen={!!resultAlert} onClose={() => setResultAlert(null)}>
                {resultAlert && (
                    <Alert
                        variant={resultAlert.variant}
                        title={resultAlert.title}
                        description={resultAlert.description}
                        onClose={() => setResultAlert(null)}
                    />
                )}
            </Modal>
        </div>
    );
};
PathfindingPage.displayName = 'PathfindingPage';
