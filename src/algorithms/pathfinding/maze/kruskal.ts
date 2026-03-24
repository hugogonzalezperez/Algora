import type { MazeStep } from './index';

export const kruskalMetadata = {
  id: 'kruskal',
  name: "Kruskal's Algorithm",
  description: 'El Algoritmo de Kruskal aleatorizado es una joya basada en la teoría computacional de "Bosque de Árboles Disjuntos" o "Disjoint Sets". A diferencia de otros laberintos que crecen desde un solo punto (como Prim o DFS), Kruskal comienza derribando y uniendo muros de forma totalmente anárquica e independiente por toda la superficie del tablero al mismo tiempo.\n\nInicialmente cada celda de la cuadrícula es considerada su propio conjunto aislado. El algoritmo baraja todos y cada uno de los tabiques del mundo y comienza a evaluarlos uno a uno. Si el muro que está inspeccionando separa dos habitaciones que todavía pertenecen a "conjuntos distintos", el muro se destruye uniéndolas matemáticamente. Este crecimiento celular como múltiples burbujas aisladas que colisionan produce un ecosistema final repleto de pasillos cortos y soluciones muy equilibradas.',
  characteristics: [
    'Estética de áreas disjuntas que van conformando un laberinto global paso a paso.',
    'Forma un laberinto estandarizado "Perfecto" (sin bucles cerrados ni islas inalcanzables).',
    'Crecimiento homogéneo desde múltiples zonas del mapa, evitando cuellos de botella obvios.'
  ],
  applications: [
    'Generación de mapas competitivos donde se desea una distribución muy equilibrada de puntos ciegos.',
    'Juegos RPG con estética natural de "pequeños ecosistemas aislados" fusionándose progresivamente.'
  ],
  pseudocode: `Cada Celda es un "Conjunto" distinto
Barajar todos los Muros aleatoriamente
Para cada Muro en la lista:
  C1, C2 = Celdas adyacentes al Muro
  Si C1 y C2 NO están en el mismo Conjunto:
    Romper el Muro
    Unir el Conjunto de C1 con C2`,
  pseudocodeLegend: {
    'Conjunto': 'Grupo de una o más celdas que ya están comunicadas entre ellas de forma ininterrumpida por pasillos francos abiertos.',
    'Barajar': 'Ordenar al azar absolutamente todos los tabiques o muros del mapa inicial para garantizar la homogeneidad e imprevisión del tallado general uniformemente estático.',
    'Muro': 'Pieza del tablero que se evalúa silenciosamente una sola vez en cada ciclo ineludible o iterativo para determinar si de hecho se consolida eternamente o en efecto debe desintegrarse irremisiblemente reventada y sepultada.',
    'Unir': 'Fusión matemática y lógica implacable dictatorial imponente (usando la genialidad de compresión Path Compression) de un dúo dispar acantonado de diseminados dispares e insospechados grupos pretéritos insulsos e inauditos de baldosas que ahora se aglutinarán englobándose inanes por siempre acopladas en su suerte conectadas.'
  },
  isImplemented: true
};

export function* kruskal(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  const sets = new Map<string, string>();
  
  // Encontrar la raíz del conjunto con Path Compression
  const find = (a: string): string => {
    if (sets.get(a) === a) return a;
    const root = find(sets.get(a)!);
    sets.set(a, root);
    return root;
  };
  
  // Unir dos conjuntos. Devuelve false si ya estaban conectados matemáticamente.
  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
       sets.set(rootB, rootA);
       return true;
    }
    return false;
  };

  const walls: {r: number, c: number, vert: boolean}[] = [];
  
  // 1. Convertir todas las celdas impares en "aire" para ver los puntos iniciales
  for (let r = 1; r < rows - 1; r += 2) {
    for (let c = 1; c < cols - 1; c += 2) {
      sets.set(`${r},${c}`, `${r},${c}`);
      yield { x: c, y: r, type: 'air' };

      // Registrar los muros entre celdas
      if (r < rows - 3) walls.push({r: r + 1, c, vert: false}); // Muro horizontal
      if (c < cols - 3) walls.push({r, c: c + 1, vert: true});  // Muro vertical
    }
  }

  // 2. Barajar los muros completamente al azar
  for (let i = walls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [walls[i], walls[j]] = [walls[j], walls[i]];
  }

  // 3. Destruir muros si las celdas adyacentes no están conectadas aún
  for (const wall of walls) {
    let c1, c2;
    if (wall.vert) {
       c1 = `${wall.r},${wall.c - 1}`;
       c2 = `${wall.r},${wall.c + 1}`;
    } else {
       c1 = `${wall.r - 1},${wall.c}`;
       c2 = `${wall.r + 1},${wall.c}`;
    }

    if (union(c1, c2)) {
      yield { x: wall.c, y: wall.r, type: 'air' };
    }
  }
}
