import { useState, useEffect } from "react";
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

      <section className="container mx-auto p-4 max-w-7xl -mt-8 relative z-20 mb-16">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div></div>
        ) : error ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-lg mx-auto"><p className="text-red-600 font-bold">{error}</p></div>
        ) : (
          

          <div className="flex flex-col gap-12 pt-20">
            {Object.entries(groupedMenu).map(([categoryName, dishes]: [string, any]) => (
              
              <div key={categoryName} className="mb-4">

                <h2 className="text-4xl font-bold font-fancy mb-8 border-b-4 border-red-600 inline-block text-gray-800 pb-2">
                  {categoryName}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dishes.map((dish: any) => (
                    
                    <div key={dish.token || dish.name} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group">
                      
                      <div className="h-64 overflow-hidden relative bg-gray-200">
                         <img 
                            src={dish.imageUrl} 
                            alt={dish.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/999999?text=Brak+zdjęcia'; }}
                         />
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold font-fancy text-gray-800 mb-2">{dish.name}</h3>
                        
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                          {dish.ingredients && dish.ingredients.length > 0 
                            ? dish.ingredients.map((ing: any) => ing.name || ing).join(', ')
                            : <span className="italic opacity-50">Brak dokładnego opisu</span>
                          }
                        </p>
                        
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                          <span className="text-3xl font-bold text-gray-900">
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