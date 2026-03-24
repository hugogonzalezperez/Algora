import type { Step } from './index';

export const bfsMetadata = {
  id: 'bfs',
  name: 'Breadth-First Search (BFS)',
  description: 'Breadth-First Search (Búsqueda en Anchura) es uno de los algoritmos de recorrido de grafos más fundamentales que existen. Su funcionamiento se inspira en el efecto de dejar caer una piedra en un estanque: expande su búsqueda de manera perfectamente estricta y concéntrica, explorando uniformemente y a la vez todos los nodos a distancia 1, luego todos los descubiertos a distancia 2, etc.\n\nDebido a que este algoritmo avanza nivel a nivel agotando siempre cada capa de profundidad de forma obligatoria, ostenta la absoluta y pura garantía de encontrar de forma inflexible el camino transitable más corto posible en un escenario sin pesos; ya que al momento que logre rozar la codiciada meta, se demostrará fehacientemente que no era posible arribar bajo ninguna circunstancia usando un solo movimiento menos.',
  characteristics: [
    "Garantiza siempre y absolutamente el camino más corto en grafos sin pesos.",
    "Complejidad temporal de avance: O(V + E).",
    "Utiliza internamente una pesada estructura secuencial de cola simple (FIFO)."
  ],
  applications: [
    "Afectación social en redes de contactos (encontrar amigos de amigos).",
    "Motores de búsqueda arcaicos (rastreo web y escalado topográfico).",
    "Sistemas de navegación por GPS llanos muy simples u obsoletos."
  ],
  pseudocode: `Cola = [Inicio]
Mientras Cola no esté vacía:
  Actual = Sacar de Cola
  Si Actual == Fin: Retornar Camino
  Para cada Vecino de Actual:
    Si Vecino no ha sido visitado:
      Marcar como visitado
      Añadir a Cola`,
  pseudocodeLegend: {
    'Cola': 'Estructura FIFO (First In, First Out) clásica. Los nodos y elementos entran ordenadamente por un lado y salen por el extremo opuesto garantizando una rígida disciplina y orden de llegada inquebrantable.',
    'Actual': 'El nodo o celda en particular que el algoritmo está interpelando y evaluando en su procesamiento durante ese riguroso turno instantáneo.',
    'Vecino': 'Las celdas de la cuadrícula adyacentes a las cuales se puede transitar lícitamente con un único paso desde el nodo Actual (Arriba, Abajo, Izquierda, Derecha).',
    'Visitado': 'Registro activo en memoria efímera de escenarios y celdas por las que ya se ha extendido formalmente el paso del simulador. Corta retrocesos inútiles de raíz.'
  },
  isImplemented: true
};

export function* bfs(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const queue = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  yield { ...start, type: 'visited' };

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: Step[] = [];
      let curr: { x: number, y: number } | null = current;
      while (curr) {
        path.push({ ...curr, type: 'path' });
        curr = parent.get(`${curr.x},${curr.y}`) || null;
      }
      
      path.reverse();
      for (const step of path) {
        yield step;
      }
      return;
    }

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 && neighbor.x < cols &&
        neighbor.y >= 0 && neighbor.y < rows &&
        !grid[neighbor.y][neighbor.x] &&
        !visited.has(`${neighbor.x},${neighbor.y}`)
      ) {
        visited.add(`${neighbor.x},${neighbor.y}`);
        parent.set(`${neighbor.x},${neighbor.y}`, current);
        queue.push(neighbor);
        yield { ...neighbor, type: 'visited' };
      }
    }
  }
}