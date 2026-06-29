import { useState, useEffect } from 'react';
import { Inicio, Catalogo, CaldoRecomendado, OtrosCaldosBase, TandasSopa, AgregadosOpcionales, Bucle, ListaCompras, ModoCocina, Historial } from './screens';
import { SOPAS } from './data';
import { AgregadoSeleccionado, CartItem, SavedList } from './types';

type ScreenState = 'inicio' | 'catalogo' | 'caldoRecomendado' | 'otrosCaldos' | 'tandas' | 'agregados' | 'bucle' | 'lista' | 'cocina' | 'historial';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('inicio');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selection, setSelection] = useState<Partial<CartItem>>({});
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]); // Se ejecuta cada vez que cambia la pantalla

  useEffect(() => {
    const saved = localStorage.getItem('soup-lists');
    if (saved) {
      setSavedLists(JSON.parse(saved));
    }
  }, []);

  const handleBottomNav = (id: string) => {
    if (id === 'catalogo') {
      setCurrentScreen('catalogo');
    } else if (id === 'lista') {
      setCurrentScreen('lista');
    } else if (id === 'cocina') {
      setCurrentScreen('cocina');
    }
  };

  const goHome = () => {
    setCart([]);
    setSelection({});
    setCurrentScreen('inicio');
  };

  const startNew = () => {
    setCart([]);
    setSelection({});
    setCurrentScreen('catalogo');
  };

  const handleSelectSoup = (id: number) => {
    const sopa = SOPAS.find(s => s.id === id);
    setSelection({ sopaId: id, caldoBaseId: sopa?.caldo_base_sugerido_id, porcionesBase: sopa?.porcionesBase, agregadoIds: [], agregadosSeleccionados: [], includeCaldoIngredients: true, tandasCaldo: 1 });
    setCurrentScreen('caldoRecomendado');
  };

  const handleSelectCaldoBase = (caldoBaseId: number, includeCaldoIngredients: boolean) => {
    setSelection(prev => ({ ...prev, caldoBaseId, includeCaldoIngredients, tandasCaldo: includeCaldoIngredients ? (prev.tandasCaldo ?? 1) : undefined }));
    setCurrentScreen('tandas');
  };

  const handleChangeCaldoBase = () => {
    setCurrentScreen('otrosCaldos');
  };

  const handleAddBatches = (tandasSopa: number, tandasCaldo?: number) => {
    setSelection(prev => ({ ...prev, tandasSopa, tandasCaldo: prev.includeCaldoIngredients !== false ? tandasCaldo : undefined }));
    setCurrentScreen('agregados');
  };

  const handleConfirmAgregados = (agregadosSeleccionados: AgregadoSeleccionado[]) => {
    const sopa = SOPAS.find(s => s.id === selection.sopaId!);
    const agregadoIds = agregadosSeleccionados.map(agregado => agregado.agregadoId);
    setCart(prev => [
      ...prev,
        {
          id: crypto.randomUUID(),
          sopaId: selection.sopaId!,
          caldoBaseId: selection.caldoBaseId!,
          agregadoIds,
          agregadosSeleccionados,
          tandasSopa: selection.tandasSopa,
          tandasCaldo: selection.includeCaldoIngredients !== false ? selection.tandasCaldo : undefined,
          porcionesBase: selection.porcionesBase ?? sopa?.porcionesBase,
          includeCaldoIngredients: selection.includeCaldoIngredients !== false,
          cantidad: selection.tandasSopa ?? 1
        }
    ]);
    setCurrentScreen('bucle');
  };

  const handleFinish = () => {
    const newList: SavedList = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: cart
    };
    const updatedLists = [newList, ...savedLists];
    setSavedLists(updatedLists);
    localStorage.setItem('soup-lists', JSON.stringify(updatedLists));
    setCurrentScreen('lista');
  };

  const openHistoryList = (list: SavedList) => {
    setCart(list.items);
    setCurrentScreen('lista');
  };
  
  const handleFinishClear = () => {
    setCart([]);
    setSelection({});
    setCurrentScreen('catalogo');
  };

  const handleUpdateCartItem = (id: string, newQty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, cantidad: newQty, tandasSopa: newQty } : item));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteList = (id: string) => {
    const updatedLists = savedLists.filter(list => list.id !== id);
    setSavedLists(updatedLists);
    localStorage.setItem('soup-lists', JSON.stringify(updatedLists));
  };

  const handleClearHistory = () => {
    setSavedLists([]);
    localStorage.removeItem('soup-lists');
  };

  return (
    <>
      {currentScreen === 'inicio' && <Inicio onNewList={startNew} onHistory={() => setCurrentScreen('historial')} onBottomNav={handleBottomNav} />}
      {currentScreen === 'catalogo' && <Catalogo onSelect={handleSelectSoup} onBottomNav={handleBottomNav} />}
      {currentScreen === 'caldoRecomendado' && (
        <CaldoRecomendado
          sopaId={selection.sopaId!} 
          onConfirm={handleSelectCaldoBase} 
          onChangeCaldo={handleChangeCaldoBase}
          onBack={() => setCurrentScreen('catalogo')} 
        />
      )}
      {currentScreen === 'otrosCaldos' && (
        <OtrosCaldosBase
          sopaId={selection.sopaId!}
          initialCaldoBaseId={selection.caldoBaseId}
          onConfirm={handleSelectCaldoBase}
          onBack={() => setCurrentScreen('caldoRecomendado')}
        />
      )}
      {currentScreen === 'tandas' && (
        <TandasSopa 
          sopaId={selection.sopaId!} 
          caldoBaseId={selection.caldoBaseId!} 
          includeCaldoIngredients={selection.includeCaldoIngredients !== false}
          initialTandasSopa={selection.tandasSopa}
          initialTandasCaldo={selection.tandasCaldo}
          onConfirm={handleAddBatches} 
          onBack={() => setCurrentScreen(selection.caldoBaseId === SOPAS.find(s => s.id === selection.sopaId)?.caldo_base_sugerido_id ? 'caldoRecomendado' : 'otrosCaldos')} 
        />
      )}
      {currentScreen === 'agregados' && (
        <AgregadosOpcionales
          initialAgregadoIds={selection.agregadoIds}
          initialAgregadosSeleccionados={selection.agregadosSeleccionados}
          onConfirm={handleConfirmAgregados}
          onBack={() => setCurrentScreen('tandas')}
        />
      )}
      {currentScreen === 'bucle' && (
        <Bucle 
          onAddMore={() => setCurrentScreen('catalogo')} 
          onFinish={handleFinish} 
        />
      )}
      {currentScreen === 'lista' && (
        <ListaCompras 
          cart={cart} 
          goModoCocina={() => setCurrentScreen('cocina')} 
          goInicio={goHome} 
          onBottomNav={handleBottomNav}
          onUpdateCart={handleUpdateCartItem}
          onRemoveItem={handleRemoveCartItem}
          onAddMore={() => setCurrentScreen('catalogo')}
        />
      )}
      {currentScreen === 'cocina' && (
        <ModoCocina 
          cart={cart} 
          onBack={() => setCurrentScreen('lista')} 
          onFinishClear={handleFinishClear}
          onBottomNav={handleBottomNav}
          onGoCatalogo={() => setCurrentScreen('catalogo')}
          onGoHistorial={() => setCurrentScreen('historial')}
        />
      )}
      {currentScreen === 'historial' && (
        <Historial 
          lists={savedLists} 
          onOpen={openHistoryList} 
          onBack={() => setCurrentScreen('inicio')} 
          onDelete={handleDeleteList}
          onClear={handleClearHistory}
        />
      )}
    </>
  );
}
