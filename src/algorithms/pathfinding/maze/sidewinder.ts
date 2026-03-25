import type { MazeStep } from './index';

export const sidewinderMetadata = {
  id: 'sidewinder',
  name: 'Sidewinder',
  description: 'The exploratory algorithm Sidewinder ("Rattlesnake" or front-slipping snake) is a remarkable and curious refined evolution of the boring Binary Tree. It remains insultingly and impossibly fast but solves a large part of its asymmetric predictable deterministic design by capriciously grouping lateral galleries of variable extension before drilling vertically.\n\nLike its ancestor, it advances relentlessly row by row from top to bottom. As it progresses, it groups its updated cells into a "Current Sequence" streak. At each tiny lateral step (East), it randomly decides whether to continue fattening the immense horizontal corridor to the right... or if it irremediably "cuts the streak" by drilling intemperately North (Up) from the bottom or seno of a random node of the previously accumulated group. With this, it breaks the undesirable free North corridor of the original Binary Tree.',
  characteristics: [
    'Forges organic mazes furrowed with enormous and striated horizontal passages grouped agglutinated asymmetrically.',
    'It lacks almost any deep bifurcation in the central axis, losing a bit of ambush complexity.',
    'Despite being asymmetric, it looks surprisingly natural in top-down view and is very fast (Generation O(N)).'
  ],
  applications: [
    'Ultra-fast creation of mazes on the fly at 60 fps (generation striated in raster scan line).',
    'Rhythmic "tubular" and "hyper striated" levels that prioritize frenetic guided exploration predominant in a single wide lateral axis.'
  ],
  pseudocode: `For each Row from left to right:
  For each Cell:
    Add Cell to Current Run
    If at East edge or Random decision (and not at North boundary):
      Choose a random cell from Current Run
      Break the wall towards the North (Up)
      Clear Current Run
    Else:
      Break the wall towards the East (Right)`,
  pseudocodeLegend: {
    'Current Run': 'A temporary set of cells in the current row. One of these will eventually be chosen to link upwards to the previous row.',
    'Random or East': 'A decision point where the algorithm either continues the horizontal corridor or terminates the run by carving a northern passage.',
    'Break North': 'The act of connecting the current sequence to the row above, ensuring the maze remains perfectly connected.'
  },
  isImplemented: true
};

export function* sidewinder(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  // Filas impares
  for (let r = 1; r < rows - 1; r += 2) {
    let run: {r: number, c: number}[] = [];
    
    // Columnas impares
    for (let c = 1; c < cols - 1; c += 2) {
      yield { x: c, y: r, type: 'air' }; // Excava celda actual
      run.push({r, c});
      
      // Chequeamos si estamos en un borde real
      const atEasternBoundary = (c >= cols - 3);
      const atNorthernBoundary = (r === 1);
      
      // Cerramos el grupo actual y excavamos hacia arriba, O continuamos a la derecha
      const shouldCloseOut = atEasternBoundary || (!atNorthernBoundary && Math.random() < 0.5);
      
      if (shouldCloseOut) {
        if (!atNorthernBoundary) {
          // Si no estamos en el techo, pillamos una celda al azar de todo este grupo y rompemos hacia arriba
          const member = run[Math.floor(Math.random() * run.length)];
          yield { x: member.c, y: member.r - 1, type: 'air' };
        }
        run = []; // Vaciamos y empezamos un nuevo grupo
      } else {
        // En lugar de cerrar, rompemos hacia la derecha y expandimos grupo
        yield { x: c + 1, y: r, type: 'air' };
      }
    }
  }
}
