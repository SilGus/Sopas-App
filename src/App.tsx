import { useState, useEffect } from 'react';
import { Inicio, Catalogo, Aderezo, Porciones, Bucle, ListaCompras, ModoCocina, Historial } from './screens';
import { CartItem, SavedList } from './types';

type ScreenState = 'inicio' | 'catalogo' | 'aderezo' | 'porciones' | 'bucle' | 'lista' | 'cocina' | 'historial';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('inicio');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selection, setSelection] = useState<Partial<CartItem>>({});
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]); // Se ejecuta cada vez que cambia la pantalla

  useEffect(() => {
    const saved = localStorage.getItem('salad-lists');
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

  const handleSelectSalad = (id: number) => {
    setSelection({ ensaladaId: id });
    setCurrentScreen('aderezo');
  };

  const handleSelectAderezo = (id: number) => {
    setSelection(prev => ({ ...prev, aderezoId: id }));
    setCurrentScreen('porciones');
  };

  const handleAddPortions = (qty: number) => {
    setCart(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ensaladaId: selection.ensaladaId!,
        aderezoId: selection.aderezoId!,
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
    localStorage.setItem('salad-lists', JSON.stringify(updatedLists));
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
    setCart(prev => prev.map(item => item.id === id ? { ...item, cantidad: newQty } : item));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteList = (id: string) => {
    const updatedLists = savedLists.filter(list => list.id !== id);
    setSavedLists(updatedLists);
    localStorage.setItem('salad-lists', JSON.stringify(updatedLists));
  };

  const handleClearHistory = () => {
    setSavedLists([]);
    localStorage.removeItem('salad-lists');
  };

  return (
    <>
      {currentScreen === 'inicio' && <Inicio onNewList={startNew} onHistory={() => setCurrentScreen('historial')} onBottomNav={handleBottomNav} />}
      {currentScreen === 'catalogo' && <Catalogo onSelect={handleSelectSalad} onBottomNav={handleBottomNav} />}
      {currentScreen === 'aderezo' && (
        <Aderezo 
          ensaladaId={selection.ensaladaId!} 
          onConfirm={handleSelectAderezo} 
          onBack={() => setCurrentScreen('catalogo')} 
        />
      )}
      {currentScreen === 'porciones' && (
        <Porciones 
          ensaladaId={selection.ensaladaId!} 
          aderezoId={selection.aderezoId!} 
          onConfirm={handleAddPortions} 
          onBack={() => setCurrentScreen('aderezo')} 
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
