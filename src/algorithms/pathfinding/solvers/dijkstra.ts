import type { Step } from './index';

export const dijkstraMetadata = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description: 'Nombrado en honor a su creador Edsger W. Dijkstra, este algoritmo clásico y riguroso es el "padre fundador" del Pathfinding moderno. Garantiza de forma irrefutable encontrar el camino más corto en toda situación calculando meticulosamente la distancia real de absolutamente todos los nodos a los que sea capaz de acceder, extendiéndose equitativamente en forma circular u oleada.\n\nA diferencia del ágil A*, Dijkstra sufre por carecer de Heurística. Es decir, el algoritmo no tiene idea de en qué dirección se sitúa la Meta, por lo que se ve obligado a explorar su entorno al completo, calculando el precio desde el origen hacia cada una de las bifurcaciones y esquinas del mapa sin ningún favoritismo geométrico. Su poder brilla cuando el terreno cuenta con "costes de movimiento" variables.',
  characteristics: [
    'Garantiza encontrar el camino más corto de forma incondicional.',
    'Menos eficiente sin ayuda de heurística (es una búsqueda ciega).',
    'Explora exhaustivamente en todas direcciones de forma uniforme.'
  ],
  applications: [
    'Enrutamiento clásico de redes y telecomunicaciones (OSPF).',
    'Cálculo de rutas en terrenos con costes de peaje variables o accidentados.'
  ],
  pseudocode: `Desconocidos = [Todos los nodos], Dist[Inicio] = 0
Mientras Desconocidos no esté vacío:
  Actual = Nodo en Desconocidos con menor Dist
  Si Actual == Fin: Retornar Camino
  Para cada Vecino de Actual:
    nueva_Dist = Dist[Actual] + Coste(Actual, Vecino)
    Si nueva_Dist < Dist[Vecino]:
      Dist[Vecino] = nueva_Dist`,
  pseudocodeLegend: {
    'Desconocidos': 'Lista de nodos que todavía faltan o son candidatos a ser valorados. Inician con distancia absoluta de "Infinito" provisionalmente.',
    'Dist': 'El registro general de la distancia o coste mínimo acumulado comprobado para llegar desde la salida franca hasta un destino descubierto.',
    'Coste': 'El precio físico de moverse presencialmente de una casilla a la de al lado (un paso diagonal puro suele valer más que un paso recto).',
    'Actual': 'El afortunado nodo de la lista de Desconocidos que ostenta indiscutiblemente la distancia acumulada más baja y atractiva en ese momento.'
  },
  isImplemented: true
};

interface DijkstraNode {
  x: number;
  y: number;
  g: number;
}

export function* dijkstra(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {
  const openSet: DijkstraNode[] = [{ x: start.x, y: start.y, g: 0 }];
  const inOpenSet = new Map<string, DijkstraNode>();
  inOpenSet.set(`${start.x},${start.y}`, openSet[0]);
  
  const closedSet = new Set<string>();
  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const gScore = new Map<string, number>();
  gScore.set(`${start.x},${start.y}`, 0);

  yield { ...start, type: 'visited' };

  while (openSet.length > 0) {
    // Dijkstra solo procesa por peso real G (sin distancia hacia la meta)
    openSet.sort((a, b) => a.g - b.g);
    const current = openSet.shift()!;
    const curKey = `${current.x},${current.y}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);
    inOpenSet.delete(curKey);

    if (!(current.x === start.x && current.y === start.y)) {
      yield { x: current.x, y: current.y, type: 'visited' };
    }

    if (current.x === end.x && current.y === end.y) {
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

    const currentG = gScore.get(curKey) ?? Infinity;

    const neighbors = [
      { x: current.x, y: current.y - 1 },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x - 1, y: current.y },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 && neighbor.x < cols &&
        neighbor.y >= 0 && neighbor.y < rows &&
        !grid[neighbor.y][neighbor.x]
      ) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = currentG + 1; // Coste uniforme de moverse 1 bloque
        
        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          parent.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          
          const existing = inOpenSet.get(neighborKey);
          if (!existing) {
            const newNode = { x: neighbor.x, y: neighbor.y, g: tentativeG };
            openSet.push(newNode);
            inOpenSet.set(neighborKey, newNode);
          } else {
             existing.g = tentativeG;
          }
        }
      }
    }
  }
}
