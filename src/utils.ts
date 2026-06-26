import { CartItem } from './types';
import { ENSALADAS } from './data';

export function getGroupedIngredients(cart: CartItem[]) {
  const groups: Record<string, Record<string, { cantidad: number, unidad: string }>> = {};
  
  cart.forEach(item => {
    const ensalada = ENSALADAS.find(e => e.id === item.ensaladaId);
    if (!ensalada) return;
    
    ensalada.ingredientes.forEach(ing => {
      if (!groups[ing.categoria]) groups[ing.categoria] = {};
      
      if (!groups[ing.categoria][ing.nombre]) {
        groups[ing.categoria][ing.nombre] = { cantidad: 0, unidad: ing.unidad };
      }
      
      groups[ing.categoria][ing.nombre].cantidad += (ing.cantidad_base * item.cantidad);
    });
  });

  return groups;
}

export function generateWhatsAppMessage(groups: Record<string, Record<string, { cantidad: number, unidad: string }>>): string {
  let text = "🛒 *Mi Lista de Compras*\n\n";
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

// src/utils.ts
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
  
  return `${valor} ${unidad}`;
};