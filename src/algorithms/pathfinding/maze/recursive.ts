import type { MazeStep } from './index';

export const recursiveDFSMetadata = {
  id: 'recursive',
  name: 'Recursive DFS (Backtracker)',
  description: 'Genera un laberinto "perfecto" (sin bucles) perforando muros en trayectorias tortuosas aleatorias.',
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
