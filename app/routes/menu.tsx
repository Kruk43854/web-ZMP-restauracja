import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useWebSocket } from "../hooks/useWebSocket";
import { ref } from "process";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Menu() {
  const { t } = useTranslation();
  const { isAuthenticated, authFetch } = useAuth();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allergens, setAllergens] = useState<any[]>([]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;
    const handleMenuUpdate = () => {
        console.log("Wykryto zmianę na serwerze! Odświeżam menu...");
        setRefreshTrigger(prev => prev + 1);
    };
    const subMenuUpdates = subscribe('/topic/menu/updates', handleMenuUpdate);
    const subMenuAvailability = subscribe('/topic/menu', handleMenuUpdate);
    const subDictAvailability = subscribe('/topic/menu/availability', handleMenuUpdate);

    return () => {
      subMenuUpdates?.unsubscribe();
      subMenuAvailability?.unsubscribe();
      subDictAvailability?.unsubscribe();
    };
  }, [isConnected, subscribe]);

  useEffect(() => {
    document.title = t("menu.title", "Menu") + " - Qui la Carne";
  }, [t]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const menuRes = await authFetch('/api/dishes?page=1&size=100');
          
          if (menuRes.ok) {
            const menuData = await menuRes.json();
            setMenuItems(menuData.data?.items || []);
          } else {
            setError(`Odmowa dostępu do dań (Kod: ${menuRes.status}).`);
          }
          try {
            const [catRes, algRes] = await Promise.all([
              authFetch('/api/dictionary/dish-categories'),
              authFetch('/api/dictionary/allergens')
            ]);

            if (catRes.ok) {
              const catData = await catRes.json();
              setCategories(catData.data || []);
            }
            if (algRes.ok) {
              const algData = await algRes.json();
              setAllergens(algData.data || []);
            }
          } catch (dictionaryError) {
            console.warn("Błąd autoryzacji do słowników (403). Filtry mogą być niedostępne.");
          }
        } else {
          const response = await fetch(`${API_URL}/api/dishes/menu/public`, {
            headers: { "Accept-Language": i18n.language }
          });
          if (response.ok) {
            const result = await response.json();
            const flatItems = (result.data?.menu || []).flatMap((cat: any) => 
              (cat.dish || []).map((d: any) => ({
                ...d,
                categoryName: cat.category,
                ingredients: d.ingridents || []
              }))
            );
            setMenuItems(flatItems);
          }
        }
      } catch (err) {
        setError(t("menu.error_connection", "Błąd połączenia z serwerem."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, i18n.language, authFetch, refreshTrigger]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter(dish => {
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(dish.categoryName || dish.category?.name);

      const hasExcludedAllergen = excludedAllergens.some(excluded => 
        dish.allergens?.some((dishAlg: any) => 
          (typeof dishAlg === 'string' ? dishAlg : dishAlg.name) === excluded
        )
      );

      return matchesCategory && !hasExcludedAllergen;
    });
  }, [menuItems, selectedCategories, excludedAllergens]);

  const groupedMenu = filteredMenu.reduce((acc: any, dish: any) => {
    const category = dish.categoryName || dish.category?.name || "Inne";
    if (!acc[category]) acc[category] = [];
    acc[category].push(dish);
    return acc;
  }, {});

  const toggleCategory = (name: string) => {
    setSelectedCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleAllergen = (name: string) => {
    setExcludedAllergens(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <main className="grow pt-16 bg-gray-50 min-h-screen">
      <header className="relative h-48 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/tlo.jpg')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative z-10 text-5xl italic font-bold font-fancy text-red-500">{t('menu.title', 'Menu')}</h1>
      </header>

      <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-8 py-12">
        
        {isAuthenticated && !isLoading && (categories.length > 0 || allergens.length > 0) && (
          <aside className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              
              {categories.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">{t('menu.filter_categories', 'Kategorie')}</h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat.token || cat.id || cat.name} 
                        onClick={() => toggleCategory(cat.name)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          selectedCategories.includes(cat.name) ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {allergens.length > 0 && (
                <>
                  <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${categories.length > 0 ? 'mt-8' : ''} text-orange-700`}>
                    {t('menu.filter_allergens', 'Wyklucz alergeny')}
                  </h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {allergens.map(alg => (
                      <button 
                        key={alg.token || alg.id || alg.name} 
                        onClick={() => toggleAllergen(alg.name)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          excludedAllergens.includes(alg.name) ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        {excludedAllergens.includes(alg.name) ? '✕ ' : ''}{alg.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {(selectedCategories.length > 0 || excludedAllergens.length > 0) && (
                <button 
                  onClick={() => {setSelectedCategories([]); setExcludedAllergens([]);}}
                  className="mt-6 w-full py-2 text-sm text-gray-400 hover:text-red-600 transition-colors underline"
                >
                  {t('menu.clear_filters', 'Wyczyść wszystkie filtry')}
                </button>
              )}
            </div>
          </aside>
        )}

        <section className="flex">
          {isLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-700"></div></div>
          ) : filteredMenu.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
               <p className="text-gray-500 text-lg">{t('menu.no_results', 'Nie znaleziono dań spełniających Twoje kryteria.')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {Object.entries(groupedMenu).map(([categoryName, dishes]: [string, any]) => (
                <div key={categoryName}>
                  <h2 className="text-3xl font-bold font-fancy mb-6 border-l-4 border-red-600 pl-4">{categoryName}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dishes.map((dish: any) => (
                      <div key={dish.token || dish.id || dish.name} className="bg-white rounded-3xl shadow-md overflow-hidden flex group hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-1/3 overflow-hidden">
                          <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/999999?text=Brak+zdjęcia'; }} />
                        </div>
                        <div className="w-2/3 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{dish.name}</h3>
                            <p className="text-gray-500 text-xs line-clamp-2">{dish.ingredients?.map((i: any) => i.name || i).join(', ')}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-2xl font-black">{dish.price ? (dish.price / 100).toFixed(2) : '0.00'} PLN</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}