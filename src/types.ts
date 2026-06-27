export interface Ingrediente {
  categoria: string;
  nombre: string;
  cantidad_base: number;
  unidad: string;
}

export interface PasoPreparacion {
  titulo: string;
  descripcion: string;
}

export interface Sopa {
  id: number;
  numero: string;
  nombre: string;
  subtitulo?: string;
  categoria_sopa: string;
  porcionesBase: number;
  caldo_base_sugerido_id: number;
  notaCaldoBase?: string;
  porciones: string;
  ingredientes: Ingrediente[];
  pasos_preparacion: PasoPreparacion[];
  tip?: string;
}

export interface CaldoBase {
  id: number;
  numero: string;
  nombre: string;
  subtitulo?: string;
  porciones: string;
  ingredientes: Ingrediente[];
  preparacion: string[];
  usoIdeal: string;
  valorNutricional: string;
}

export interface AgregadoFamiliar {
  id: number;
  numero: string;
  nombre: string;
  cantidadSugerida: string;
  descripcion: string;
  tipPractico: string;
  ingredientes: Ingrediente[];
}

export interface CartItem {
  id: string;
  sopaId: number;
  caldoBaseId: number;
  agregadoIds: number[];
  porcionesDeseadas?: number;
  porcionesBase?: number;
  includeCaldoIngredients?: boolean;
  cantidad: number;
}

export interface SavedList {
  id: string;
  date: string;
  items: CartItem[];
}
