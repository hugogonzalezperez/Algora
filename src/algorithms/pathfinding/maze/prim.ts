import type { MazeStep } from './index';

export const primMetadata = {
  id: 'prim',
  name: "Prim's Algorithm",
  description: 'The modified Prim\'s Algorithm for carving orthogonal mazes is a superb stochastic adaptation of the classic mathematical graph algorithm. Unlike the serpentine labyrinthine shapes of DFS, Prim generates lush, profusely branched, and organically textured mazes, as if it were a growing ice crystal or a cellular mycelium.\n\nIt begins at a random position and relentlessly adds the thick unexplored boundary walls to an active expansive "Frontier". In each iteration, it completely randomly selects a perimeter wall from that large containment bag and breaks it, joining the clear cell with the unexplored one on the other side of the wall, giving rise to a vast network of capillary passages and abundant quick dead ends.',
  characteristics: [
    'Produces mazes with a large number of small nooks and tunnels (high branching factor).',
    'The random options in the immense list of walls give it a uniform, crystallized, and very organic visual texture.',
    'It is a "Perfect" maze (without isolated islets or loops), but it requires maintaining a gigantic set in memory.'
  ],
  applications: [
    'Intricate aesthetic of branched caves or ant tunnels.',
    'Generation of dense tactical maps where the player must explore room by room without getting too lost in corridors.'
  ],
  pseudocode: `Mark Start and add neighbors to the "Frontier"
While Frontier is not empty:
  C = Choose a cell from Frontier randomly
  Connect C with an already Visited neighbor (random if there are several)
  Mark C as Visited
  Add new neighbors of C to the Frontier`,
  pseudocodeLegend: {
    'Frontier': 'The set of all wall segments that separate the visited part of the grid from the unvisited part.',
    'Randomly': 'The choice made at each step to pick a wall from the frontier, which gives the maze its organic, crystalline growth pattern.',
    'Connect': 'The manual act of removing a wall between a chosen frontier cell and the established maze.'
  },
  isImplemented: true
};

export function* prim(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  const visited = new Set<string>();
  const frontier: {r: number, c: number, dr: number, dc: number}[] = [];
  
  // Start at top-left
  visited.add(`1,1`);
  yield { x: 1, y: 1, type: 'air' };
  
  const addFrontier = (r: number, c: number) => {
    if (r > 2 && !visited.has(`${r-2},${c}`)) frontier.push({r, c, dr: -1, dc: 0});
    if (r < rows - 3 && !visited.has(`${r+2},${c}`)) frontier.push({r, c, dr: 1, dc: 0});
    if (c > 2 && !visited.has(`${r},${c-2}`)) frontier.push({r, c, dr: 0, dc: -1});
    if (c < cols - 3 && !visited.has(`${r},${c+2}`)) frontier.push({r, c, dr: 0, dc: 1});
  };
  
  addFrontier(1, 1);
  
  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const wall = frontier.splice(idx, 1)[0]; // Saca uno al azar
    
    // The cell beyond the wall:
    const nr = wall.r + wall.dr * 2;
    const nc = wall.c + wall.dc * 2;
    
    if (!visited.has(`${nr},${nc}`)) {
      visited.add(`${nr},${nc}`);
      // Break the wall and the new cell
      yield { x: wall.c + wall.dc, y: wall.r + wall.dr, type: 'air' };
      yield { x: nc, y: nr, type: 'air' };
      addFrontier(nr, nc);
    }
  }
}
