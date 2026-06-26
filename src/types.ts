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
  nombre: string;
  categoria_sopa: string;
  caldo_base_sugerido_id: number;
  ingredientes: Ingrediente[];
  pasos_preparacion: PasoPreparacion[];
}

export interface CaldoBase {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  ingredientes: Ingrediente[];
  preparacion: string[];
}

export interface AgregadoFamiliar {
  id: number;
  nombre: string;
  descripcion: string;
  ingredientes: Ingrediente[];
}

export interface CartItem {
  id: string;
  sopaId: number;
  caldoBaseId: number;
  agregadoIds: number[];
  cantidad: number;
}

export interface SavedList {
  id: string;
  date: string;
  items: CartItem[];
}
