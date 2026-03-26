import type { MazeStep } from './index';

export const binaryTreeMetadata = {
  id: 'binary',
  name: 'Binary Tree',
  description: 'The Binary Tree algorithm is one of the simplest and most asymmetric deterministic maze generation algorithms. It works by traversing the grid mechanically from one end to the other, like a "matrix printer", choosing at each step to knock down only one wall out of two given options (usually North or West).\n\nThis rigid structural commitment and manufacturing bias inevitably gives rise to an unmistakable topology: mazes that always have two completely unpopulated perimeter edges, leaving an immense and flat continuous corridor in the shape of an "L" along the preferred axes.',
  characteristics: [
    'Extremely fast, almost instantaneous O(N*M) sequential iteration.',
    'Generates a very strong diagonal bias (the NW/SE corners are not visually connected).',
    'Always generates a boring uninterrupted corridor along the North and West edges.'
  ],
  applications: [
    'Fast emergency algorithm or very low computational cost.',
    'Generation of playable maps that expressly require a "safe" and continuous area on the borders.'
  ],
  pseudocode: `For each cell in the Maze:
  Options = []
  If it has a North neighbor: Add 'North' to Options
  If it has a West neighbor: Add 'West' to Options
  
  If Options is not empty:
    Dir = Choose randomly from Options
    Break the wall in Dir`,
  pseudocodeLegend: {
    'Cell': 'Each square of the iterative and methodical sweep that traverses the grid jealously without ever backtracking.',
    'Options': 'The implacable and randomized dichotomy (coin toss) that the algorithm decides between the two allowed boundaries.',
    'Wall': 'The solid structure that, if knocked down in the chosen direction, will visually and physically connect both tiles.'
  },
  isImplemented: true
};

export function* binaryTree(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  // Empezar limpiando celdas y rompiendo muros aleatoriamente
  for (let r = 1; r < rows - 1; r += 2) {
    for (let c = 1; c < cols - 1; c += 2) {
      // 1. Excavamos la "habitación" base actual
      yield { x: c, y: r, type: 'air' };

      const options = [];
      // 2. Si no estamos pegados a la pared norte, podemos romper hacia arriba
      if (r > 1) options.push('N');
      // 3. Si no estamos pegados a la pared oeste, podemos romper hacia la izquierda
      if (c > 1) options.push('W');

      if (options.length > 0) {
        const dir = options[Math.floor(Math.random() * options.length)];
        if (dir === 'N') {
          // Rompemos el muro de arriba
          yield { x: c, y: r - 1, type: 'air' };
        } else if (dir === 'W') {
          // Rompemos el muro de la izquierda
          yield { x: c - 1, y: r, type: 'air' };
        }
      }
    }
  }
}
