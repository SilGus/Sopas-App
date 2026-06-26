import { CartItem } from './types';
import { AGREGADOS_FAMILIARES, CALDOS_BASE, SOPAS } from './data';

export function getGroupedIngredients(cart: CartItem[]) {
  const groups: Record<string, Record<string, { cantidad: number, unidad: string }>> = {};

  const addIngredient = (categoria: string, nombre: string, cantidad: number, unidad: string) => {
    if (!groups[categoria]) groups[categoria] = {};

    if (!groups[categoria][nombre]) {
      groups[categoria][nombre] = { cantidad: 0, unidad };
    }

    groups[categoria][nombre].cantidad += cantidad;
  };
  
  cart.forEach(item => {
    const sopa = SOPAS.find(s => s.id === item.sopaId);
    const caldoBase = CALDOS_BASE.find(c => c.id === item.caldoBaseId);
    const agregados = AGREGADOS_FAMILIARES.filter(a => item.agregadoIds.includes(a.id));
    
    sopa?.ingredientes.forEach(ing => {
      addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
    });

    caldoBase?.ingredientes.forEach(ing => {
      addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
    });

    agregados.forEach(agregado => {
      agregado.ingredientes.forEach(ing => {
        addIngredient(ing.categoria, ing.nombre, ing.cantidad_base * item.cantidad, ing.unidad);
      });
    });
  });

  return groups;
}

export function generateWhatsAppMessage(groups: Record<string, Record<string, { cantidad: number, unidad: string }>>): string {
  let text = "*Mi Lista de Compras - Sopas que Deshinchan*\n\n";
  for (const [category, items] of Object.entries(groups)) {
    text += `*${category}*\n`;
    for (const [nombre, data] of Object.entries(items)) {
      // Formatear numeros, evitar decimales largos
      const qtyStr = Number.isInteger(data.cantidad) ? data.cantidad.toString() : data.cantidad.toFixed(2);
      text += `- ${qtyStr} ${data.unidad} de ${nombre}\n`;
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
    return `${fraccion} taza`;
  }
  if (unidad === 'un') {
    return `${fraccion}`;
  }
  
  return `${fraccion} ${unidad}`;
};
