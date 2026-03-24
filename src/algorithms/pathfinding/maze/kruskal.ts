import type { MazeStep } from './index';

export const kruskalMetadata = {
  id: 'kruskal',
  name: "Kruskal's Algorithm",
  description: 'Unión disjunta pura. Comienza rompiendo muros totalmente al azar por todo el tablero. Las pequeñas áreas despejadas van creciendo como burbujas hasta que colisionan formando un ecosistema único.',
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
