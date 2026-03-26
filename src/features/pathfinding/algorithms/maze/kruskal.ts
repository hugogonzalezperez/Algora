import type { MazeStep } from './index';

export const kruskalMetadata = {
  id: 'kruskal',
  name: "Kruskal's Algorithm",
  description: 'The randomized Kruskal\'s Algorithm is a gem based on the computational theory of "Disjoint Set Forests". Unlike other mazes that grow from a single point (like Prim or DFS), Kruskal begins by knocking down and joining walls in a completely anarchic and independent manner across the entire surface of the board at the same time.\n\nInitially, each cell in the grid is considered its own isolated set. The algorithm shuffles every single wall in the world and begins to evaluate them one by one. If the wall it is inspecting separates two rooms that still belong to "distinct sets", the wall is destroyed, mathematically joining them. This cellular growth, like multiple isolated bubbles colliding, produces a final ecosystem full of short passages and very balanced solutions.',
  characteristics: [
    'Aesthetics of disjoint areas that gradually form a global maze step by step.',
    'Forms a standardized "Perfect" maze (without closed loops or unreachable islands).',
    'Homogeneous growth from multiple areas of the map, avoiding obvious bottlenecks.'
  ],
  applications: [
    'Generation of competitive maps where a very balanced distribution of blind spots is desired.',
    'RPG games with a natural aesthetic of "small isolated ecosystems" merging progressively.'
  ],
  pseudocode: `Each Cell is a "Disjoint Set"
Shuffle all Walls randomly
For each Wall in the list:
  C1, C2 = Cells adjacent to the Wall
  If C1 and C2 are NOT in the same Set:
    Break the Wall
    Unite the Set of C1 with C2`,
  pseudocodeLegend: {
    'Set': 'A logical group of one or more cells that are already connected to each other by open passages.',
    'Shuffle': 'The act of randomly ordering all potential walls to ensure the maze grows uniformly and unpredictably from multiple points.',
    'Wall': 'A barrier between two cells. If it separates two different sets, it is removed to connect them.',
    'Unite': 'The mathematical fusion of two disjoint sets using Union-Find, ensuring that every part of the maze eventually connects without forming loops.'
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
