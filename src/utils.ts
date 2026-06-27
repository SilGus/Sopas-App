import { CartItem } from './types';
import { AGREGADOS_FAMILIARES, CALDOS_BASE, SOPAS } from './data';

export interface GroupedIngredient {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export type GroupedIngredients = Record<string, GroupedIngredient[]>;

const UNIT_ALIASES: Record<string, string> = {
  g: 'g',
  gr: 'g',
  gramo: 'g',
  gramos: 'g',
  kg: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  litro: 'litro',
  litros: 'litro',
  l: 'litro',
  ml: 'ml',
  mililitro: 'ml',
  mililitros: 'ml',
  taza: 'taza',
  tazas: 'taza',
  cda: 'cda',
  cdas: 'cda',
  cucharada: 'cda',
  cucharadas: 'cda',
  cdita: 'cdita',
  cditas: 'cdita',
  cucharadita: 'cdita',
  cucharaditas: 'cdita',
  un: 'un',
  unidad: 'un',
  unidades: 'un',
  diente: 'diente',
  dientes: 'diente',
  cabeza: 'cabeza',
  cabezas: 'cabeza',
  rama: 'rama',
  ramas: 'rama',
  tallo: 'tallo',
  tallos: 'tallo',
  rodaja: 'rodaja',
  rodajas: 'rodaja',
  puñado: 'puñado',
  puñados: 'puñado',
  atado: 'atado',
  atados: 'atado',
  pizca: 'pizca',
  pizcas: 'pizca',
  chorrito: 'chorrito',
  chorritos: 'chorrito',
  hilo: 'hilo',
  hilos: 'hilo',
  planta: 'planta',
  plantas: 'planta',
  hoja: 'hoja',
  hojas: 'hoja',
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const normalizeUnit = (unit: string) => {
  const cleanedUnit = normalizeText(unit).replace(/\./g, '');
  return UNIT_ALIASES[cleanedUnit] ?? cleanedUnit;
};

const pluralizeUnit = (unit: string, quantity: number) => {
  if (quantity === 1 || unit === 'un' || unit === 'g' || unit === 'kg' || unit === 'ml' || unit === 'cda' || unit === 'cdita') {
    return unit;
  }

  const pluralMap: Record<string, string> = {
    litro: 'litros',
    taza: 'tazas',
    diente: 'dientes',
    cabeza: 'cabezas',
    rama: 'ramas',
    tallo: 'tallos',
    rodaja: 'rodajas',
    puñado: 'puñados',
    atado: 'atados',
    pizca: 'pizcas',
    chorrito: 'chorritos',
    hilo: 'hilos',
    planta: 'plantas',
    hoja: 'hojas',
  };

  return pluralMap[unit] ?? `${unit}s`;
};

export function getGroupedIngredients(cart: CartItem[]): GroupedIngredients {
  const groups: Record<string, Record<string, GroupedIngredient>> = {};

  const addIngredient = (categoria: string, nombre: string, cantidad: number, unidad: string) => {
    if (!groups[categoria]) groups[categoria] = {};

    const normalizedName = normalizeText(nombre);
    const normalizedUnit = normalizeUnit(unidad);
    const key = `${normalizedName}|${normalizedUnit}`;

    if (!groups[categoria][key]) {
      groups[categoria][key] = { nombre, cantidad: 0, unidad: normalizedUnit };
    }

    groups[categoria][key].cantidad += cantidad;
  };

  cart.forEach(item => {
    const sopa = SOPAS.find(s => s.id === item.sopaId);
    const caldoBase = CALDOS_BASE.find(c => c.id === item.caldoBaseId);
    const agregados = AGREGADOS_FAMILIARES.filter(a => item.agregadoIds.includes(a.id));

    sopa?.ingredientes.forEach(ing => {
      addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
    });

    if (item.includeCaldoIngredients !== false) {
      caldoBase?.ingredientes.forEach(ing => {
        addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
      });
    }

    agregados.forEach(agregado => {
      agregado.ingredientes.forEach(ing => {
        addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
      });
    });
  });

  return Object.fromEntries(
    Object.entries(groups).map(([categoria, items]) => [categoria, Object.values(items)])
  );
}

export function generateWhatsAppMessage(groups: GroupedIngredients): string {
  let text = "*Mi Lista de Compras - Sopas que Deshinchan*\n\n";
  for (const [category, items] of Object.entries(groups)) {
    text += `*${category}*\n`;
    for (const data of items) {
      // Formatear numeros, evitar decimales largos
      const qtyStr = Number.isInteger(data.cantidad) ? data.cantidad.toString() : data.cantidad.toFixed(2);
      const unitLabel = pluralizeUnit(data.unidad, data.cantidad);
      text += `- ${qtyStr} ${unitLabel} de ${data.nombre}\n`;
    }
    text += "\n";
  }
  return text;
}

export const formatearMedida = (valor: number, unidad: string): string => {
  const fracciones: Record<string, string> = {
    "0.25": "1/4",
    "0.33": "1/3",
    "0.5": "1/2",
    "0.75": "3/4"
  };

  // Convertimos a string y redondeamos para evitar errores de precisión
  const valStr = valor.toFixed(2).replace(/\.?0+$/, "");
  const fraccion = fracciones[valStr] || valor.toString();

  if (unidad === 'taza') {
    return `${fraccion} ${pluralizeUnit(unidad, valor)}`;
  }
  if (unidad === 'un') {
    return `${fraccion}`;
  }

  return `${fraccion} ${pluralizeUnit(unidad, valor)}`;
};
