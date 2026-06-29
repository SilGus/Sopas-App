import { AgregadoSeleccionado, CartItem, Sopa } from './types';
import { AGREGADOS_FAMILIARES, CALDOS_BASE, SOPAS } from './data';

export interface GroupedIngredient {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export type GroupedIngredients = Record<string, GroupedIngredient[]>;

export interface ShoppingListData {
  ingredientes: GroupedIngredients;
  agregadosFamiliares: GroupedIngredients;
  caldoNecesario: GroupedIngredients;
  tandasCaldoBase: Record<string, GroupedIngredients>;
}

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

const getPositiveNumber = (value?: number) => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 1);

export const getTandasSopa = (item: CartItem, sopa?: Sopa): number => {
  if (typeof item.tandasSopa === 'number' && Number.isFinite(item.tandasSopa) && item.tandasSopa > 0) {
    return item.tandasSopa;
  }

  if (typeof item.porcionesDeseadas === 'number' && Number.isFinite(item.porcionesDeseadas) && item.porcionesDeseadas > 0) {
    const basePortions = getPositiveNumber(item.porcionesBase ?? sopa?.porcionesBase);
    return item.porcionesDeseadas / basePortions;
  }

  return getPositiveNumber(item.cantidad);
};

export const getTandasCaldo = (item: CartItem): number => {
  if (item.includeCaldoIngredients === false) {
    return 0;
  }

  return getPositiveNumber(item.tandasCaldo);
};

export const getAgregadosSeleccionados = (item: CartItem, sopa?: Sopa): AgregadoSeleccionado[] => {
  if (Array.isArray(item.agregadosSeleccionados)) {
    return item.agregadosSeleccionados
      .filter(agregado => Number.isFinite(agregado.agregadoId) && Number.isFinite(agregado.platosAgregado) && agregado.platosAgregado > 0)
      .map(agregado => ({
        agregadoId: agregado.agregadoId,
        platosAgregado: Math.max(1, agregado.platosAgregado),
      }));
  }

  const legacyPlatos = getTandasSopa(item, sopa) * getPositiveNumber(item.porcionesBase ?? sopa?.porcionesBase);
  return (item.agregadoIds ?? []).map(agregadoId => ({ agregadoId, platosAgregado: legacyPlatos }));
};

const getRecipeFactor = (tandasSopa: number) => {
  if (!tandasSopa || tandasSopa <= 0) {
    return 1;
  }

  return tandasSopa;
};

const getCaldoBatchMultiplier = (porciones: string) => {
  const match = porciones.match(/^\s*(\d+(?:[.,]\d+)?)/);
  if (!match) {
    return 1;
  }

  return Number(match[1].replace(',', '.')) || 1;
};

const snapQuantity = (value: number) => {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) < 0.05 ? rounded : value;
};

const pluralizeUnit = (unit: string, quantity: number) => {
  if (quantity < 1 || quantity === 1 || unit === 'un' || unit === 'g' || unit === 'kg' || unit === 'ml' || unit === 'cda' || unit === 'cdita') {
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

const formatQuantityText = (value: number) => {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2).replace(/\.?0+$/, '');
};

const formatNumberForDisplay = (value: number) => {
  const snapped = snapQuantity(value);
  return formatQuantityText(snapped);
};

const toGroupedIngredients = (groups: Record<string, Record<string, GroupedIngredient>>): GroupedIngredients =>
  Object.fromEntries(
    Object.entries(groups).map(([categoria, items]) => [categoria, Object.values(items)])
  );

const createGroupedBucket = (): Record<string, GroupedIngredient> => ({});

const addIngredient = (
  groups: Record<string, Record<string, GroupedIngredient>>,
  categoria: string,
  nombre: string,
  cantidad: number,
  unidad: string,
) => {
  if (!groups[categoria]) groups[categoria] = createGroupedBucket();

  const normalizedName = normalizeText(nombre);
  const normalizedUnit = normalizeUnit(unidad);
  const key = `${normalizedName}|${normalizedUnit}`;

  if (!groups[categoria][key]) {
    groups[categoria][key] = { nombre, cantidad: 0, unidad: normalizedUnit };
  }

  groups[categoria][key].cantidad += cantidad;
};

export function getGroupedIngredients(cart: CartItem[]): ShoppingListData {
  const ingredientsGroups: Record<string, Record<string, GroupedIngredient>> = {};
  const agregadosGroups: Record<string, Record<string, GroupedIngredient>> = {};
  const caldoNecesarioGroups: Record<string, Record<string, GroupedIngredient>> = {};
  const batchGroups: Record<string, Record<string, Record<string, GroupedIngredient>>> = {};

  cart.forEach(item => {
    const sopa = SOPAS.find(s => s.id === item.sopaId);
    const caldoBase = CALDOS_BASE.find(c => c.id === item.caldoBaseId);
    const tandasSopa = getTandasSopa(item, sopa);
    const recipeFactor = getRecipeFactor(tandasSopa);
    const caldoNecesario = sopa?.ingredientes.find(ing => ing.categoria === 'Preparaciones base');

    sopa?.ingredientes
      .filter(ing => ing.categoria !== 'Preparaciones base')
      .forEach(ing => {
        addIngredient(ingredientsGroups, ing.categoria, ing.nombre, ing.cantidad_base * recipeFactor, ing.unidad);
      });

    if (caldoNecesario && caldoBase) {
      addIngredient(
        caldoNecesarioGroups,
        caldoNecesario.categoria,
        caldoBase.nombre,
        caldoNecesario.cantidad_base * recipeFactor,
        caldoNecesario.unidad,
      );
    }

    const tandasCaldo = getTandasCaldo(item);
    if (tandasCaldo > 0 && caldoBase) {
      batchGroups[caldoBase.nombre] = batchGroups[caldoBase.nombre] ?? {};
      const batchMultiplier = getCaldoBatchMultiplier(caldoBase.porciones);
      caldoBase.ingredientes.forEach(ing => {
        addIngredient(batchGroups[caldoBase.nombre], ing.categoria, ing.nombre, snapQuantity(ing.cantidad_base * batchMultiplier * tandasCaldo), ing.unidad);
      });
    }

    getAgregadosSeleccionados(item, sopa).forEach(agregadoSeleccionado => {
      const agregado = AGREGADOS_FAMILIARES.find(a => a.id === agregadoSeleccionado.agregadoId);
      if (!agregado) return;

      agregado.ingredientes.forEach(ing => {
        const cantidadBase = Number.isFinite(ing.cantidad_base) ? ing.cantidad_base : 1;
        addIngredient(agregadosGroups, 'Agregados familiares', agregado.nombre, cantidadBase * agregadoSeleccionado.platosAgregado, ing.unidad);
      });
    });
  });

  return {
    ingredientes: toGroupedIngredients(ingredientsGroups),
    agregadosFamiliares: toGroupedIngredients(agregadosGroups),
    caldoNecesario: toGroupedIngredients(caldoNecesarioGroups),
    tandasCaldoBase: Object.fromEntries(
      Object.entries(batchGroups).map(([caldoNombre, groups]) => [caldoNombre, toGroupedIngredients(groups)])
    ),
  };
}

export function generateWhatsAppMessage(data: ShoppingListData): string {
  let text = "*Mi Lista de Compras - Sopas que Deshinchan*\n\n";
  for (const [category, items] of Object.entries(data.ingredientes)) {
    text += `*${category}*\n`;
    for (const item of items) {
      const qtyStr = formatQuantityText(item.cantidad);
      const unitLabel = pluralizeUnit(item.unidad, item.cantidad);
      text += `- ${qtyStr} ${unitLabel} de ${item.nombre}\n`;
    }
    text += "\n";
  }
  if (Object.keys(data.agregadosFamiliares).length > 0) {
    text += `*Agregados familiares*\n`;
    for (const items of Object.values(data.agregadosFamiliares)) {
      for (const item of items) {
        const qtyStr = formatQuantityText(item.cantidad);
        const unitLabel = pluralizeUnit(item.unidad, item.cantidad);
        text += `- ${qtyStr} ${unitLabel} de ${item.nombre}\n`;
      }
    }
    text += "\n";
  }
  if (Object.keys(data.caldoNecesario).length > 0) {
    text += `*Caldo necesario para esta sopa*\n`;
    for (const [category, items] of Object.entries(data.caldoNecesario)) {
      for (const item of items) {
        const qtyStr = formatQuantityText(item.cantidad);
        const unitLabel = pluralizeUnit(item.unidad, item.cantidad);
        text += `- ${qtyStr} ${unitLabel} de ${item.nombre}\n`;
      }
      if (category) text += "\n";
    }
  }
  for (const [caldoNombre, sections] of Object.entries(data.tandasCaldoBase)) {
    text += `*Para preparar tandas completas de caldo base: ${caldoNombre}*\n`;
    for (const [category, items] of Object.entries(sections)) {
      text += `_${category}_\n`;
      for (const item of items) {
        const qtyStr = formatQuantityText(item.cantidad);
        const unitLabel = pluralizeUnit(item.unidad, item.cantidad);
        text += `- ${qtyStr} ${unitLabel} de ${item.nombre}\n`;
      }
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

  const valStr = valor.toFixed(2).replace(/\.?0+$/, "");
  const fraccion = fracciones[valStr] || formatQuantityText(valor);

  if (unidad === 'taza') {
    return `${fraccion} ${pluralizeUnit(unidad, valor)}`;
  }
  if (unidad === 'un') {
    return `${fraccion} ${valor === 1 ? 'unidad' : 'unidades'}`;
  }

  return `${fraccion} ${pluralizeUnit(unidad, valor)}`;
};

export const formatBatchFactor = (tandasSopa: number): string => {
  if (!tandasSopa || tandasSopa <= 0) {
    return 'x1';
  }

  return `x${formatNumberForDisplay(tandasSopa)}`;
};

export const formatTandasLabel = (tandasSopa: number): string => {
  const label = formatNumberForDisplay(tandasSopa);
  return `${label} ${tandasSopa === 1 ? 'tanda' : 'tandas'}`;
};

export const formatEstimatedYield = (porciones: string, tandasSopa: number): string => {
  const match = porciones.match(/^(\s*)(\d+(?:[.,]\d+)?)(?:(\s*(?:a|-)\s*)(\d+(?:[.,]\d+)?))?/i);

  if (!match) {
    return porciones;
  }

  const [, prefix, firstRaw, separator = '', secondRaw] = match;
  const first = Number(firstRaw.replace(',', '.'));
  const second = secondRaw ? Number(secondRaw.replace(',', '.')) : undefined;
  const suffix = porciones.slice(match[0].length);

  if (!Number.isFinite(first)) {
    return porciones;
  }

  if (second !== undefined && Number.isFinite(second)) {
    return `${prefix}${formatNumberForDisplay(first * tandasSopa)}${separator}${formatNumberForDisplay(second * tandasSopa)}${suffix}`;
  }

  return `${prefix}${formatNumberForDisplay(first * tandasSopa)}${suffix}`;
};
