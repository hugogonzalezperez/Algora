import type { MazeStep } from './index';

export const primMetadata = {
  id: 'prim',
  name: "Prim's Algorithm",
  description: 'El Algoritmo de Prim modificado para tallar laberintos ortogonales es una soberbia adaptación estocástica del clásico algoritmo matemático de grafos. A diferencia de las laberínticas formas serpenteantes del DFS, Prim genera laberintos frondosos, profusamente ramificados y orgánicamente texturizados, tal como si fuera un cristal de hielo creciendo o un micelio celular.\n\nComienza en una posición aleatoria y va agregando irremisiblemente los gruesos muros linderos inexplorados a una "Frontera" activa expansiva. En cada iteración, selecciona completamente al azar un muro perimetral de esa gran bolsa de contención y lo rompe, uniendo la celda diáfana con la inexplorada al otro lado del muro, dando lugar a una vasta red de pasillos capilarizados y abundantes callejones sin salida rápidos.',
  characteristics: [
    'Produce laberintos con una gran cantidad de pequeños recovecos y túneles (branching factor alto).',
    'Las opciones aleatorias en la inmensa lista de muros le dan una textura visual uniforme, cristalizada y muy orgánica.',
    'Es un laberinto "Perfecto" (sin isletas aisladas ni bucles), pero requiere mantener un gigantesco set en memoria.'
  ],
  applications: [
    'Estética intrincada de cuevas ramificadas o túneles de hormigas.',
    'Generación de mapas tácticos densos donde el jugador deba explorar habitación a habitación sin perderse demasiado en pasillos.'
  ],
  pseudocode: `Marcar Inicio y añadir vecinos a la "Frontera"
Mientras Frontera no esté vacía:
  C = Elegir celda de Frontera aleatoriamente
  Conectar C con un vecino ya Visitado (aleatorio si hay varios)
  Marcar C como Visitada
  Añadir nuevos vecinos de C a la Frontera`,
  pseudocodeLegend: {
    'Frontera': 'El perímetro externo inestable o la coraza amurallada expansiva que rodea al conjunto aglutinado de celdas "Visitadas" e integradas a la sala base.',
    'Aleatoriamente': 'La fortuita selección caótica que dictamina sin ningún sesgo qué muro de la inmensa frontera debe caer. Esto origina la naturaleza expansiva radial del laberinto.',
    'Conectar': 'El sublime acto de derribar el obstáculo interpuesto entre la celda virgen y el laberinto funcional transitable, sumándola a la retícula caminable.'
  },
  isImplemented: true
};

export function* prim(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  const visited = new Set<string>();
  const frontier: {r: number, c: number, dr: number, dc: number}[] = [];
  
  // Start at top-left
  visited.add(`1,1`);
  yield { x: 1, y: 1, type: 'air' };
  
  const addFrontier = (r: number, c: number) => {
    if (r > 2 && !visited.has(`${r-2},${c}`)) frontier.push({r, c, dr: -1, dc: 0});
    if (r < rows - 3 && !visited.has(`${r+2},${c}`)) frontier.push({r, c, dr: 1, dc: 0});
    if (c > 2 && !visited.has(`${r},${c-2}`)) frontier.push({r, c, dr: 0, dc: -1});
    if (c < cols - 3 && !visited.has(`${r},${c+2}`)) frontier.push({r, c, dr: 0, dc: 1});
  };
  
  addFrontier(1, 1);
  
  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const wall = frontier.splice(idx, 1)[0]; // Saca uno al azar
    
    // The cell beyond the wall:
    const nr = wall.r + wall.dr * 2;
    const nc = wall.c + wall.dc * 2;
    
    if (!visited.has(`${nr},${nc}`)) {
      visited.add(`${nr},${nc}`);
      // Break the wall and the new cell
      yield { x: wall.c + wall.dc, y: wall.r + wall.dr, type: 'air' };
      yield { x: nc, y: nr, type: 'air' };
      addFrontier(nr, nc);
    }
  }
}
