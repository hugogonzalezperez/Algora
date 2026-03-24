import type { MazeStep } from './index';

export const binaryTreeMetadata = {
  id: 'binary',
  name: 'Binary Tree',
  description: 'Un algoritmo extremadamente rápido e imperfecto. Traza paredes masivas diagonales y siempre garantiza al menos dos pasillos rectos enteros en los bordes Norte y Oeste.',
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
