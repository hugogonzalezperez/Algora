import type { Step } from './index';

export const dfsMetadata = {
  id: 'dfs',
  name: 'Depth-First Search (DFS)',
  description: 'Depth-First Search (Búsqueda en Profundidad) es un algoritmo de exploración voraz que avanza iterativamente lo más profundo que le es físicamente posible a lo largo de un solo pasillo continuo. Solo una vez que se topa con un callejón sin salida (absolutamente rodeado de muros o de espacios visitados), rectifica sobre sus propios pasos retrocediendo y explora la siguiente ramificación que haya dejado atrás (backtracking).\n\nVisualmente, simula el comportamiento de una persona atravesando un laberinto real de manera exhaustiva eligiendo siempre un lado y siguiéndolo religiosamente. Esta mentalidad sesgada y obcecada lo vuelve uno de los peores algoritmos para buscar distancias óptimas, no ofreciendo ninguna garantía de que el camino que halle sea ni de cerca el más corto. Resulta, sin embargo, muy barato computacionalmente para detectar ciclos y ramificaciones completas.',
  characteristics: [
    "No garantiza casi nunca el camino más corto o expedito.",
    "Complejidad temporal máxima: O(V + E).",
    "Utiliza mecánicamente y de raíz una estructura basada en Pila de llamadas (LIFO)."
  ],
  applications: [
    "Generación artística y resolución de laberintos de grandes recorridos.",
    "Detección matemática de ciclos nocivos en grafos direccionados.",
    "Búsquedas robóticas exhaustivas de fuerza bruta donde la profundidad es lo único que importa."
  ],
  pseudocode: `Pila = [Inicio]
Mientras Pila no esté vacía:
  Actual = Sacar último elemento de Pila
  Si Actual == Fin: Retornar Camino
  Para cada Vecino de Actual:
    Si Vecino no ha sido visitado:
      Marcar como visitado
      Insertar en Pila`,
  pseudocodeLegend: {
    'Pila': 'Estructura LIFO (Last In, First Out). Como un mazo de cartas de mesa: se coloca un elemento nuevo encima, y al sacar o desapilar, se extrae exactamente ese último que se ha puesto restándole base.',
    'Actual': 'La celda que protagoniza la ejecución monopolizando el escenario computacional en un determinado sub-paso u iteración.',
    'Vecino': 'Posibles pasos físicos cardinales no bloqueados contundentemente por un muro sólido.',
    'Visitado': 'Marcador tóxico de territorio que le informa en secreto al algoritmo que no debe volver a pisar esa baldosa jamás para no cerrarse ininteligentes bucles viciosos e infinitos.'
  },
  isImplemented: true
};

export function* dfs(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const stack = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  yield { ...start, type: 'visited' };

  while (stack.length > 0) {
    const current = stack.pop()!;

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

    // Para que el DFS visualmente parezca más natural (explorando Arriba, Derecha, Abajo, Izquierda),
    // empujamos a la pila en el orden inverso (Izquierda, Abajo, Derecha, Arriba).
    // Al hacer pop(), saldrá Arriba primero, luego Derecha, etc.
    const neighbors = [
      { x: current.x, y: current.y - 1 }, // Arriba
      { x: current.x - 1, y: current.y }, // Izquierda
      { x: current.x, y: current.y + 1 }, // Abajo
      { x: current.x + 1, y: current.y }, // Derecha
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
        stack.push(neighbor);
        yield { ...neighbor, type: 'visited' };
      }
    }
  }
}
