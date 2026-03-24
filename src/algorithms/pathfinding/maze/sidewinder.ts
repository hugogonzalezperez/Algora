import type { MazeStep } from './index';

export const sidewinderMetadata = {
  id: 'sidewinder',
  name: 'Sidewinder',
  description: 'Un algoritmo muy rápido que genera pasillos horizontales y los conecta hacia el techo de forma impredecible. Rompe un poco el sesgo puro del Binary Tree.',
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
