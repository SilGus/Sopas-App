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
    codigo: '01',
    nombre: 'Caldo Base Verde Liviano',
    descripcion: 'Base vegetal suave para sopas frescas, deshinchantes y de cocción rápida.',
    ingredientes: [
      { categoria: 'Verdulería', nombre: 'Apio', cantidad_base: 1, unidad: 'rama' },
      { categoria: 'Verdulería', nombre: 'Zucchini', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Perejil', cantidad_base: 0.25, unidad: 'taza' },
      { categoria: 'Almacén', nombre: 'Sal marina', cantidad_base: 1, unidad: 'pizca' },
    ],
    preparacion: [
      'Herví los vegetales con agua suficiente hasta que estén tiernos.',
      'Colá o licuá apenas según la textura que quieras para la sopa final.',
    ],
  },
  {
    id: 2,
    codigo: '02',
    nombre: 'Caldo Base Dorado',
    descripcion: 'Base aromática con cúrcuma y jengibre para sopas cálidas y especiadas.',
    ingredientes: [
      { categoria: 'Verdulería', nombre: 'Zanahoria', cantidad_base: 1, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Cebolla', cantidad_base: 0.5, unidad: 'un' },
      { categoria: 'Verdulería', nombre: 'Jengibre fresco', cantidad_base: 1, unidad: 'cdita' },
      { categoria: 'Almacén', nombre: 'Cúrcuma', cantidad_base: 0.5, unidad: 'cdita' },
    ],
    preparacion: [
      'Dorá la cebolla con la zanahoria unos minutos para concentrar sabor.',
      'Sumá agua, jengibre y cúrcuma. Cociná hasta lograr un caldo perfumado.',
    ],
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
