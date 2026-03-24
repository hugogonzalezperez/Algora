import type { MazeStep } from './index';

export const binaryTreeMetadata = {
  id: 'binary',
  name: 'Binary Tree',
  description: 'El Árbol Binario (Binary Tree) es uno de los algoritmos de generación de laberintos deterministas más simples y asimétricos que existen. Funciona recorriendo como una "impresora matricial" la cuadrícula mecánicamente desde un extremo a otro, eligiendo en cada paso derribar únicamente una pared de entre dos opciones dadas (generalmente Norte u Oeste).\n\nEste rígido compromiso estructural y sesgo matemático de manufactura da innegable origen a una topología inconfundible: laberintos que siempre tienen dos bordes perimetrales completamente despoblados de escombros de principio a fin, dejando un inmenso y llano pasillo continuo en forma de "L" a lo largo de los ejes preferentes.',
  characteristics: [
    'Tremendamente rápido, iteración secuencial O(N*M) casi instantánea.',
    'Genera un gravísimo sesgo diagonal (las esquinas NO/SE no están visualmente conectadas).',
    'Siempre genera un pasillo ininterrumpido aburrido a lo largo del borde Norte y Oeste.'
  ],
  applications: [
    'Algoritmo rápido de emergencia o de muy bajo coste computacional.',
    'Generación de mapas jugables que requieren expresamente un área "segura" y continuada en las fronteras.'
  ],
  pseudocode: `Para cada celda del Laberinto:
  Opciones = []
  Si tiene vecino Norte: Añadir 'Norte' a Opciones
  Si tiene vecino Oeste: Añadir 'Oeste' a Opciones
  
  Si Opciones no está vacío:
    Dir = Elegir aleatoriamente de Opciones
    Romper el muro en Dir`,
  pseudocodeLegend: {
    'Celda': 'Cada recuadro del barrido iterativo y metódico que recorre la retícula celosamente sin retroceder jamás.',
    'Opciones': 'La dicotomía implacable y aleatorizada (lanzar una moneda) que dirime el algoritmo entre las dos fronteras permitidas.',
    'Muro': 'La estructura sólida que, de ser derribada en la dirección escogida, conectará visual y físicamente ambas baldosas.'
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
