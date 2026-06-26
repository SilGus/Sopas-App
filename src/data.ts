import { AgregadoFamiliar, CaldoBase, Sopa } from './types';

export const CATEGORIAS_SOPAS = [
  'Termogénicas',
  'Saciantes',
  'Deshinchantes',
  'Cremosas Livianas',
];

export const CALDOS_BASE: CaldoBase[] = [
  {
    id: 1,
    numero: '01',
    nombre: 'Caldo Base de Vegetales',
    subtitulo: 'El Comodín Neutro',
    porciones: '6 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Agua', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Verdulería', nombre: 'Cebolla mediana', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Puerro', cantidad_base: 0.33, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Zanahoria', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Apio', cantidad_base: 0.17, unidad: 'atado' },
      { categoria: 'Almacén', nombre: 'Laurel', cantidad_base: 0.33, unidad: 'hoja' },
      { categoria: 'Almacén', nombre: 'Granos de pimienta negra', cantidad_base: 0.17, unidad: 'cdita' },
    ],
    preparacion: [
      'En una olla grande, poné todos los ingredientes.',
      'Llevá a hervor, bajá el fuego a mínimo y cociná por 40 minutos.',
      'Colá y conservá solo el líquido.',
    ],
    usoIdeal: 'Tu lienzo base. Ideal para cualquier sopa crema donde no quieras alterar el sabor principal del vegetal protagonista.',
    valorNutricional: 'Aporta minerales esenciales y una base de sabor sutil que no compite con otros ingredientes.',
  },
  {
    id: 2,
    numero: '02',
    nombre: 'Caldo Base de Huesos',
    subtitulo: 'El Reparador Digestivo',
    porciones: '6 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Agua fría', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Carnicería', nombre: 'Huesos de vaca (osobuco o caracú)', cantidad_base: 0.17, unidad: 'kg' },
      { categoria: 'Verdulería', nombre: 'Zanahoria', cantidad_base: 0.17, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Cebolla', cantidad_base: 0.17, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Puerro', cantidad_base: 0.17, unidad: 'un' },
      { categoria: 'Almacén', nombre: 'Vinagre de manzana', cantidad_base: 0.17, unidad: 'cda' },
    ],
    preparacion: [
      'Colocá todo en la olla.',
      'Cociná a fuego mínimo (apenas burbujeando) entre 3 y 6 horas.',
      'Colá y dejá enfriar.',
    ],
    usoIdeal: 'El corazón de tus sopas más saciantes. Mantiene el estómago satisfecho por horas.',
    valorNutricional: 'Repara la mucosa intestinal y brinda una carga proteica de alta calidad y colágeno.',
  },
  {
    id: 3,
    numero: '03',
    nombre: 'Caldo Base de Pescado',
    subtitulo: 'El Liviano Refinado',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Agua', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Pescadería', nombre: 'Espinas y cabezas de pescado blanco', cantidad_base: 0.25, unidad: 'kg' },
      { categoria: 'Verdulería', nombre: 'Cebolla', cantidad_base: 0.25, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Puerro', cantidad_base: 0.25, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Apio', cantidad_base: 0.25, unidad: 'tallo' },
      { categoria: 'Bebidas', nombre: 'Vino blanco', cantidad_base: 0.25, unidad: 'chorrito' },
      { categoria: 'Verdulería', nombre: 'Perejil fresco', cantidad_base: 0.25, unidad: 'puñado' },
    ],
    preparacion: [
      'Cociná a fuego suave por 25 minutos desde que rompe hervor.',
      'Colá inmediatamente para evitar amargor.',
    ],
    usoIdeal: 'Ideal para días de calor o cuando necesitás algo sumamente liviano pero con gran profundidad de sabor marino.',
    valorNutricional: 'Fuente de yodo y fósforo, de digestión extremadamente rápida.',
  },
  {
    id: 4,
    numero: '04',
    nombre: 'Caldo Base Funcional Deshinchante',
    subtitulo: 'Tu Herramienta de Rescate',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Agua', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Verdulería', nombre: 'Apio (tallos y hojas)', cantidad_base: 0.5, unidad: 'atado' },
      { categoria: 'Verdulería', nombre: 'Perejil fresco', cantidad_base: 0.25, unidad: 'atado' },
      { categoria: 'Verdulería', nombre: 'Jengibre', cantidad_base: 0.25, unidad: 'rodaja gruesa' },
      { categoria: 'Verdulería', nombre: 'Ajo', cantidad_base: 0.5, unidad: 'diente' },
      { categoria: 'Verdulería', nombre: 'Hinojo picado', cantidad_base: 0.25, unidad: 'un' },
    ],
    preparacion: [
      'Herví todos los ingredientes durante 20 minutos a fuego suave.',
      'No lleva sal.',
    ],
    usoIdeal: 'Bebé una taza antes de cenar o usalo como base de sopas cuando notes retención de líquidos.',
    valorNutricional: 'Efecto diurético natural potente. Descongestiona el sistema linfático.',
  },
  {
    id: 5,
    numero: '05',
    nombre: 'Caldo Dorado Antiinflamatorio',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Vegetales', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Verdulería', nombre: 'Cúrcuma fresca rallada', cantidad_base: 12.5, unidad: 'g' },
      { categoria: 'Almacén', nombre: 'Pimienta negra recién molida', cantidad_base: 0.25, unidad: 'cdita' },
    ],
    preparacion: [
      'Agregá la cúrcuma y la pimienta al caldo caliente.',
      'Dejá infusionar a fuego mínimo por 10 minutos sin hervir.',
    ],
    usoIdeal: 'Indicado para días post-esfuerzo físico o procesos inflamatorios.',
    valorNutricional: 'Reduce la inflamación sistémica. Es el caldo "renovador" por excelencia.',
  },
  {
    id: 6,
    numero: '06',
    nombre: 'Caldo de Recuperación Nocturna',
    subtitulo: 'El Inductor del Sueño',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Huesos', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Almacén/Dietética', nombre: 'Semillas de zapallo', cantidad_base: 0.5, unidad: 'cda' },
      { categoria: 'Verdulería', nombre: 'Espinacas frescas', cantidad_base: 0.25, unidad: 'atado' },
    ],
    preparacion: [
      'Calentá el caldo, incorporá las espinacas y cociná 2 minutos.',
      'Retirá, añadí las semillas y procesá todo.',
    ],
    usoIdeal: 'Consumir una taza caliente una hora antes de dormir.',
    valorNutricional: 'Aporta magnesio y triptófano, facilitando el descanso profundo y reparador.',
  },
  {
    id: 7,
    numero: '07',
    nombre: 'Caldo de Algas',
    subtitulo: 'El Mineralizante',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Vegetales', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Almacén/Dietética', nombre: 'Alga Kombu (aprox. 10 cm)', cantidad_base: 0.25, unidad: 'lámina' },
    ],
    preparacion: [
      'Dejá reposar el alga en el caldo frío 15 minutos.',
      'Luego, cociná 20 minutos a fuego suave.',
      'Retirá el alga antes de servir.',
    ],
    usoIdeal: 'Para cuando sientas fatiga mental o falta de energía sostenida.',
    valorNutricional: 'Alta densidad de minerales traza y yodo, fundamentales para la salud tiroidea.',
  },
  {
    id: 8,
    numero: '08',
    nombre: 'Caldo de Inmunidad',
    subtitulo: 'Escudo Natural',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Huesos', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Verdulería', nombre: 'Ajo asado', cantidad_base: 1.5, unidad: 'dientes' },
      { categoria: 'Verdulería', nombre: 'Jengibre', cantidad_base: 0.75, unidad: 'rodajas gruesas' },
    ],
    preparacion: [
      'Incorporá el ajo asado y el jengibre al caldo caliente.',
      'Cociná a fuego mínimo por 15 minutos para integrar sabores.',
    ],
    usoIdeal: 'Consumir preventivamente en épocas de frío o ante los primeros síntomas de decaimiento.',
    valorNutricional: 'Potente efecto antiviral y antibacteriano. Fortalece la primera línea de defensa.',
  },
  {
    id: 9,
    numero: '09',
    nombre: 'Caldo de Setas',
    subtitulo: 'El Potenciador de Sabor / Umami',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Vegetales', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Almacén/Dietética', nombre: 'Hongos secos (shiitake o porcini)', cantidad_base: 7.5, unidad: 'g' },
    ],
    preparacion: [
      'Hidratá los hongos en el caldo 30 minutos.',
      'Luego, cociná a fuego suave 20 minutos.',
      'Podés procesarlo o dejar los trozos.',
    ],
    usoIdeal: 'Cuando necesitás un plato con mucho cuerpo que inhiba el deseo de picotear.',
    valorNutricional: 'El umami natural envía señales directas de saciedad al cerebro.',
  },
  {
    id: 10,
    numero: '10',
    nombre: 'Caldo Verde Alcalinizante',
    porciones: '4 porciones de 500 ml',
    ingredientes: [
      { categoria: 'Preparaciones base', nombre: 'Caldo Base de Vegetales', cantidad_base: 0.5, unidad: 'litro' },
      { categoria: 'Verdulería', nombre: 'Cilantro', cantidad_base: 0.25, unidad: 'atado' },
      { categoria: 'Verdulería', nombre: 'Perejil', cantidad_base: 0.25, unidad: 'atado' },
      { categoria: 'Verdulería', nombre: 'Brócoli', cantidad_base: 25, unidad: 'g' },
    ],
    preparacion: [
      'Blanqueá el brócoli en el caldo 3 minutos.',
      'Retirá, agregá las hierbas frescas y procesá inmediatamente.',
    ],
    usoIdeal: 'Ideal para limpiar el organismo después de un fin de semana de excesos.',
    valorNutricional: 'Carga masiva de antioxidantes y clorofila para la detoxificación hepática.',
  },
];

export const AGREGADOS_FAMILIARES: AgregadoFamiliar[] = [
  {
    id: 301,
    nombre: 'Huevo duro picado',
    descripcion: 'Suma proteína y vuelve la sopa más completa.',
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Huevo', cantidad_base: 1, unidad: 'un' },
    ],
  },
  {
    id: 302,
    nombre: 'Croutons integrales',
    descripcion: 'Aportan textura crocante para servir en la mesa.',
    ingredientes: [
      { categoria: 'Panadería', nombre: 'Croutons integrales', cantidad_base: 0.25, unidad: 'taza' },
    ],
  },
  {
    id: 303,
    nombre: 'Queso rallado liviano',
    descripcion: 'Terminación simple para quienes quieren una sopa más cremosa.',
    ingredientes: [
      { categoria: 'Lácteos', nombre: 'Queso rallado liviano', cantidad_base: 2, unidad: 'cdas' },
    ],
  },
];

export const SOPAS: Sopa[] = [
  {
    id: 1,
    nombre: 'Sopa Termogénica de Zapallo y Jengibre',
    categoria_sopa: 'Termogénicas',
    caldo_base_sugerido_id: 2,
    ingredientes: [
      { categoria: 'Verdulería', nombre: 'Zapallo en cubos', cantidad_base: 1.5, unidad: 'taza' },
      { categoria: 'Verdulería', nombre: 'Puerro picado', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Jengibre fresco rallado', cantidad_base: 1, unidad: 'cdita' },
      { categoria: 'Almacén', nombre: 'Pimienta negra', cantidad_base: 1, unidad: 'pizca' },
    ],
    pasos_preparacion: [
      { titulo: 'Base', descripcion: 'Calentá el caldo base dorado en una olla mediana.' },
      { titulo: 'Cocción', descripcion: 'Agregá zapallo, puerro y jengibre. Cociná hasta que el zapallo esté tierno.' },
      { titulo: 'Textura', descripcion: 'Licuá parcialmente para dejar una textura cremosa con algunos trozos.' },
      { titulo: 'Final', descripcion: 'Terminá con pimienta negra y serví caliente.' },
    ],
  },
  {
    id: 2,
    nombre: 'Sopa Saciante de Lentejas Rojas',
    categoria_sopa: 'Saciantes',
    caldo_base_sugerido_id: 2,
    ingredientes: [
      { categoria: 'Almacén', nombre: 'Lentejas rojas', cantidad_base: 0.5, unidad: 'taza' },
      { categoria: 'Verdulería', nombre: 'Zanahoria rallada', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Cebolla picada', cantidad_base: 0.25, unidad: 'un' },
      { categoria: 'Almacén', nombre: 'Comino', cantidad_base: 0.5, unidad: 'cdita' },
    ],
    pasos_preparacion: [
      { titulo: 'Base', descripcion: 'Llevá el caldo base dorado a hervor suave.' },
      { titulo: 'Cocción', descripcion: 'Sumá lentejas, zanahoria, cebolla y comino.' },
      { titulo: 'Punto', descripcion: 'Cociná hasta que las lentejas se desarmen y espesen la sopa.' },
      { titulo: 'Final', descripcion: 'Ajustá sal y dejá reposar 5 minutos antes de servir.' },
    ],
  },
  {
    id: 3,
    nombre: 'Sopa Deshinchante Verde',
    categoria_sopa: 'Deshinchantes',
    caldo_base_sugerido_id: 1,
    ingredientes: [
      { categoria: 'Verdulería', nombre: 'Zucchini en cubos', cantidad_base: 1, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Espinaca', cantidad_base: 1, unidad: 'taza' },
      { categoria: 'Verdulería', nombre: 'Apio picado', cantidad_base: 1, unidad: 'rama' },
      { categoria: 'Verdulería', nombre: 'Limón', cantidad_base: 0.25, unidad: 'un' },
    ],
    pasos_preparacion: [
      { titulo: 'Base', descripcion: 'Calentá el caldo base verde liviano sin hervir fuerte.' },
      { titulo: 'Cocción', descripcion: 'Agregá zucchini y apio. Cociná hasta que estén tiernos.' },
      { titulo: 'Verde', descripcion: 'Sumá la espinaca al final para mantener color y frescura.' },
      { titulo: 'Final', descripcion: 'Licuá y terminá con unas gotas de limón.' },
    ],
  },
  {
    id: 4,
    nombre: 'Crema Liviana de Coliflor',
    categoria_sopa: 'Cremosas Livianas',
    caldo_base_sugerido_id: 1,
    ingredientes: [
      { categoria: 'Verdulería', nombre: 'Coliflor', cantidad_base: 1.5, unidad: 'taza' },
      { categoria: 'Verdulería', nombre: 'Cebolla blanca', cantidad_base: 0.25, unidad: 'un' },
      { categoria: 'Lácteos', nombre: 'Yogur natural', cantidad_base: 2, unidad: 'cdas' },
      { categoria: 'Almacén', nombre: 'Nuez moscada', cantidad_base: 1, unidad: 'pizca' },
    ],
    pasos_preparacion: [
      { titulo: 'Base', descripcion: 'Usá el caldo base verde liviano como líquido principal.' },
      { titulo: 'Cocción', descripcion: 'Cociná coliflor y cebolla hasta que estén muy tiernas.' },
      { titulo: 'Crema', descripcion: 'Licuá hasta lograr una textura suave y agregá el yogur fuera del fuego.' },
      { titulo: 'Final', descripcion: 'Terminá con nuez moscada y serví caliente.' },
    ],
  },
];
