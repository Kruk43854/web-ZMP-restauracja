import { useState, useEffect, use } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Menu() {
  const { t } = useTranslation();
  const { isAuthenticated, authFetch } = useAuth();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("menu.title", "Menu") + " - Qui la Carne";
  }, [t]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await authFetch('/api/dishes?page=1&size=15', {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Accept-Language": i18n.language,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const items = result.data?.items || [];
          setMenuItems(items); 
        } else {
          setError(`Odmowa dostępu (Kod: ${response.status}).`);
        }
      } catch (err) {
        setError("Wystąpił błąd przy połączeniu z serwerem.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [i18n.language, authFetch]);

useEffect(() => {
  if (isAuthenticated) return;

  const fetchGuestMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dishes/menu/public', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Accept-Language": i18n.language,
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        const publicMenuCategories = result.data?.menu || [];
        
        const flatItems = publicMenuCategories.flatMap((categoryObj: any) => {
           return (categoryObj.dish || []).map((d: any) => ({
              ...d,
              categoryName: categoryObj.category, 
              ingredients: d.ingridents || [], 
           }));
        });

        setMenuItems(flatItems);
      } else {
        setError(`Odmowa dostępu (Kod: ${response.status}).`);
      }
    } catch (err) {
      setError("Wystąpił błąd przy połączeniu z serwerem.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchGuestMenu();
}, [i18n.language, isAuthenticated]);


  const formatPrice = (priceInGrosze: number) => {
    if (!priceInGrosze) return "0.00 PLN";
    return (priceInGrosze / 100).toFixed(2) + " PLN";
  };


  const groupedMenu = menuItems.reduce((acc: any, dish: any) => {
    const category = dish.categoryName || "Inne"; 

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(dish);
    return acc;
  }, {});

return (
    <main className="grow pt-16 bg-gray-50 min-h-screen">
      
      <header 
        className="relative h-64 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl italic font-bold font-fancy mb-4 tracking-wide text-red-500 drop-shadow-lg">
            {t('menu.title', 'Nasze Menu')}
          </h1>
        </div>
      </header>

      <section className="container mx-auto px-4 max-w-7xl -mt-12 relative z-20 mb-24">
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-3xl shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-lg mx-auto">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {Object.entries(groupedMenu).map(([categoryName, dishes]: [string, any]) => (
              <div key={categoryName} className="flex flex-col items-center">
                
                <div className="text-center mb-10 bg-white px-10 py-4 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-4xl md:text-5xl font-bold font-fancy text-gray-800 capitalize">
                    {categoryName}
                  </h2>
                  <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {dishes.map((dish: any) => (
                    <div key={dish.token || dish.name} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group">
                      
                      <div className="h-64 overflow-hidden relative bg-gray-100 z-10">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/999999?text=Brak+zdjęcia'; }}
                        />
                      </div>
                      
                      <div className="p-8 flex flex-col grow bg-white z-20 relative">
                            <div className="flex justify-between items-start gap-4 mb-3">
                              <h3 className="text-2xl font-bold font-fancy text-gray-800">{dish.name}</h3>
                              
                              {dish.allergens && dish.allergens.length > 0 && (
                                <div className="relative group shrink-0">
                                  
                                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center cursor-help transition-all border border-orange-100 group-hover:bg-orange-500 group-hover:text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  </div>
                                  
                                  <div className="absolute bottom-full right-0 mb-3 w-max max-w-55 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <p className="font-bold text-orange-300 mb-1 uppercase tracking-wider text-[10px]">
                                      {t('menu.allergens', 'Alergeny:')}
                                    </p>
                                    <p className="leading-relaxed">
                                      {dish.allergens.join(', ')}
                                    </p>
                                    <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900"></div>
                                  </div>

                                </div>
                              )}
                            </div>
                        <p className="text-gray-500 text-sm mb-6 grow leading-relaxed">
                          {dish.ingredients && dish.ingredients.length > 0
                            ? dish.ingredients.map((ing: any) => ing.name || ing).join(', ')
                            : <span className="italic opacity-50">Brak dokładnego opisu</span>
                          }
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-100">
                          <span className="text-3xl font-black text-gray-900 tracking-tight">
                            {formatPrice(dish.price)}
                          </span>
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
      
    </main>
  );
}