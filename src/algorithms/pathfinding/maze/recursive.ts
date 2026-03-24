import type { MazeStep } from './index';

export const recursiveDFSMetadata = {
  id: 'recursive',
  name: 'Recursive DFS (Backtracker)',
  description: 'DFS Recursivo o "Backtracker", es el algoritmo más famoso y emblemático a la hora de esculpir y diseñar un laberinto procedimental digno y complejo. Funciona perforando sin descanso y de forma continua galerías serpenteantes hacia rumbos cardinales aleatorios, escarbando paredes macizas como una lombriz obstinada.\n\nCuando entra irremediablemente en un callejón sin salida del cual no hay muros no visitados que derruir a su paso, acude a lo que se conoce matemáticamente como "Backtracking". Esto significa desandar sus pasos rebobinando iterativamente su propia Pila de memoria hasta encontrar un nodo o cruce donde haya quedado un vecino libre pendiente y así seguir perforando.',
  characteristics: [
    'Genera pasillos largos y muy tortuosos (comúnmente llamado "River tendency").',
    'Es un laberinto "Perfecto" (sin ciclos ni isletas inalcanzables).',
    'Fácil implementación con Pila, pero con un claro sesgo serpenteante y pocos caminos muertos.'
  ],
  applications: [
    'Juegos tradicionales impresos de resolver laberintos con lápiz desde la entrada a la salida.',
    'Generación procedimental clásica, orgánica y exigente para juegos de mazmorras.'
  ],
  pseudocode: `Marcar celda inicial como visitada y añadir a Pila
Mientras Pila no esté vacía:
  Actual = Cima de Pila
  Si Actual tiene Vecinos no visitados:
    V = Elegir Vecino aleatorio
    Romper Muro entre Actual y V
    Marcar V como visitado y añadir a Pila
  Sino:
    Sacar Actual de Pila`,
  pseudocodeLegend: {
    'Visitar': 'La acción matemática de marcar una coordenada de la cuadrícula para que la "lombriz excavadora" no vuelva a pasar por ahí.',
    'Muro': 'División o tabique opaco que separa estructuralmente dos celdas del grid espacial bidimensional.',
    'V (Vecino)': 'Celda colindante en cualquiera de las cuatro orientaciones cardinales. Su elección estocástica garantiza la cualidad tortuosa final.',
    'Pila': 'Estructura LIFO usada intrínsecamente para recordar la ruta actual y poder "desandar" el camino al estrellarse contra un callejón ciego.'
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
