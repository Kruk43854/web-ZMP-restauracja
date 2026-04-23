import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import ReservationDetailsModal from "../modals/reservation-details"; 

export default function Menu() {
  const { t } = useTranslation();
  const { isAuthenticated, authFetch } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);  
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("myreservations.title", "Moje rezerwacje") + " - Qui la Carne";
  }, [t]);

  const fetchMyReservations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: "1",
        size: "50"
      });

      const response = await authFetch(`/api/reservations?${params.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Accept-Language": i18n.language,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setReservations(result.data?.items || []); 
      } else {
        setError(t('myreservations.fetchError', 'Nie udało się pobrać rezerwacji.'));
      }
    } catch (err) {
      setError(t('myreservations.networkError', 'Błąd połączenia z serwerem.'));
    } finally {
      setIsLoading(false); 
    }
  };
  useEffect(() => {
    fetchMyReservations();
  }, [i18n.language]);

  const cancelReservation = async (token: string) => {
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await authFetch(`/api/reservations/${token}/cancel`, {
        method: "PATCH", 
        headers: {
          "Accept": "application/json",
          "Accept-Language": i18n.language,
        },
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success !== false) {
          setSuccessMsg(t('myreservations.cancelSuccess', 'Rezerwacja została anulowana.'));
          await fetchMyReservations(); 
      } else {
          const errorMsg = data?.message || data?.errorMessages?.[0] || t('myreservations.cancelError', 'Nie udało się anulować rezerwacji.');
          setError(errorMsg);
      }
    } catch (err) {
      setError(t('myreservations.networkError', 'Błąd połączenia z serwerem.'));
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat(i18n.language, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  const formatTime = (isoString: string) => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <main className="grow pt-16 bg-gray-50 min-h-screen relative">
      <header 
        className="relative h-64 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl italic font-bold font-fancy mb-4 tracking-wide text-red-500 drop-shadow-lg">
            {t('myreservations.title', 'Moje rezerwacje')}
          </h1>
        </div>
      </header>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-200 text-center">
          {successMsg}
        </div>
      )}

      <section className="container mx-auto p-4 max-w-7xl -mt-8 relative z-20 mb-16">
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-lg mx-auto">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : reservations.length === 0 ? (

          <div className="flex flex-col gap-12 pt-20">    
            <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-bold text-2xl mb-4">
                {t('myreservations.noReservations', 'Nie masz jeszcze żadnych rezerwacji.')}
              </p>
              <Link to="/reservation" className="inline-block mt-4 px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {t('myreservations.makeFirst', 'Zarezerwuj swój pierwszy stolik')}
              </Link>
            </div>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-20">
            {reservations.map((res: any) => (
              <div key={res.token} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:shadow-2xl transition-all group">
                
                <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {t('myreservations.dateLabel', 'Data wizyty')}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(res.startTime))}
                    </h3>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    res.status === 'Aktywna' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="p-8 flex items-center justify-between bg-gray-50/50">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">{t('myreservations.from', 'Od')}</p>
                    <p className="text-2xl font-black text-gray-900">{formatTime(res.startTime)}</p>
                  </div>
                  <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="h-px w-full bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-300 bg-white rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">{t('myreservations.to', 'Do')}</p>
                    <p className="text-2xl font-black text-gray-900">{formatTime(res.endTime)}</p>
                  </div>
                </div>

                <div className="p-6 mt-auto">
                  <div className="flex items-center gap-3 text-gray-500 mb-6">
                     <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 5v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" /></svg>
                     <span className="text-sm font-medium">Token: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{res.token.substring(0, 8)}...</code></span>
                  </div>
                  
                  <button className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-bold text-sm hover:border-gray-200 hover:text-gray-600 transition-all"
                  onClick={() => setSelectedToken(res.token)}>
                    {t('myreservations.details', 'Szczegóły rezerwacji')}
                  </button>
                  <button className="w-full py-3 rounded-xl border-2 border-red-100 text-red-400 font-bold text-sm hover:border-red-200 hover:text-red-600 transition-all gap-2 mt-4" 
                  onClick={() => cancelReservation(res.token)}>
                    {t('myreservations.delete', 'Usuń rezerwację')}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
      {selectedToken && (
        <ReservationDetailsModal 
          token={selectedToken} 
          onClose={() => setSelectedToken(null)} 
        />
      )}

    </main>
  );
}