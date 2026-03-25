import type { MazeStep } from './index';

export const recursiveDFSMetadata = {
  id: 'recursive',
  name: 'Recursive DFS (Backtracker)',
  description: 'Recursive DFS or "Backtracker" is the most famous and emblematic algorithm for sculpting and designing a worthy and complex procedural maze. It works by tirelessly and continuously perforating winding galleries in random cardinal directions, digging through solid walls like a stubborn worm.\n\nWhen it inevitably enters a dead end from which there are no unvisited walls to break through, it resorts to what is mathematically known as "Backtracking". This means retracing its steps by iteratively rewinding its own memory Stack until it finds a node or intersection where there is a free neighbor pending, and thus continue perforating.',
  characteristics: [
    'Generates long and very tortuous passages (commonly called "River tendency").',
    'It is a "Perfect" maze (without cycles or unreachable islets).',
    'Easy implementation with Stack, but with a clear serpentine bias and few dead ends.'
  ],
  applications: [
    'Traditional printed games of solving mazes with a pencil from entrance to exit.',
    'Classic, organic, and demanding procedural generation for dungeon games.'
  ],
  pseudocode: `Mark the initial cell as visited and add it to the Stack
While the Stack is not empty:
  Current = Top of the Stack
  If Current has unvisited Neighbors:
    V = Choose a random Neighbor
    Break the Wall between Current and V
    Mark V as visited and add it to the Stack
  Else:
    Pop Current from the Stack`,
  pseudocodeLegend: {
    'Visit': 'The action of marking a cell as processed so the algorithm doesn\'t create loops or revisit it.',
    'Wall': 'The initial solid barrier between cells that the algorithm "carves" through to create passages.',
    'Neighbor': 'An adjacent cell in one of the four cardinal directions (North, South, East, West).',
    'Stack': 'A LIFO structure used to store the path and allow the algorithm to backtrack when it reaches a dead end.'
  },
  isImplemented: true
};

export function* recursiveDFS(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  const visited = new Set<string>();
  const stack: {r: number, c: number}[] = [];

  // Empezamos en un nodo impar superior-izquierdo para respetar unos "muros" exteriores si encajan.
  const startR = 1;
  const startC = 1;
  
  stack.push({r: startR, c: startC});
  visited.add(`${startR},${startC}`);
  yield { x: startC, y: startR, type: 'air' };

  while(stack.length > 0) {
    const current = stack[stack.length - 1];

    const dirs = [
      { dr: -2, dc: 0 },
      { dr: 2, dc: 0 },
      { dr: 0, dc: -2 },
      { dr: 0, dc: 2 }
    ];
    
    // Barajar direcciones (Shuffle Fisher-Yates) para recorrido aleatorio
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }

    let found = false;
    for (const dir of dirs) {
      const nr = current.r + dir.dr;
      const nc = current.c + dir.dc;
      
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        
        const wallR = current.r + dir.dr / 2;
        const wallC = current.c + dir.dc / 2;
        
        // Rompemos el muro intermedio y avanzamos a la siguiente celda
        yield { x: wallC, y: wallR, type: 'air' };
        yield { x: nc, y: nr, type: 'air' };
        
        stack.push({r: nr, c: nc});
        found = true;
        break;
      }
    }

    if (!found) {
      stack.pop();
    }
  }
}
