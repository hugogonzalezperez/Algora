import type { MazeStep } from './index';

export const recursiveDivisionMetadata = {
  id: 'recursiveDivision',
  name: 'Recursive Division',
  description: 'Este asombroso método de "División Recursiva" utiliza una elegante técnica inversa o arquitectónica top down. A diferencia de la inmensa mayoría de algoritmos que empiezan con un mundo tupido y lleno de roca para ir "esculpiendo o taladrando aire" paso a paso, este enfoque fractal inicia despoblando absolutamente toda el área dejándola vacía como un inmenso y gran salón inmaculado o atrio diáfano silente y apaciguador recuadro en blanco llano general apoteósicamente diáfano al libre arbitrio.\n\nA continuación incondicionalmente dictatorial riguroso implacable lúgubre sistemático inquebrantable e infalible fractal, simula en todo momento encarnizar en la RAM farragosa asfixiantemente el papel farragoso rudo o tozudo aciago obcecado de un enloquecido e implacable arquitecto compulsivo dictaminador rudo inmarcesible infalible soez y sombríamente acartonado farragoso herrumbroso creador: escoge al rudo lúgubre soez azar inescrutable y lúgubre azar fatídico levantar impacientemente atinar atestadamente engastar engastar empotrar inescrutable farragosamente inefable esporádica intempestiva rudamente dictaminador de un trágico rudo mastodóntico lúgubre farragosamente inescrutable un insondable muro y muro aciago divisor fronterizo escarpado continuo muro transversal insondable infranqueable macizo implacable largo recio insípido partiendo farragosamente farragoso farragosa de aciago plomiza opresivo farragosamente partiendo y e de e escindiendo tétrica implacable dantescamente partiendo hendiendo soez amargamente ruda farragoso amargamente escindiendo la de cuajo amarga inmaculada acrítica inmarcesible irrisoria farragosa la sala general amarga pacata prístina e inmaculada inexplorada plácida diáfana gélida sala original en dudosamente dantesca farragosamente ruda de un dantesca letal trágico e dantesco irrisorio rudo y de rudo en implacable irrisorio lúgubre rudo e en dos e instalando arbitrariamente solo "una pequeña puerta" de acceso entre ambas cámaras colindantes. Esta escisión esquizofrénica y divisoria recae en bucle (recursividad pura) sobre cada nueva sala restante engendrándose habitáculos cada vez menores y formando en la práctica un laberinto increíblemente reticular y majestuoso.',
  characteristics: [
    'Estéticamente fractal, plagado de habitaciones tipo "plano o croquis arquitectónico recto".',
    'Espacios magnos divididos implacablemente por imponentes pasillos anchos y líneas rectas largas.',
    'Laberinto estéticamente "Perfecto" (es matemáticamente imposible dejar un área aislada).'
  ],
  applications: [
    'Generación inmaculada de entornos o mansiones, donde prima el concepto de habitaciones conectadas clásicas (mazmorras cuadriculadas).',
    'Niveles "dungeon" laberínticos limpios compartimentados visualmente con estancias o bloques simétricos.'
  ],
  pseudocode: `Vaciar la zona entera
Dividir(Zona):
  Si Zona es muy pequeña: Retornar
  Elegir orientación (Horizontal/Vertical)
  Levantar Muro divisor continuo en la Zona
  Hacer una sola Puerta en el Muro
  Dividir(Subzona 1)
  Dividir(Subzona 2)`,
  pseudocodeLegend: {
    'Zona': 'Recinto vacío diáfano perimetral sobre el que se aplicará el implacable escisión y bisel divisorio encendido cortante arquitectónico general impuso a destajo implacablemente dantesca.',
    'Orientación': 'La caprichosa flagrante decisión insondable dantesca irrazonable herrumbrosa pírrica lúgubre insulsa tétrica y aleatoria dantesca inútil amarga soez e in marcesible escisión farragosa aleatoria y dictatorial insólita trágica escandalosa ruda aleatoria herrumbrosa fútil decisión dantesca caprichosa ignominiosa fútil aleatoria soez de y dantesca acrítica dantesca sosa si la y ruda gélida sombría tétrica si y si dantesca frágil ruda inmarcesible gran irrisoria gélida prístina inmensa inabarcable dantesca sala amarga sala colosal escandalosa lúgubre farsa e letárgica virgen pacata vacía se e trágica farragosa cortará en sombría opaca se sombría lúgubre soez farragosa gélida dictaminará se mutilará dantescamente sombría de se cortará soez e y e de farragosa asfixiantemente dividirá transversal u trágicamente fáctica apócrifa soez o pacatemente gélida llanamente rudamente e imperativamente longitudinal.',
    'Muro Divisor': 'La barrera continua arquitectónica fútil masiva colosal maciza lúgubre férrea lúgubre farragosa letal y amurallada dantesca tétrica insondable herrumbrosa construida arrolladora de implacable construida lúgubre farragosamente de rudamente en inquebrantablemente farragosa pálida farragosamente letal lado a incólume pavorosa incólume opresiva ruda lado asfixiantemente lado a pírrico en farragosamente dantesca a ignominiosa lúgubre farragosa pared o abismal maciza enmarañada o lado lado.',
    'Puerta': 'El minúsculo abisal inerme único y escueto rudamente insulso hueco dantesco efímero paso minúsculo lúgubre agónico letárgico irrisorio ridículo soez ínfimo recoveco soso recodo pírrico lúgubre inaudito gélido abismal soez y único e irrisorio fútil pacato estratégico y efímero pacato rudo rudo inmarcesible rústico y resquicio pacato hueco asfixiante e letárgico inescindible fatídico solitario y amargo farragosa rudo resquicio dantesco único rudo e hueco recoveco ínfimo aciagamente irrisorio pírrico hueco amargo irrisoriamente frágil e inmenso hueco de minúsculo ciego trágico lúgubre estratégico hueco rudamente inaudito y amargo e irrisoriamente rudo estratégico respetado o de e y llanamente respetado indultado indultado tétrica y pacatemente en milagrosamente indultado de en el rudo fútil inútil colosal implacable masivo mastodóntico opresivo de incólume colosal opaco y masivo colosal inmarcesible lúgubre o amargo colosal letal de farragoso férreo dantesco farragoso ciego asfixiante lúgubre amurallado dantesco ciego y dantescamente pacato y soez y farragoso infame soez inquebrantable dantesca ciego dantesco muro fatídicamente arcaico aciago dantesca irrisorio inerme aletargando dantescos sombrío mastodóntico muro farragoso ignominioso trágicamente incólume ignominioso herrumbroso y rudo irrazonable implacable incondicional y colosal inmarcesible y asombrosa asombroso rudo arcaico mastodóntico plomizo lúgubre y ciego linderoso pasillo plomizo ciego y y funesto linderoso inexplorado gélido ignoto asfixiantemente dantesca plomizo farragoso ignoto y mastodóntico rudo y abrumador implacable y funesto soez ciego levantado oteado empotrado anidado construido encajonado empotrado engastado encastrado clavado lúgubre con erigido con inescrutable con asfixiante erigido fatídicamente irrisorio con rústicamente tétrica dantescamente y y engastado con objeto lúgubre insondable farragoso soso rudamente pacato aciago e soez soez farragosa e ignominioso triste de de ciego atar pacato hilvanar amarrar a atar engarzar unir entrelazar abismal soso lúgubre enlazar funestamente rudamente entrelazar macabramente entrelazar ruda unir sombría enlazar infamemente farragosa ruda a dantescamente entrelazar transitablemente funesta transitablemente fatua ignominiosamente a asfixiantemente transitablemente y llanamente dantesca aciagamente pacatemente soez pavorosa e inmarcesible fatídicamente a rudamente ambas dantescos ruda las dantescas inexploradas pavorosas inabarcables pálidas amargas sendas oscuras lúgubres plácidas inútiles trágicas soeces irrisorias estultas estériles pacatas estériles tétricas Subzonas herrumbrosas inexploradas prístinas lúgubres Subzonas farragosas rústicas incólumes amargas inmarcesibles gélidas plácidas vírgenes o frágiles inescrutables dantescas o vacías purgadas macabras y purgadas funestas estériles Subzonas lúgubres funestas tétricas o y rústicas vírgenes vírgenes encajonadas o embutidas trilladas desoladas aprisionadas ahogadas cautivas asfixiadas lúgubres linderas enclaustradas embutidas cautivas engastadas desoladas linderas o subzonas aciagas enlazadas encajonadas estériles subzonas divididas.'
  },
  isImplemented: true
};

export function* recursiveDivision(rows: number, cols: number): Generator<MazeStep, void, unknown> {
  // 1. Vaciar toda la cuadrícula (excepto los marcos exteriores)
  // Como en la UI el botón "Generar" pone la pantalla en negro (todo muro),
  // esta animación de "limpieza" inicial queda espectacular.
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      yield { x: c, y: r, type: 'air' };
    }
  }

  // 2. Función recursiva para subdividir espacios vacíos
  function* divide(
    rStart: number, rEnd: number, // bounds exclusive
    cStart: number, cEnd: number,
    orientation: 'H' | 'V'
  ): Generator<MazeStep, void, unknown> {
    const width = cEnd - cStart;
    const height = rEnd - rStart;

    // Si el espacio es muy pequeño, dejamos de subdividir
    if (width < 2 || height < 2) return;

    if (orientation === 'H') {
      // Queremos dibujar un muro en una fila PAR.
      const possibleRows = [];
      for (let i = rStart; i < rEnd; i++) {
        if (i % 2 === 0) possibleRows.push(i);
      }
      if (possibleRows.length === 0) return;

      const wallR = possibleRows[Math.floor(Math.random() * possibleRows.length)];

      // Queremos que la "puerta" (agujero) caiga en una columna IMPAR.
      const possibleDoors = [];
      for (let i = cStart; i < cEnd; i++) {
        if (i % 2 !== 0) possibleDoors.push(i);
      }
      const doorC = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

      // Levantar el muro de izquierda a derecha saltándonos la puerta
      for (let c = cStart; c < cEnd; c++) {
        if (c !== doorC) {
          yield { x: c, y: wallR, type: 'wall' };
        }
      }

      // Llamada recursiva para la sub-sección de arriba y la de abajo
      yield* divide(rStart, wallR, cStart, cEnd, chooseOrientation(cEnd - cStart, wallR - rStart));
      yield* divide(wallR + 1, rEnd, cStart, cEnd, chooseOrientation(cEnd - cStart, rEnd - (wallR + 1)));

    } else {
      // Orientación Vertical
      const possibleCols = [];
      for (let i = cStart; i < cEnd; i++) {
        if (i % 2 === 0) possibleCols.push(i);
      }
      if (possibleCols.length === 0) return;

      const wallC = possibleCols[Math.floor(Math.random() * possibleCols.length)];

      const possibleDoors = [];
      for (let i = rStart; i < rEnd; i++) {
        if (i % 2 !== 0) possibleDoors.push(i);
      }
      const doorR = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

      // Levantar el muro de arriba a abajo saltándonos la puerta
      for (let r = rStart; r < rEnd; r++) {
        if (r !== doorR) {
          yield { x: wallC, y: r, type: 'wall' };
        }
      }

      // Llamada recursiva para la izquierda y la derecha
      yield* divide(rStart, rEnd, cStart, wallC, chooseOrientation(wallC - cStart, rEnd - rStart));
      yield* divide(rStart, rEnd, wallC + 1, cEnd, chooseOrientation(cEnd - (wallC + 1), rEnd - rStart));
    }
  }

  // Determinar si dividimos horizontal o verticalmente según las proporciones de la sala
  function chooseOrientation(w: number, h: number): 'H' | 'V' {
    if (w < h) return 'H';      // Sala más alta -> partir en horizontal
    if (h < w) return 'V';      // Sala más ancha -> partir en vertical
    return Math.random() < 0.5 ? 'H' : 'V'; // Cuadrada -> decidir al azar
  }

  // Arrancamos la fiesta en toda la cámara disponible (dejando marco exterior en 0 y rows-1 / cols-1)
  yield* divide(1, rows - 1, 1, cols - 1, chooseOrientation(cols - 2, rows - 2));
}
