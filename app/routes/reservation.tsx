import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Reservation() {
    const { isAuthenticated, token } = useAuth();
    const { t, i18n } = useTranslation();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [tableToken, setTableToken] = useState("");

    const [tables, setTables] = useState<any[]>([]);
    const [isFetchingTables, setIsFetchingTables] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = t("navbar.reservation") + " - Qui la Carne";
    }, [t]);

    useEffect(() => {
        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end) {
                fetchAvailableTables(start.toISOString(), end.toISOString());
            } else {
                setTables([]);
                setTableToken("");
            }
        }
    }, [startTime, endTime, i18n.language]);

    const fetchAvailableTables = async (startIso: string, endIso: string) => {
        setIsFetchingTables(true);
        try {
            const queryParams = new URLSearchParams({
                startTime: startIso,
                endTime: endIso
            });

            const response = await fetch(`/api/tables?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Accept-Language": i18n.language, 
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            const data = await response.json().catch(() => null);

            if (response.ok && data?.success) {
                setTables(data.data || []);
                setTableToken(""); 
            } else {
                setTables([]);
            }
        } catch (err) {
            console.error("Błąd podczas pobierania stolików:", err);
            setTables([]);
        } finally {
            setIsFetchingTables(false);
        }
    };

    const handleReservation = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!token) {
            setError(t("reservation.error_unauthorized"));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tableToken,
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                    dishes: []
                }),
            });

            let data: any = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok || data?.success === false) {
                setError((data && (data.message || data.error)) ?? t("reservation.error_generic"));
                return;
            }

            setSuccessMsg(data?.message ?? t("reservation.success_message"));

            setTableToken("");
            setStartTime("");
            setEndTime("");
            setTables([]);

        } catch (err) {
            console.error("Error creating reservation:", err);
            setError(t("reservation.connection_error"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
       <main className="grow pt-16">
          <header 
            className="relative h-[calc(100vh-4rem)] bg-cover bg-center"
            style={{ backgroundImage: "url('/tlo.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center py-10 overflow-y-auto">
              <div className="text-center text-white px-4 w-full max-w-4xl mx-auto my-auto">
                
                <h1 className="text-5xl md:text-7xl italic font-bold font-fancy mb-6 tracking-wide text-red-500 mt-10">
                  {t('reservation.title')}
                </h1>
                
                <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto">
                  {t('reservation.description')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
                
                {!isAuthenticated ? (
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold font-fancy">{t('reservation.login_required_title')}</h2>
                        <p className="text-gray-600">{t('reservation.login_required_desc')}</p>
                        <Link to="/login" className="mt-4 w-full bg-red-700 text-white font-bold py-4 rounded-xl hover:bg-red-800 transition-colors shadow-lg">
                            {t('navbar.login')}
                        </Link>
                    </div>
                ) : (
                  <form 
                    onSubmit={handleReservation} 
                    className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100 text-left"
                  >
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-200 text-center">
                        {error}
                      </div>
                    )}

                    {successMsg && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-200 text-center">
                        {successMsg}
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                        {t('reservation.startTime')}
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                        {t('reservation.endTime')}
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
                      />
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                        {t('reservation.tableToken')}
                      </label>
                      
                      {!startTime || !endTime ? (
                          <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 italic text-sm">
                              {t('reservation.select_dates_first')}
                          </div>
                      ) : isFetchingTables ? (
                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm animate-pulse">
                              {t('reservation.fetching_tables')}
                          </div>
                      ) : tables.length === 0 ? (
                          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                              {t('reservation.no_tables')}
                          </div>
                      ) : (
                          <select
                            required
                            value={tableToken}
                            onChange={(e) => setTableToken(e.target.value)}
                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left cursor-pointer"
                          >
                            <option value="" disabled>{t('reservation.choose_table')}</option>
                            {tables.map(table => (
                               <option key={table.token || table.tableToken || table.id} value={table.token || table.tableToken || table.id}>
                                   {table.name || `Stolik`} - {table.status} ({t('reservation.capacity')}: {table.capacity || '?'})
                               </option>
                            ))}
                          </select>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading || !tableToken}
                      className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center ${
                        isLoading || !tableToken ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                    >
                      {isLoading ? (
                        <span className="animate-pulse">{t('reservation.loading')}</span>
                      ) : (
                        t('reservation.submitBtn')
                      )}
                    </button>
                  </form>
                )}
                </div>
                
              </div>
            </div>
          </header>
        </main>
    );
}