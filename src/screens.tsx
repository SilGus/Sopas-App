import React, { useState } from 'react';
import { AGREGADOS_FAMILIARES, CALDOS_BASE, CATEGORIAS_SOPAS, SOPAS } from './data';
import { AgregadoSeleccionado, CartItem, SavedList } from './types';
import {
  getGroupedIngredients,
  generateWhatsAppMessage,
  formatearMedida,
  formatBatchFactor,
  formatEstimatedYield,
  formatTandasLabel,
  formatYieldText,
  getAgregadosSeleccionados,
  getTandasCaldo,
  getTandasSopa,
} from './utils';

// --- Components ---

function BottomNav({ active, onNavigate }: { active: string; onNavigate: (s: string) => void }) {
  const items = [
    { id: 'catalogo', icon: 'soup_kitchen', label: 'Recetas' },
    { id: 'lista', icon: 'shopping_basket', label: 'Mi Lista' },
    { id: 'cocina', icon: 'auto_stories', label: 'Preparación' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface shadow-[0_-4px_12px_rgba(18,28,42,0.08)] rounded-t-xl md:hidden">
      {items.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container rounded-full px-6'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="font-label-md text-label-md mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Pantalla 0: Inicio
export function Inicio({ onNewList, onHistory, onBottomNav }: { onNewList: () => void; onHistory: () => void; onBottomNav: (s: string) => void }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased pb-32">
      <main className="flex-grow flex flex-col items-center justify-between px-margin-mobile max-w-screen-md mx-auto w-full pt-8 pb-8">
        <div className="flex w-full justify-center pt-2 pb-6">
          <img
            src="/assets/tapa-app-sopas.webp"
            alt="Tapa de Sopas que Deshinchan"
            className="w-full max-w-[400px] aspect-[4/5] object-contain drop-shadow-[0_14px_28px_rgba(63,41,20,0.12)]"
            loading="eager"
          />
        </div>
        <div className="w-full flex flex-col gap-stack-md pb-2">
          <button onClick={onNewList} className="w-full h-auto min-h-[52px] py-3 px-4 bg-primary text-on-primary font-label-lg text-label-lg rounded-full shadow-md flex items-center justify-center gap-3 hover:opacity-90 transition-opacity active:scale-[0.98] text-center">
            <span className="material-symbols-outlined icon-fill">add_circle</span>
            Crear Nueva Lista
          </button>
          <button onClick={onHistory} className="w-full h-auto min-h-[52px] py-3 px-4 bg-surface text-primary border-2 border-primary-container/20 font-label-lg text-label-lg rounded-full shadow-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98] text-center">
            <span className="material-symbols-outlined">history</span>
            Ver Mis Listas Anteriores
          </button>
        </div>
      </main>
      <BottomNav active="catalogo" onNavigate={onBottomNav} />
    </div>
  );
}

// Pantalla 1: Catalogo
export function Catalogo({ onSelect, onBottomNav }: { onSelect: (id: number) => void; onBottomNav: (s: string) => void }) {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categorias = ['Todas', ...CATEGORIAS_SOPAS];

  const filteredSopas = SOPAS.filter(s => {
    const matchNumber = searchNumber.trim() === '' || s.id.toString() === searchNumber.trim();
    const matchCategory = selectedCategory === 'Todas' || s.categoria_sopa === selectedCategory;
    return matchNumber && matchCategory;
  });

  return (
    <div className="min-h-screen pb-32 bg-background flex flex-col">
      <header className="bg-surface-bright shadow-sm flex justify-between items-center w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">soup_kitchen</span>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Catálogo</h1>
        </div>
      </header>
      <main className="px-margin-mobile pt-stack-md space-y-stack-md max-w-xl mx-auto w-full">
        <div className="bg-surface-container-low p-4 rounded-2xl shadow-sm border border-outline-variant space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="number"
              placeholder="Ingresa el número de sopa (1-60)"
              value={searchNumber}
              onChange={e => setSearchNumber(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-surface rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary-container outline-none font-body-lg text-on-surface placeholder:text-on-surface-variant/70 transition-all font-bold placeholder:font-normal"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full">
            {categorias.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`h-[44px] px-6 rounded-full font-label-md transition-all border ${
                  selectedCategory === c
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-surface">Elige tu sopa</h2>

        {filteredSopas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredSopas.map(s => {
              const caldoSugerido = CALDOS_BASE.find(c => c.id === s.caldo_base_sugerido_id);
              const ingredientesPrincipales = s.ingredientes
                .filter(i => i.categoria !== 'Preparaciones base')
                .slice(0, 4)
                .map(i => i.nombre)
                .join(', ');

              return (
                <div key={s.id} onClick={() => onSelect(s.id)} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4 border border-outline-variant custom-shadow cursor-pointer hover:border-primary transition-all group">
                  <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-display-sm font-bold shrink-0 shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
                    #{s.numero}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider">{s.categoria_sopa}</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-tight mt-0.5 mb-1">{s.nombre}</h3>
                    {s.subtitulo && (
                      <p className="font-label-md text-label-md text-primary mb-1">{s.subtitulo}</p>
                    )}
                    <p className="font-body-md text-body-md text-on-surface-variant">Ingredientes: {ingredientesPrincipales}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Caldo base sugerido: {caldoSugerido?.nombre}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Rinde según ebook: {s.porciones}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-70">
            <span className="material-symbols-outlined text-6xl mb-4 text-on-surface-variant">search_off</span>
            <p className="font-body-lg text-on-surface-variant">No se encontraron sopas con esos filtros.</p>
          </div>
        )}
      </main>
      <BottomNav active="catalogo" onNavigate={onBottomNav} />
    </div>
  );
}

// Pantalla 2: Caldo base recomendado
export function CaldoRecomendado({ sopaId, onConfirm, onChangeCaldo, onBack }: { sopaId: number; onConfirm: (caldoBaseId: number, includeCaldoIngredients: boolean) => void; onChangeCaldo: () => void; onBack: () => void }) {
  const sopa = SOPAS.find(s => s.id === sopaId)!;
  const caldoSugerido = CALDOS_BASE.find(c => c.id === sopa.caldo_base_sugerido_id)!;

  return (
    <div className="min-h-screen pb-32 bg-background">
      <header className="bg-surface-bright shadow-sm flex justify-between items-center w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</button>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Caldo Base</h1>
        </div>
        <span className="material-symbols-outlined text-primary">account_circle</span>
      </header>
      <main className="px-margin-mobile pt-stack-md space-y-stack-lg max-w-xl mx-auto">
        <section>
          <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between border border-outline-variant custom-shadow">
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-label-md text-label-md">Sopa seleccionada</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{sopa.nombre}</h2>
              <span className="text-secondary font-label-md text-label-md mt-1">{sopa.categoria_sopa}</span>
              {sopa.subtitulo && (
                <span className="text-secondary font-label-md text-label-md mt-1">{sopa.subtitulo}</span>
              )}
              <span className="text-on-surface-variant font-body-md text-body-md mt-1">Rinde según ebook: {sopa.porciones}</span>
            </div>
          </div>
        </section>

        <section className="space-y-stack-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface px-1">Caldo Base recomendado</h3>
          <div className="bg-surface-container-low rounded-xl p-1 border-4 border-primary-container transition-all">
            <div className="bg-surface-container-lowest rounded-lg p-5 flex items-center gap-4">
              <div className="bg-secondary-container p-3 rounded-full">
                <span className="material-symbols-outlined text-on-secondary-container icon-fill">soup_kitchen</span>
              </div>
              <div className="flex-1">
                <h4 className="font-headline-md text-headline-md text-on-surface">#{caldoSugerido.numero} {caldoSugerido.nombre}</h4>
                {caldoSugerido.subtitulo && (
                  <p className="font-label-md text-label-md text-secondary">{caldoSugerido.subtitulo}</p>
                )}
                <p className="font-body-md text-body-md text-on-surface-variant">{caldoSugerido.porciones}</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">{caldoSugerido.usoIdeal}</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{caldoSugerido.valorNutricional}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-stack-sm">
          <p className="font-body-md text-body-md text-on-surface-variant px-1">
            Podés usar este caldo si ya lo tenés preparado, prepararlo ahora o reemplazarlo por otro caldo base.
          </p>
          <h3 className="font-headline-md text-headline-md text-on-surface px-1">¿Qué querés hacer con el caldo base?</h3>
          <div className="space-y-stack-sm">
            <button onClick={() => onConfirm(caldoSugerido.id, false)} className="w-full bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:border-primary-container transition-all text-left flex items-start gap-4">
              <span className="material-symbols-outlined mt-1 text-primary">kitchen</span>
              <span className="flex-1">
                <span className="block font-headline-md text-headline-md text-on-surface">Ya tengo este caldo preparado</span>
                <span className="block font-body-md text-body-md text-on-surface-variant">No se suman ingredientes de tanda de caldo a la lista.</span>
              </span>
            </button>
            <button onClick={() => onConfirm(caldoSugerido.id, true)} className="w-full bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:border-primary-container transition-all text-left flex items-start gap-4">
              <span className="material-symbols-outlined mt-1 text-primary">shopping_basket</span>
              <span className="flex-1">
                <span className="block font-headline-md text-headline-md text-on-surface">Quiero preparar este caldo</span>
                <span className="block font-body-md text-body-md text-on-surface-variant">Vas a elegir cuántas tandas completas preparar en el próximo paso.</span>
              </span>
            </button>
            <button onClick={onChangeCaldo} className="w-full bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:border-primary-container transition-all text-left flex items-start gap-4">
              <span className="material-symbols-outlined mt-1 text-primary">swap_horiz</span>
              <span className="flex-1">
                <span className="block font-headline-md text-headline-md text-on-surface">Quiero cambiar por otro caldo base</span>
                <span className="block font-body-md text-body-md text-on-surface-variant">Podés reemplazar el recomendado por cualquiera de los caldos base del ebook.</span>
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// Pantalla 3: Otros caldos base
export function OtrosCaldosBase({ sopaId, initialCaldoBaseId, onConfirm, onBack }: { sopaId: number; initialCaldoBaseId?: number; onConfirm: (caldoBaseId: number, includeCaldoIngredients: boolean) => void; onBack: () => void }) {
  const sopa = SOPAS.find(s => s.id === sopaId)!;
  const [selected, setSelected] = useState<number | undefined>(
    initialCaldoBaseId && initialCaldoBaseId !== sopa.caldo_base_sugerido_id ? initialCaldoBaseId : undefined
  );
  const caldoSugerido = CALDOS_BASE.find(c => c.id === sopa.caldo_base_sugerido_id)!;
  const selectedCaldo = CALDOS_BASE.find(c => c.id === selected);

  return (
    <div className="min-h-screen pb-32 bg-background">
      <header className="bg-surface-bright shadow-sm flex justify-between items-center w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</button>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Otros Caldos</h1>
        </div>
      </header>
      <main className="px-margin-mobile pt-stack-md space-y-stack-lg max-w-xl mx-auto">
        <section className="space-y-stack-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Otros caldos base</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Caldo recomendado para esta sopa: {caldoSugerido.nombre}. Si elegís otro, quedará marcado como reemplazo en el resumen.
          </p>
          <div className="space-y-stack-sm">
            {CALDOS_BASE.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)} className={`bg-surface-container-low rounded-xl p-5 border-2 transition-all cursor-pointer ${selected === c.id ? 'border-primary-container' : 'border-transparent'}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-md text-headline-md text-on-surface">#{c.numero} {c.nombre}</h4>
                    {c.subtitulo && (
                      <p className="font-label-md text-label-md text-secondary">{c.subtitulo}</p>
                    )}
                    <p className="font-body-md text-body-md text-on-surface-variant">Rinde según ebook: {c.porciones}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">{c.usoIdeal}</p>
                  </div>
                  <div className="flex items-center justify-start shrink-0">
                    <button className={selected === c.id ? 'bg-primary-container text-white px-4 py-2 rounded-xl font-label-md text-label-md active:scale-95 transition-all w-full sm:w-auto' : 'bg-surface-container-lowest border-2 border-outline px-4 py-2 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all w-full sm:w-auto'}>
                      {selected === c.id ? 'Seleccionado' : 'Seleccionar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedCaldo && (
          <section className="space-y-stack-sm">
            {selectedCaldo.id !== sopa.caldo_base_sugerido_id && (
              <div className="bg-secondary-container/40 rounded-xl p-4 border border-secondary-container">
                <p className="font-body-md text-body-md text-on-surface">
                  Estás reemplazando el caldo recomendado por <strong>{selectedCaldo.nombre}</strong>.
                </p>
              </div>
            )}
            <h3 className="font-headline-md text-headline-md text-on-surface px-1">¿Qué querés hacer con este caldo?</h3>
            <div className="space-y-stack-sm">
              <button onClick={() => onConfirm(selectedCaldo.id, false)} className="w-full bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:border-primary-container transition-all text-left flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-primary">kitchen</span>
                <span className="flex-1">
                  <span className="block font-headline-md text-headline-md text-on-surface">Ya tengo este caldo preparado</span>
                  <span className="block font-body-md text-body-md text-on-surface-variant">No se suman ingredientes de tanda de caldo a la lista.</span>
                </span>
              </button>
              <button onClick={() => onConfirm(selectedCaldo.id, true)} className="w-full bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:border-primary-container transition-all text-left flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-primary">shopping_basket</span>
                <span className="flex-1">
                  <span className="block font-headline-md text-headline-md text-on-surface">Quiero preparar este caldo</span>
                  <span className="block font-body-md text-body-md text-on-surface-variant">Vas a elegir cuántas tandas completas preparar en el próximo paso.</span>
                </span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Pantalla 6: Agregados familiares
export function AgregadosOpcionales({ initialAgregadoIds = [], initialAgregadosSeleccionados, onConfirm, onBack }: { initialAgregadoIds?: number[]; initialAgregadosSeleccionados?: AgregadoSeleccionado[]; onConfirm: (agregadosSeleccionados: AgregadoSeleccionado[]) => void; onBack: () => void }) {
  const initialSelected = initialAgregadosSeleccionados ?? initialAgregadoIds.map(agregadoId => ({ agregadoId, platosAgregado: 1 }));
  const [selectedAgregados, setSelectedAgregados] = useState<AgregadoSeleccionado[]>(initialSelected);
  const toggleAgregado = (id: number) => {
    setSelectedAgregados(prev => (
      prev.some(item => item.agregadoId === id)
        ? prev.filter(item => item.agregadoId !== id)
        : [...prev, { agregadoId: id, platosAgregado: 1 }]
    ));
  };
  const updatePlatosAgregado = (id: number, platosAgregado: number) => {
    setSelectedAgregados(prev => prev.map(item => (
      item.agregadoId === id ? { ...item, platosAgregado: Math.max(1, platosAgregado) } : item
    )));
  };

  return (
    <div className="min-h-screen pb-32 bg-background">
      <header className="bg-surface-bright shadow-sm flex justify-between items-center w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</button>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Agregados</h1>
        </div>
      </header>
      <main className="px-margin-mobile pt-stack-md space-y-stack-lg max-w-xl mx-auto">
        <section className="space-y-stack-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">¿Querés sumar agregados familiares?</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Podés usarlos para adaptar la misma sopa a distintos platos sin cocinar doble.</p>
          <div className="space-y-stack-sm">
            {AGREGADOS_FAMILIARES.map(agregado => {
              const selected = selectedAgregados.find(item => item.agregadoId === agregado.id);
              const isSelected = !!selected;
              return (
                <div key={agregado.id} className={`bg-surface-container-low rounded-xl p-5 border-2 transition-all flex items-start gap-4 ${isSelected ? 'border-primary-container' : 'border-transparent'}`}>
                  <button onClick={() => toggleAgregado(agregado.id)} className="mt-1 active:scale-95 transition-transform" aria-label={isSelected ? `Quitar ${agregado.nombre}` : `Sumar ${agregado.nombre}`}>
                    <span className={`material-symbols-outlined ${isSelected ? 'text-primary icon-fill' : 'text-on-surface-variant'}`}>
                      {isSelected ? 'check_circle' : 'add_circle'}
                    </span>
                  </button>
                  <div className="flex-1">
                    <button onClick={() => toggleAgregado(agregado.id)} className="w-full text-left">
                      <span className="block font-label-md text-label-md text-secondary">#{agregado.numero} · {agregado.cantidadSugerida}</span>
                      <span className="block font-headline-md text-headline-md text-on-surface">{agregado.nombre}</span>
                      <span className="block font-body-md text-body-md text-on-surface-variant">{agregado.descripcion}</span>
                      {agregado.tipPractico && (
                        <span className="block font-body-md text-body-md text-on-surface-variant mt-1">{agregado.tipPractico}</span>
                      )}
                    </button>
                    {selected && (
                      <div className="mt-4">
                        <p className="font-body-md text-body-md text-on-surface-variant mb-3">¿Para cuántos platos querés usar este agregado?</p>
                        <div className="flex items-center justify-between gap-4 bg-surface-container-lowest rounded-full p-2 border border-outline-variant shadow-sm max-w-xs">
                          <button onClick={() => updatePlatosAgregado(agregado.id, selected.platosAgregado - 1)} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shadow hover:bg-surface-container active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-[24px]">remove</span>
                          </button>
                          <span className="font-display-lg text-2xl font-bold text-on-surface w-12 text-center">{selected.platosAgregado}</span>
                          <button onClick={() => updatePlatosAgregado(agregado.id, selected.platosAgregado + 1)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow hover:bg-primary-container active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-[24px]">add</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md p-gutter-mobile border-t border-outline-variant flex justify-center items-center h-28 z-40">
        <button onClick={() => onConfirm(selectedAgregados)} className="bg-primary hover:bg-primary-container text-white w-full max-w-lg min-h-[64px] py-4 px-6 rounded-full font-headline-lg text-headline-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-center">
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

// Pantalla 5: Tandas de sopa y caldo
export function TandasSopa({ sopaId, caldoBaseId, includeCaldoIngredients = true, initialTandasSopa = 1, initialTandasCaldo = 1, onConfirm, onBack }: { sopaId: number; caldoBaseId: number; includeCaldoIngredients?: boolean; initialTandasSopa?: number; initialTandasCaldo?: number; onConfirm: (tandasSopa: number, tandasCaldo?: number) => void; onBack: () => void }) {
  const [tandasSopa, setTandasSopa] = useState(initialTandasSopa);
  const [tandasCaldo, setTandasCaldo] = useState(initialTandasCaldo);
  const sopa = SOPAS.find(s => s.id === sopaId)!;
  const caldoBase = CALDOS_BASE.find(c => c.id === caldoBaseId)!;
  const tandasLabel = formatTandasLabel(tandasSopa);
  const estimatedYield = formatEstimatedYield(sopa.porciones, tandasSopa);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <header className="bg-surface-bright shadow-sm flex items-center gap-4 w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <button onClick={onBack} className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</button>
        <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Tandas</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile max-w-md mx-auto w-full text-center space-y-stack-lg">
        <section className="w-full">
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-background mb-2">{sopa.nombre}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-2">Cada tanda rinde: {formatYieldText(sopa.porciones)} según el ebook.</p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-2">Resultado estimado: {formatYieldText(estimatedYield)}.</p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-2">Ingredientes de sopa: {formatBatchFactor(tandasSopa)}.</p>
          {sopa.notaCaldoBase && (
            <p className="font-body-md text-body-md text-on-surface-variant mb-2">{sopa.notaCaldoBase}</p>
          )}
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">¿Cuántas tandas de esta sopa querés preparar?</p>

          <div className="flex items-center justify-center gap-8 bg-surface-container-low rounded-full p-2 border border-outline-variant shadow-sm w-full">
            <button onClick={() => setTandasSopa(Math.max(1, tandasSopa - 1))} className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow hover:bg-surface-container active:scale-95 transition-all">
              <span className="material-symbols-outlined text-3xl">remove</span>
            </button>
            <span className="font-display-lg text-5xl font-bold text-on-surface w-16">{tandasSopa}</span>
            <button onClick={() => setTandasSopa(tandasSopa + 1)} className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow hover:bg-primary-container active:scale-95 transition-all">
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-4">Vas a preparar {tandasLabel} = {formatYieldText(estimatedYield)} estimadas.</p>
        </section>

        <section className="w-full bg-surface-container-low rounded-xl p-5 border border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Caldo seleccionado</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">{caldoBase.nombre}</p>
          {includeCaldoIngredients ? (
            <>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Cada tanda de caldo rinde: {formatYieldText(caldoBase.porciones)} según el ebook.</p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">La tanda de caldo se prepara completa para guardar o freezar.</p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-8 mb-6">¿Cuántas tandas de este caldo querés preparar?</p>
              <div className="flex items-center justify-center gap-8 bg-surface-container-lowest rounded-full p-2 border border-outline-variant shadow-sm w-full">
                <button onClick={() => setTandasCaldo(Math.max(1, tandasCaldo - 1))} className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-primary shadow hover:bg-surface-container active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-3xl">remove</span>
                </button>
                <span className="font-display-lg text-4xl font-bold text-on-surface w-16">{tandasCaldo}</span>
                <button onClick={() => setTandasCaldo(tandasCaldo + 1)} className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow hover:bg-primary-container active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              </div>
            </>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Ya tenés caldo preparado; no se sumarán ingredientes de tanda de caldo.</p>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md p-gutter-mobile border-t border-outline-variant flex justify-center items-center h-28 z-40">
        <button onClick={() => onConfirm(tandasSopa, includeCaldoIngredients ? tandasCaldo : undefined)} className="bg-primary hover:bg-primary-container text-white w-full max-w-lg min-h-[64px] py-4 px-6 rounded-full font-headline-lg text-headline-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-center">
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

// Pantalla 4: Bucle (Agregado)
export function Bucle({ onAddMore, onFinish }: { onAddMore: () => void; onFinish: () => void }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col justify-center items-center px-margin-mobile relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-surface-container-low to-transparent -z-10"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <main className="w-full max-w-md flex flex-col items-center text-center">
        <div className="mb-stack-lg relative animate-scale-in opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="relative w-32 h-32 bg-primary-container/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[80px] text-primary icon-fill">
              check_circle
            </span>
          </div>
        </div>

        <div className="space-y-stack-sm mb-stack-lg animate-fade-in-up opacity-0 w-full" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 className="font-display-lg text-display-lg text-on-background">¡Agregado al menú!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Tu selección ha sido guardada exitosamente.</p>
        </div>

        <div className="w-full flex flex-col space-y-stack-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <button onClick={onFinish} className="w-full min-h-[52px] bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,59,0.2)] hover:bg-surface-tint hover:shadow-[0_6px_16px_rgba(0,106,59,0.3)] active:scale-[0.98] transition-all duration-200">
            Finalizar y ver mi lista
          </button>
          <button onClick={onAddMore} className="w-full min-h-[52px] bg-transparent text-primary border-2 border-outline-variant rounded-full font-label-lg text-label-lg flex items-center justify-center hover:bg-surface-container-low hover:border-primary active:scale-[0.98] transition-all duration-200">
            Agregar otra sopa distinta
          </button>
        </div>
      </main>
    </div>
  );
}

// Pantalla 5: ListaCompras
export function ListaCompras({ cart, goModoCocina, goInicio, onBottomNav, onUpdateCart, onRemoveItem, onAddMore }: { cart: CartItem[]; goModoCocina: () => void; goInicio: () => void; onBottomNav: (s: string) => void; onUpdateCart: (id: string, newQty: number) => void; onRemoveItem: (id: string) => void; onAddMore: () => void }) {
  const groups = getGroupedIngredients(cart);

  const handleWhatsApp = () => {
    const text = generateWhatsAppMessage(groups, cart);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md pb-32">
      <header className="bg-background text-primary font-headline-md text-headline-md flex items-center px-margin-mobile h-[72px] w-full max-w-screen-xl mx-auto fixed z-50">
        <button onClick={goInicio} className="mr-4 hover:opacity-80 transition-opacity active:scale-95 duration-150 flex items-center justify-center p-2 -ml-2 rounded-full">
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
        <span className="font-display-lg text-display-lg font-bold text-primary truncate">Sopas que Deshinchan</span>
      </header>

      <main className="pt-[96px] px-margin-mobile md:px-8 max-w-3xl mx-auto space-y-stack-lg pb-32">
        <section className="space-y-stack-sm">
          <h1 className="font-display-lg text-display-lg text-on-background">Lista de Compras</h1>
          <p className="font-body-lg text-on-surface-variant">Revisa los ingredientes necesarios para tu semana.</p>

          <div className="glass-card rounded-xl p-6 mt-6 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-secondary-container rounded-full opacity-20 blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10 w-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-fill">soup_kitchen</span>
                </div>
                <div className="w-full">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Menú elegido</h2>
                  <ul className="space-y-4 w-full">
                    {cart.map(item => {
                      const sopa = SOPAS.find(x => x.id === item.sopaId);
                      const caldoBase = CALDOS_BASE.find(x => x.id === item.caldoBaseId);
                      const agregadosSeleccionados = getAgregadosSeleccionados(item, sopa);
                      const includeCaldoIngredients = item.includeCaldoIngredients !== false;
                      const tandasSopa = getTandasSopa(item, sopa);
                      const tandasCaldo = getTandasCaldo(item);
                      const tandasCaldoCompletas = tandasCaldo === 1 ? 'completa' : 'completas';
                      const isLegacyPortionItem = item.tandasSopa === undefined && item.porcionesDeseadas !== undefined;
                      const caldoRecomendado = sopa ? CALDOS_BASE.find(x => x.id === sopa.caldo_base_sugerido_id) : undefined;
                      const reemplazaRecomendado = !!caldoRecomendado && !!caldoBase && caldoRecomendado.id !== caldoBase.id;
                      return (
                        <li key={item.id} className="flex flex-col gap-2 border-b border-surface-variant last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between text-on-surface-variant font-body-md w-full">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                <span className="truncate text-on-surface">{sopa?.nombre}</span>
                              </div>
                              <span className="pl-3.5 text-body-md">
                                Sopa: {sopa?.nombre}
                              </span>
                              <span className="pl-3.5 text-body-md">
                                Categoría: {sopa?.categoria_sopa}
                              </span>
                              <span className="pl-3.5 text-body-md">
                                Rinde según ebook: {formatYieldText(sopa?.porciones ?? '')} por tanda
                              </span>
                              <span className="pl-3.5 text-body-md">
                                Tandas de sopa: {formatTandasLabel(tandasSopa)}
                              </span>
                              {sopa && (
                                <span className="pl-3.5 text-body-md">
                                  Vas a preparar: {formatTandasLabel(tandasSopa)} = {formatYieldText(formatEstimatedYield(sopa.porciones, tandasSopa))} estimadas
                                </span>
                              )}
                              {isLegacyPortionItem && (
                                <span className="pl-3.5 text-body-md">
                                  Lista anterior: se conserva el ajuste equivalente guardado
                                </span>
                              )}
                              <span className="pl-3.5 text-body-md">
                                Caldo recomendado: {caldoRecomendado?.nombre}
                              </span>
                              <span className="pl-3.5 text-body-md">
                                Caldo seleccionado: {caldoBase?.nombre}
                              </span>
                              {reemplazaRecomendado && caldoRecomendado && (
                                <span className="pl-3.5 text-body-md">
                                  Reemplaza el recomendado: {caldoRecomendado.nombre}
                                </span>
                              )}
                              <span className="pl-3.5 text-body-md">
                                Estado del caldo: {includeCaldoIngredients ? 'a preparar' : 'ya preparado'}
                              </span>
                              {includeCaldoIngredients && (
                                <span className="pl-3.5 text-body-md">
                                  Tandas de caldo: {formatTandasLabel(tandasCaldo)} {tandasCaldoCompletas}
                                </span>
                              )}
                              <span className="pl-3.5 text-body-md">
                                Ingredientes de sopa: receta original {formatBatchFactor(tandasSopa)}
                              </span>
                              {agregadosSeleccionados.length > 0 && (
                                <span className="pl-3.5 text-body-md">
                                  Agregados: {agregadosSeleccionados.map(agregadoSeleccionado => {
                                    const agregado = AGREGADOS_FAMILIARES.find(a => a.id === agregadoSeleccionado.agregadoId);
                                    return `${agregado?.nombre ?? 'Agregado'} para ${agregadoSeleccionado.platosAgregado} ${agregadoSeleccionado.platosAgregado === 1 ? 'plato' : 'platos'}`;
                                  }).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-4 bg-background rounded-full border border-outline-variant px-2 py-1 shadow-sm">
                              <button onClick={() => tandasSopa > 1 ? onUpdateCart(item.id, tandasSopa - 1) : onRemoveItem(item.id)} className="w-10 h-10 flex items-center justify-center text-primary bg-surface-container-highest rounded-full active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[24px]">{tandasSopa <= 1 ? 'delete' : 'remove'}</span>
                              </button>
                              <span className="font-display-lg text-2xl font-bold text-on-surface w-12 text-center">{formatTandasLabel(tandasSopa).replace(/ tandas?$/, '')}</span>
                              <button onClick={() => onUpdateCart(item.id, tandasSopa + 1)} className="w-10 h-10 flex items-center justify-center text-primary bg-primary-container text-white rounded-full active:scale-95 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[24px] icon-fill">add</span>
                              </button>
                            </div>
                            <button onClick={() => onRemoveItem(item.id)} className="flex items-center justify-center w-12 h-12 text-error hover:bg-error-container hover:text-on-error-container rounded-full active:scale-95 transition-all">
                              <span className="material-symbols-outlined text-[28px]">close</span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button onClick={onAddMore} className="w-full min-h-[52px] py-3 px-4 bg-transparent text-primary border-2 border-primary border-dashed rounded-xl flex items-center justify-center gap-2 font-label-lg mt-4 hover:bg-primary/5 transition-colors active:scale-[0.98] text-center">
            <span className="material-symbols-outlined icon-fill">add</span>
            Agregar otra sopa
          </button>
        </section>

        {Object.keys(groups.caldoNecesario).length > 0 && (
          <section className="space-y-stack-md">
            <div className="flex items-center gap-3 border-b border-surface-variant pb-2">
              <span className="material-symbols-outlined text-secondary icon-fill">water_drop</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Caldo necesario para esta sopa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groups.caldoNecesario).map(([catName, items]) => (
                items.map(data => (
                  <label key={`${catName}-${data.nombre}-${data.unidad}`} className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform has-[:checked]:bg-surface-container-low has-[:checked]:opacity-50">
                    <input className="checkbox-custom sr-only peer" type="checkbox" />
                    <div className="w-8 h-8 rounded border-2 border-outline flex items-center justify-center transition-colors duration-200 shrink-0 bg-surface-container-lowest peer-checked:bg-primary peer-checked:border-primary">
                      <span className="material-symbols-outlined text-on-primary text-[20px] opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 icon-fill">check</span>
                    </div>
                    <div className="flex-1 flex items-start gap-4 peer-checked:line-through">
                      <span className="font-label-lg text-primary text-left whitespace-nowrap w-24 shrink-0">
                        {formatearMedida(data.cantidad, data.unidad)}
                      </span>
                      <span className="font-body-lg text-on-surface text-left break-words flex-1 leading-tight mt-[1px]">
                        {data.nombre}
                      </span>
                    </div>
                  </label>
                ))
              ))}
            </div>
          </section>
        )}

        {Object.keys(groups.ingredientes).length > 0 && (
          <section className="space-y-stack-md">
            <div className="flex items-center gap-3 border-b border-surface-variant pb-2">
              <span className="material-symbols-outlined text-secondary icon-fill">nutrition</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Ingredientes de la sopa</h3>
            </div>

            <div className="space-y-6">
              {Object.entries(groups.ingredientes).map(([catName, items]) => (
                <div key={catName} className="space-y-3">
                  <h4 className="font-headline-md text-primary">{catName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(data => (
                      <label key={`${data.nombre}-${data.unidad}`} className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform has-[:checked]:bg-surface-container-low has-[:checked]:opacity-50">
                        <input className="checkbox-custom sr-only peer" type="checkbox" />
                        <div className="w-8 h-8 rounded border-2 border-outline flex items-center justify-center transition-colors duration-200 shrink-0 bg-surface-container-lowest peer-checked:bg-primary peer-checked:border-primary">
                          <span className="material-symbols-outlined text-on-primary text-[20px] opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 icon-fill">check</span>
                        </div>
                        <div className="flex-1 flex items-start gap-4 peer-checked:line-through">
                          <span className="font-label-lg text-primary text-left whitespace-nowrap w-20 shrink-0">
                            {formatearMedida(data.cantidad, data.unidad)}
                          </span>
                          <span className="font-body-lg text-on-surface text-left break-words flex-1 leading-tight mt-[1px]">
                            {data.nombre}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {Object.keys(groups.tandasCaldoBase).length > 0 && (
          <section className="space-y-stack-md">
            <div className="flex items-center gap-3 border-b border-surface-variant pb-2">
              <span className="material-symbols-outlined text-secondary icon-fill">kitchen</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Para preparar tandas completas de caldo base</h3>
            </div>

            <div className="space-y-6">
              {Object.entries(groups.tandasCaldoBase).map(([caldoNombre, sections]) => (
                <div key={caldoNombre} className="space-y-4">
                  <h4 className="font-headline-md text-primary">{caldoNombre}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(sections).map(([catName, items]) => (
                      items.map(data => (
                        <label key={`${caldoNombre}-${catName}-${data.nombre}-${data.unidad}`} className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform has-[:checked]:bg-surface-container-low has-[:checked]:opacity-50">
                          <input className="checkbox-custom sr-only peer" type="checkbox" />
                          <div className="w-8 h-8 rounded border-2 border-outline flex items-center justify-center transition-colors duration-200 shrink-0 bg-surface-container-lowest peer-checked:bg-primary peer-checked:border-primary">
                            <span className="material-symbols-outlined text-on-primary text-[20px] opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 icon-fill">check</span>
                          </div>
                          <div className="flex-1 flex items-start gap-4 peer-checked:line-through">
                            <span className="font-label-lg text-primary text-left whitespace-nowrap w-24 shrink-0">
                              {formatearMedida(data.cantidad, data.unidad)}
                            </span>
                            <span className="font-body-lg text-on-surface text-left break-words flex-1 leading-tight mt-[1px]">
                              {data.nombre}
                            </span>
                          </div>
                        </label>
                      ))
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {Object.keys(groups.agregadosFamiliares).length > 0 && (
          <section className="space-y-stack-md">
            <div className="flex items-center gap-3 border-b border-surface-variant pb-2">
              <span className="material-symbols-outlined text-secondary icon-fill">add_circle</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Agregados familiares</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groups.agregadosFamiliares).map(([catName, items]) => (
                items.map(data => (
                  <label key={`${catName}-${data.nombre}-${data.unidad}`} className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform has-[:checked]:bg-surface-container-low has-[:checked]:opacity-50">
                    <input className="checkbox-custom sr-only peer" type="checkbox" />
                    <div className="w-8 h-8 rounded border-2 border-outline flex items-center justify-center transition-colors duration-200 shrink-0 bg-surface-container-lowest peer-checked:bg-primary peer-checked:border-primary">
                      <span className="material-symbols-outlined text-on-primary text-[20px] opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 icon-fill">check</span>
                    </div>
                    <div className="flex-1 flex items-start gap-4 peer-checked:line-through">
                      <span className="font-label-lg text-primary text-left whitespace-nowrap w-20 shrink-0">
                        {formatearMedida(data.cantidad, data.unidad)}
                      </span>
                      <span className="font-body-lg text-on-surface text-left break-words flex-1 leading-tight mt-[1px]">
                        {data.nombre}
                      </span>
                    </div>
                  </label>
                ))
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-[80px] left-0 w-full px-margin-mobile pb-4 pt-6 bg-gradient-to-t from-background via-background to-transparent z-40 max-w-3xl mx-auto right-0 md:bottom-[0px] md:pb-8">
        <div className="flex flex-col gap-3">
          <button onClick={handleWhatsApp} className="w-full min-h-[52px] py-3 px-4 bg-primary text-on-primary rounded-full flex items-center justify-center gap-2 font-label-lg shadow-md hover:bg-primary-container transition-colors active:scale-[0.98] text-center">
            <span className="material-symbols-outlined icon-fill">chat</span>
            Enviar a WhatsApp
          </button>
          <button onClick={goModoCocina} className="w-full min-h-[52px] py-3 px-4 bg-secondary text-on-secondary rounded-full flex items-center justify-center gap-2 font-label-lg shadow-md hover:opacity-90 transition-opacity active:scale-[0.98] text-center">
            <span className="material-symbols-outlined icon-fill">auto_stories</span>
            Preparación
          </button>
        </div>
      </div>

      <BottomNav active="lista" onNavigate={onBottomNav} />
    </div>
  );
}

// Preparación
export function ModoCocina({ cart, onBack, onFinishClear, onBottomNav, onGoCatalogo, onGoHistorial }: { cart: CartItem[]; onBack: () => void; onFinishClear: () => void; onBottomNav: (s: string) => void; onGoCatalogo: () => void; onGoHistorial: () => void }) {
  const uniqueCaldosBase = Array.from(new Set(cart.filter(i => i.includeCaldoIngredients !== false).map(i => i.caldoBaseId))).map(id => CALDOS_BASE.find(c => c.id === id)!);
  const uniqueSopas = Array.from(new Set(cart.map(i => i.sopaId))).map(id => SOPAS.find(s => s.id === id)!);
  const agregadosPorId = cart
    .flatMap(item => {
      const sopa = SOPAS.find(s => s.id === item.sopaId);
      return getAgregadosSeleccionados(item, sopa);
    })
    .reduce((acc, item) => {
      acc.set(item.agregadoId, (acc.get(item.agregadoId) ?? 0) + item.platosAgregado);
      return acc;
    }, new Map<number, number>());
  const agregadosPreparacion = Array.from(agregadosPorId.entries())
    .map(([agregadoId, platosAgregado]) => ({
      agregado: AGREGADOS_FAMILIARES.find(a => a.id === agregadoId),
      platosAgregado,
    }))
    .filter((item): item is { agregado: NonNullable<typeof item.agregado>; platosAgregado: number } => !!item.agregado);

  const isEmpty = cart.length === 0;

  return (
    <div className="bg-surface-container-lowest text-on-background font-body-md antialiased pb-32 min-h-screen flex flex-col">
      <header className="bg-background flex items-center px-margin-mobile h-[72px] w-full max-w-screen-xl mx-auto sticky top-0 z-40">
        <button onClick={onBack} className="text-primary hover:opacity-80 transition-opacity p-2 -ml-2 rounded-full">
          <span className="material-symbols-outlined icon-fill text-[28px]">arrow_back</span>
        </button>
        <h1 className="ml-4 font-headline-md text-headline-md text-primary font-bold">Sopas que Deshinchan</h1>
      </header>

      <main className="max-w-screen-md mx-auto px-margin-mobile pt-stack-sm pb-stack-lg flex-grow flex flex-col w-full">
        {isEmpty ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 py-12">
            <h2 className="font-display-lg text-display-lg text-on-background">
              Todavía no seleccionaste ninguna sopa para preparar.
            </h2>
            <div className="w-full flex flex-col gap-4 mt-8">
              <button onClick={onGoCatalogo} className="w-full h-auto min-h-[52px] py-3 px-4 bg-primary text-on-primary font-label-lg text-label-lg rounded-full shadow-md flex items-center justify-center gap-3 hover:opacity-90 transition-opacity active:scale-[0.98] text-center">
                Ir al Catálogo a elegir
              </button>
              <button onClick={onGoHistorial} className="w-full h-auto min-h-[52px] py-3 px-4 bg-surface text-primary border-2 border-primary-container/20 font-label-lg text-label-lg rounded-full shadow-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98] text-center">
                Ver mis listas anteriores
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-stack-lg border-b-2 border-surface-variant pb-stack-md">
              <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md mb-stack-sm">Preparación</span>
              <h2 className="font-display-lg text-display-lg text-primary mb-stack-sm">Instrucciones</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Sigue los pasos originales de cada receta.</p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Las cantidades de la lista de compras ya están ajustadas según las tandas y platos elegidos.</p>
            </div>

            {uniqueCaldosBase.length > 0 && (
              <section className="mb-stack-lg">
                <div className="flex items-center gap-4 mb-stack-md">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                    <span className="material-symbols-outlined icon-fill">blender</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-on-background">1. Preparar Caldos Base</h3>
                </div>

                <div className="space-y-6">
                  {uniqueCaldosBase.map(caldo => (
                    <div key={caldo.id} className="space-y-4">
                      <div className="px-2">
                        <h4 className="font-headline-md text-primary">#{caldo.numero} {caldo.nombre}</h4>
                        {caldo.subtitulo && (
                          <p className="font-label-md text-label-md text-secondary">{caldo.subtitulo}</p>
                        )}
                      </div>
                      {caldo.preparacion.map((step, idx) => (
                        <div key={idx} className="p-6 rounded-xl border border-outline-variant shadow-sm bg-surface-container-low">
                          <p className="font-body-lg text-body-lg text-on-background">{step}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-4 mb-stack-md">
                <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined icon-fill">view_agenda</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-background">{uniqueCaldosBase.length > 0 ? '2' : '1'}. Cocinar Sopas</h3>
              </div>

              {uniqueSopas.map(sopa => (
                <div key={sopa.id} className="mb-12">
                  <h4 className="font-headline-md text-secondary px-2 mb-4">{sopa.nombre}</h4>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-surface-variant">
                    {sopa.pasos_preparacion.map((paso, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === sopa.pasos_preparacion.length - 1;
                      const colorClass = isFirst ? 'bg-primary-container text-on-primary-container' : isLast ? 'bg-tertiary-container text-on-tertiary' : 'bg-surface-variant text-on-surface-variant';
                      const borderColor = isFirst ? 'group-hover:border-primary' : isLast ? 'group-hover:border-tertiary' : '';

                      return (
                        <div key={idx} className={`relative flex items-center justify-between md:justify-normal group ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-surface-container-lowest shadow-sm z-10 shrink-0 md:mx-auto ${colorClass}`}>
                            <span className="font-headline-md text-headline-md">{idx + 1}</span>
                          </div>
                          <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-xl border border-outline-variant shadow-sm transition-colors ml-4 md:ml-0 bg-surface-container-low ${borderColor} ${idx % 2 !== 0 ? 'md:mr-0' : ''}`}>
                            <h4 className="font-label-lg text-label-lg mb-1">{paso.titulo}</h4>
                            <p className="font-body-lg text-body-lg text-on-background">{paso.descripcion}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {sopa.tip && (
                    <div className="mt-4 p-6 rounded-xl border border-outline-variant shadow-sm bg-surface-container-low">
                      <h5 className="font-label-lg text-label-lg mb-1">Tip</h5>
                      <p className="font-body-lg text-body-lg text-on-background">{sopa.tip}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {agregadosPreparacion.length > 0 && (
              <section className="mt-stack-lg">
                <div className="flex items-center gap-4 mb-stack-md">
                  <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-sm shrink-0">
                    <span className="material-symbols-outlined icon-fill">add_circle</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-on-background">{uniqueCaldosBase.length > 0 ? '3' : '2'}. Agregados familiares opcionales</h3>
                </div>
                <div className="space-y-4">
                  {agregadosPreparacion.map(({ agregado, platosAgregado }) => (
                    <div key={agregado.id} className="p-6 rounded-xl border border-outline-variant shadow-sm bg-surface-container-low">
                      <span className="font-label-md text-label-md text-secondary">#{agregado.numero} · {agregado.cantidadSugerida}</span>
                      <h4 className="font-label-lg text-label-lg mb-1">{agregado.nombre}</h4>
                      <p className="font-body-lg text-body-lg text-on-background">Agregar directo en el plato para {platosAgregado} {platosAgregado === 1 ? 'plato' : 'platos'}.</p>
                      <p className="font-body-lg text-body-lg text-on-background mt-2">{agregado.descripcion}</p>
                      <p className="font-body-lg text-body-lg text-on-background mt-2">{agregado.tipPractico}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-stack-lg flex justify-center">
              <button onClick={onFinishClear} className="bg-primary text-on-primary min-h-[52px] py-3 px-8 rounded-full font-label-lg text-label-lg shadow-md hover:opacity-90 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-center w-full sm:w-auto">
                <span className="material-symbols-outlined icon-fill">done_all</span>
                Terminar y Volver
              </button>
            </div>
          </>
        )}
      </main>
      <BottomNav active="cocina" onNavigate={onBottomNav} />
    </div>
  );
}

// Historial
export function Historial({ lists, onOpen, onBack, onDelete, onClear }: { lists: SavedList[]; onOpen: (list: SavedList) => void; onBack: () => void; onDelete: (id: string) => void; onClear: () => void }) {
  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que querés borrar esta lista?')) {
      onDelete(id);
    }
  };

  const confirmClear = () => {
    if (window.confirm('¿Estás seguro de que querés borrar esta lista?')) {
      onClear();
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-background flex flex-col">
      <header className="bg-surface-bright shadow-sm flex items-center gap-4 w-full px-gutter-mobile h-16 sticky top-0 z-50">
        <button onClick={onBack} className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</button>
        <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">Mis Listas</h1>
      </header>
      <main className="px-margin-mobile pt-stack-md pb-stack-lg flex-grow space-y-stack-md max-w-xl mx-auto w-full flex flex-col">
        {lists.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant font-body-lg flex-grow flex items-center justify-center">
            No tienes listas guardadas.
          </div>
        ) : (
          <div className="space-y-4 flex-grow flex flex-col">
            <div className="space-y-4">
              {lists.map(list => {
                const totalTandas = list.items.reduce((acc, curr) => {
                  const sopa = SOPAS.find(x => x.id === curr.sopaId);
                  return acc + getTandasSopa(curr, sopa);
                }, 0);

                return (
                  <div key={list.id} onClick={() => onOpen(list)} className="bg-surface-container-low rounded-xl p-5 border border-outline-variant custom-shadow cursor-pointer hover:border-primary transition-all flex items-center justify-between group">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{new Date(list.date).toLocaleDateString()}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">{formatTandasLabel(totalTandas)} en total</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => confirmDelete(e, list.id)} className="w-[52px] h-[52px] flex items-center justify-center rounded-full text-error bg-surface hover:bg-error-container hover:text-on-error-container transition-colors active:scale-95 shadow-sm border border-transparent hover:border-error/20">
                        <span className="material-symbols-outlined text-[28px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 mt-auto flex justify-center w-full">
              <button onClick={confirmClear} className="w-full bg-error-container text-on-error-container min-h-[64px] py-4 px-6 rounded-full font-label-lg text-label-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-error/20 my-4 text-center">
                <span className="material-symbols-outlined icon-fill text-[28px]">delete_sweep</span>
                Vaciar todo el historial
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
