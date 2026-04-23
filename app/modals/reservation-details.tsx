import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface ReservationDetailsModalProps {
  token: string;
  onClose: () => void;
}

export default function ReservationDetailsModal({ token, onClose }: ReservationDetailsModalProps) {
  const { authFetch } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [details, setDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch(`/api/reservations/${token}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Accept-Language": i18n.language,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setDetails(result.data || result);
        } else {
          setError(t('myreservations.detailsError', 'Nie udało się załadować szczegółów.'));
        }
      } catch (err) {
        setError(t('myreservations.networkError', 'Błąd połączenia.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [token, i18n.language]);

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold font-fancy text-gray-900 mb-6">
          {t('myreservations.detailsTitle', 'Szczegóły rezerwacji')}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : details && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('details.status', 'Status')}</p>
                <p className={`text-lg font-black ${details.status === 'Aktywna' ? 'text-green-600' : 'text-gray-900'}`}>
                  {details.status || "Nieznany"}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('details.visitHours', 'Godziny wizyty')}</p>
                <p className="text-lg font-black text-gray-900">
                  {details.startTime ? `${formatTime(details.startTime)} - ${formatTime(details.endTime)}` : "Brak danych"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {t('details.yourOrder', 'Twoje zamówienie')}
                </h3>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold">Pre-order</span>
              </div>

              {details.dishes && Array.isArray(details.dishes) && details.dishes.length > 0 ? (
                <div className="space-y-3">
                  {details.dishes.map((dish: any, idx: number) => (
                    <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex justify-between items-start transition-hover hover:bg-white hover:shadow-md group">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-gray-800 group-hover:text-red-700 transition-colors">
                            {dish.dishName || dish.name}
                          </p>
                          <div className="text-right">
                            <p className="text-sm font-black text-gray-900">
                              {(dish.price / 100).toFixed(2)} PLN
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{t('myreservations.quantity', 'szt:')} {dish.quantity}</p>
                          </div>
                        </div>
                        {dish.note && (
                          <div className="mt-2 flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-gray-100">
                            <svg className="w-3 h-3 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
                            <p className="text-xs text-gray-500 italic">"{dish.note}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-end px-2">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('details.totalCost', 'Całkowity koszt')}</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tight">
                        {((details.totalPrice || 0) / 100).toFixed(2)} <span className="text-lg">PLN</span>
                      </p>
                    </div>
                    <p className="text-[14px] text-gray-400 max-w-50 text-right italic">
                      {t('details.paymentInfo', 'Płatność zostanie zrealizowana w restauracji podczas wizyty.')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">{t('myreservations.noDishes', 'No additional dishes in this reservation.')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}