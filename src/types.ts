export interface Ingrediente {
  categoria: string;
  nombre: string;
  cantidad_base: number;
  unidad: string;
}

export interface PasoArmado {
  titulo: string;
  descripcion: string;
}

export interface Ensalada {
  id: number;
  nombre: string;
  categoria_ensalada: string;
  aderezo_sugerido_id: number;
  ingredientes: Ingrediente[];
  pasos_armado: PasoArmado[];
}

export interface Aderezo {
  id: number;
  nombre: string;
  descripcion: string;
  preparacion: string[];
}

export interface CartItem {
  id: string;
  ensaladaId: number;
  aderezoId: number;
  cantidad: number;
}

export interface SavedList {
  id: string;
  date: string;
  items: CartItem[];
}
