import type { Step } from './index';

export const astarMetadata = {
  id: 'astar',
  name: 'A* Algorithm',
  description: 'A* (A-Star) es indiscutiblemente uno de los algoritmos de pathfinding más admirados y utilizados de la historia de la informática por su extremada eficiencia práctica en el campo de batalla y su absoluta precisión. Combina la meticulosidad garantista ineludible del algoritmo de Dijkstra, con la rapidez y la dirección intuitiva e inteligente del método empírico "Greedy Best-First-Search".\n\nEl secreto del éxito rotundo del A-Star reside esencialmente en que la expansión de su búsqueda no es ciega y estúpida como un vulgar BFS, sino que pesa rigurosamente cada decisión matemática y paso en base a una Heurística (una ecuación matemática superior que le otorga lo que podríamos considerar llanamente "una premonición certera" sobre en qué dirección puramente lógica intuye que le convendría avanzar más si desea llegar lo más rápido posible previendo el destino final). En este simulador, emplea la implacable distancia de Octile (8 ramificaciones) para apuntar milimétricamente como un francotirador al nodo final, esquivando y sorteando paredes de forma orgánica, cortando los cuellos de botella y ahorrando a la CPU y RAM precioso tiempo valioso de recorrido computacional.',
  characteristics: [
    'Garantiza sin paliativos el desentrañar matemáticamente camino unívoco más corto.',
    'Usa heurísticas ponderadas avanzadas (distancia Octile precalculada internamente).',
    'Permite de serie movimiento diagonal (8 direcciones).'
  ],
  applications: [
    'Títulos triple A de la industria del viedojuego y motores base de Inteligencia Artificial para NPCs.',
    'Ruteado en mapas topográficos geolocalizados de GPS y automatización industrial robótica celular.'
  ],
  pseudocode: `Abiertos = [Inicio], G[Inicio] = 0, F[Inicio] = H(Inicio)
Mientras Abiertos no esté vacío:
  Actual = Nodo en Abiertos con menor F
  Si Actual == Fin: Retornar Camino
  Para cada Vecino de Actual:
    nuevo_G = G[Actual] + Distancia(Actual, Vecino)
    Si nuevo_G < G[Vecino]:
      G[Vecino] = nuevo_G
      F[Vecino] = nuevo_G + H(Vecino)
      Añadir Vecino a Abiertos`,
  pseudocodeLegend: {
    'Abiertos': 'Lista táctica priorizada de nodos descubiertos pululando a la incesante espera de que les llegue su inexorable turno de ser explorados del todo. Están ordenados en perpetuo tiempo real rigiéndose al milímetro según su sumatorio de peso F a fin de que el próximo canditato a arrancar sea matemática y lógicamente siempre el que ostente mayor conveniencia y probabilidad de acierto.',
    'G': 'Costo riguroso y matemático, sin magia artificial alguna. Es lisa y llanamente la distancia verídica inalterable acumulada trágicamente desde las coordenadas de inicio vital hasta un miserable nodo en específico tras cada travesía del arduo sendero.',
    'H': '(Heurística) Costo astuto y extremadamente audaz de una suposición magistralmente calculada de lo que teóricamente falta o dista en la cruda lejanía desde un nodo disparado rectamente como un dardo cruzando tabiques de aire hasta topar virtualmente con la Meta sin contemplar obstáculo indeseado alguno mediante una ecuación euclidiana o de Octile preconfigurada al milímetro.',
    'F': 'El grado general absolutista del valor de prioridad inalienable de ahondar exhaustivamente en un nodo y su casta (F = G + H repesentando en un número toda tu fiabilidad de ser explotable o ignorado flagrantemente). A menor número natural, el algoritmo A-Star caerá de pleno seducido irremediablemente a la "tentación pasional" de sumergirse abnegado adentrándose para desmembrarlo de forma minuciosa en las siguientes vueltas o bucles de su bucle general en solitario con susurros logarítmicos del averno.',
    'Vecino': 'Ramas colindantes periféricas las cuales logran otearse y ser descubiertas desde una atalaya inusitada. Contempla el movimiento oblicuo tridimensional en diagonal sin dejarse engañar perversamente colisionando o atreviéndose a surcar y atravesar quimeras de esquinas obtusas prohibidas e insalvables.'
  },
  isImplemented: true
};

export function* astar(
  grid: boolean[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  rows: number,
  cols: number
): Generator<Step, void, unknown> {

  // Heurística Octile para movimiento en 8 direcciones
  const h = (x: number, y: number) => {
    const dx = Math.abs(x - end.x);
    const dy = Math.abs(y - end.y);
    const D = 1;
    const D2 = Math.sqrt(2);
    // Añadimos un pequeño factor de desempate (tie-breaking) para que el camino sea más recto
    const p = 1 / (rows * cols);
    return (D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)) * (1 + p);
  };

  const isWalkable = (x: number, y: number) => {
    return x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];
  };

  const gScore: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  gScore[start.y][start.x] = 0;

  const parent = new Map<string, { x: number; y: number } | null>();
  parent.set(`${start.x},${start.y}`, null);

  const closedSet = new Set<string>();

  type OpenNode = { f: number; g: number; x: number; y: number };
  const openSet: OpenNode[] = [{ f: h(start.x, start.y), g: 0, x: start.x, y: start.y }];

  yield { ...start, type: 'visited' };

  while (openSet.length > 0) {
    // Ordenar por f; en empate, priorizamos el que tenga menor h (más cerca del final)
    openSet.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return h(a.x, a.y) - h(b.x, b.y);
    });

    const current = openSet.shift()!;
    const { x: cx, y: cy } = current;
    const curKey = `${cx},${cy}`;

    if (closedSet.has(curKey)) continue;
    closedSet.add(curKey);

    if (!(cx === start.x && cy === start.y)) {
      yield { x: cx, y: cy, type: 'visited' };
    }

    if (cx === end.x && cy === end.y) {
      const path: Step[] = [];
      let curr: { x: number; y: number } | null = { x: cx, y: cy };
      while (curr !== null) {
        path.push({ x: curr.x, y: curr.y, type: 'path' });
        curr = parent.get(`${curr.x},${curr.y}`) ?? null;
      }
      path.reverse();
      for (const step of path) yield step;
      return;
    }

    const currentG = gScore[cy][cx];

    // 8 Direcciones: Cardinales + Diagonales
    const dirs = [
      { dx: 1, dy: 0, cost: 1 },
      { dx: -1, dy: 0, cost: 1 },
      { dx: 0, dy: 1, cost: 1 },
      { dx: 0, dy: -1, cost: 1 },
      { dx: 1, dy: 1, cost: Math.sqrt(2) },
      { dx: 1, dy: -1, cost: Math.sqrt(2) },
      { dx: -1, dy: 1, cost: Math.sqrt(2) },
      { dx: -1, dy: -1, cost: Math.sqrt(2) },
    ];

    for (const { dx, dy, cost } of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (!isWalkable(nx, ny)) continue;

      // REGLA ESTRICTA DE ESQUINAS: No permitir movimiento diagonal si hay un muro adyacente
      if (dx !== 0 && dy !== 0) {
        // Los dos vecinos cardinales que forman la esquina deben estar libres
        if (!isWalkable(nx, cy) || !isWalkable(cx, ny)) continue;
      }

      const nKey = `${nx},${ny}`;
      if (closedSet.has(nKey)) continue;

      const tentativeG = currentG + cost;

      if (tentativeG < gScore[ny][nx]) {
        gScore[ny][nx] = tentativeG;
        parent.set(nKey, { x: cx, y: cy });
        const f = tentativeG + h(nx, ny);
        openSet.push({ f, g: tentativeG, x: nx, y: ny });
      }
    }
  }
}