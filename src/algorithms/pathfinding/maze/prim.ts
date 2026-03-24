import type { MazeStep } from './index';

export const primMetadata = {
  id: 'prim',
  name: "Prim's Algorithm",
  description: 'Crece orgánicamente como un cristal de hielo desde un punto inicial. Forma un laberinto estilo "telaraña" con muchísimos caminos cortos o callejones sin salida rápidos, muy fácil de resolver a simple vista.',
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
