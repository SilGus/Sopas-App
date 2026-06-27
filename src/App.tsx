import { useState, useEffect } from 'react';
import { Inicio, Catalogo, CaldoBaseScreen, Porciones, Bucle, ListaCompras, ModoCocina, Historial } from './screens';
import { SOPAS } from './data';
import { CartItem, SavedList } from './types';

type ScreenState = 'inicio' | 'catalogo' | 'caldoBase' | 'porciones' | 'bucle' | 'lista' | 'cocina' | 'historial';

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
    setSelection({ sopaId: id, porcionesBase: sopa?.porcionesBase, agregadoIds: [], includeCaldoIngredients: true });
    setCurrentScreen('caldoBase');
  };

  const handleSelectCaldoBase = (caldoBaseId: number, agregadoIds: number[], includeCaldoIngredients: boolean) => {
    setSelection(prev => ({ ...prev, caldoBaseId, agregadoIds, includeCaldoIngredients }));
    setCurrentScreen('porciones');
  };

  const handleAddPortions = (qty: number) => {
    const sopa = SOPAS.find(s => s.id === selection.sopaId!);
    setCart(prev => [
      ...prev,
        {
          id: crypto.randomUUID(),
          sopaId: selection.sopaId!,
          caldoBaseId: selection.caldoBaseId!,
          agregadoIds: selection.agregadoIds ?? [],
          porcionesDeseadas: qty,
          porcionesBase: selection.porcionesBase ?? sopa?.porcionesBase,
          includeCaldoIngredients: selection.includeCaldoIngredients !== false,
          cantidad: qty
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
    setCart(prev => prev.map(item => item.id === id ? { ...item, cantidad: newQty, porcionesDeseadas: newQty } : item));
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
      {currentScreen === 'caldoBase' && (
        <CaldoBaseScreen
          sopaId={selection.sopaId!} 
          initialCaldoBaseId={selection.caldoBaseId}
          initialAgregadoIds={selection.agregadoIds}
          initialIncludeCaldoIngredients={selection.includeCaldoIngredients !== false}
          onConfirm={handleSelectCaldoBase} 
          onBack={() => setCurrentScreen('catalogo')} 
        />
      )}
      {currentScreen === 'porciones' && (
        <Porciones 
          sopaId={selection.sopaId!} 
          caldoBaseId={selection.caldoBaseId!} 
          includeCaldoIngredients={selection.includeCaldoIngredients !== false}
          onConfirm={handleAddPortions} 
          onBack={() => setCurrentScreen('caldoBase')} 
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
