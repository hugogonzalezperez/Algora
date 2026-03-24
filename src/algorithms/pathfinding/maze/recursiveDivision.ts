import type { MazeStep } from './index';

export const recursiveDivisionMetadata = {
  id: 'recursiveDivision',
  name: 'Recursive Division',
  description: 'Arquitectura fractal pura. Comienza vaciando toda la sala y va levantando gigantescos muros divisorios con una sola puerta, subdividiendo una y otra vez.',
  isImplemented: true
};

export function* recursiveDivision(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  // 1. Vaciar toda la cuadrícula (excepto los marcos exteriores)
  // Como en la UI el botón "Generar" pone la pantalla en negro (todo muro),
  // esta animación de "limpieza" inicial queda espectacular.
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      yield { x: c, y: r, type: 'air' };
    }
  }

  // 2. Función recursiva para subdividir espacios vacíos
  function* divide(
    rStart: number, rEnd: number, // bounds exclusive
    cStart: number, cEnd: number,
    orientation: 'H' | 'V'
  ): Generator<MazeStep, void, unknown> {
    const width = cEnd - cStart;
    const height = rEnd - rStart;

    // Si el espacio es muy pequeño, dejamos de subdividir
    if (width < 2 || height < 2) return;

    if (orientation === 'H') {
      // Queremos dibujar un muro en una fila PAR.
      const possibleRows = [];
      for (let i = rStart; i < rEnd; i++) {
        if (i % 2 === 0) possibleRows.push(i);
      }
      if (possibleRows.length === 0) return;

      const wallR = possibleRows[Math.floor(Math.random() * possibleRows.length)];

      // Queremos que la "puerta" (agujero) caiga en una columna IMPAR.
      const possibleDoors = [];
      for (let i = cStart; i < cEnd; i++) {
        if (i % 2 !== 0) possibleDoors.push(i);
      }
      const doorC = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

      // Levantar el muro de izquierda a derecha saltándonos la puerta
      for (let c = cStart; c < cEnd; c++) {
        if (c !== doorC) {
          yield { x: c, y: wallR, type: 'wall' };
        }
      }

      // Llamada recursiva para la sub-sección de arriba y la de abajo
      yield* divide(rStart, wallR, cStart, cEnd, chooseOrientation(cEnd - cStart, wallR - rStart));
      yield* divide(wallR + 1, rEnd, cStart, cEnd, chooseOrientation(cEnd - cStart, rEnd - (wallR + 1)));

    } else {
      // Orientación Vertical
      const possibleCols = [];
      for (let i = cStart; i < cEnd; i++) {
        if (i % 2 === 0) possibleCols.push(i);
      }
      if (possibleCols.length === 0) return;

      const wallC = possibleCols[Math.floor(Math.random() * possibleCols.length)];

      const possibleDoors = [];
      for (let i = rStart; i < rEnd; i++) {
        if (i % 2 !== 0) possibleDoors.push(i);
      }
      const doorR = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

      // Levantar el muro de arriba a abajo saltándonos la puerta
      for (let r = rStart; r < rEnd; r++) {
        if (r !== doorR) {
          yield { x: wallC, y: r, type: 'wall' };
        }
      }

      // Llamada recursiva para la izquierda y la derecha
      yield* divide(rStart, rEnd, cStart, wallC, chooseOrientation(wallC - cStart, rEnd - rStart));
      yield* divide(rStart, rEnd, wallC + 1, cEnd, chooseOrientation(cEnd - (wallC + 1), rEnd - rStart));
    }
  }

  // Determinar si dividimos horizontal o verticalmente según las proporciones de la sala
  function chooseOrientation(w: number, h: number): 'H' | 'V' {
    if (w < h) return 'H';      // Sala más alta -> partir en horizontal
    if (h < w) return 'V';      // Sala más ancha -> partir en vertical
    return Math.random() < 0.5 ? 'H' : 'V'; // Cuadrada -> decidir al azar
  }

  // Arrancamos la fiesta en toda la cámara disponible (dejando marco exterior en 0 y rows-1 / cols-1)
  yield* divide(1, rows - 1, 1, cols - 1, chooseOrientation(cols - 2, rows - 2));
}
