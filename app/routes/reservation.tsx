import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const START_HOUR = 8;
const END_HOUR = 22;
const MENU_PAGE_SIZE = 50;

interface CartItem {
  dishToken: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

interface Dish {
  token: string;
  name: string;
  price: number;
}

interface Table {
  token?: string;
  tableToken?: string;
  id?: string;
  name: string;
  status: string;
  capacity: number;
}

interface FormState {
  date: string;
  startHour: string;
  endHour: string;
  tableToken: string;
}

interface StatusState {
  isLoading: boolean;
  error: string | null;
  successMsg: string | null;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const UnauthenticatedPrompt = ({ t }: { t: any }) => (
  <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100 text-center">
    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold font-fancy">{t("reservation.login_required_title")}</h2>
    <p className="text-gray-600">{t("reservation.login_required_desc")}</p>
    <Link to="/login" className="mt-4 w-full bg-red-700 text-white font-bold py-4 rounded-xl hover:bg-red-800 transition-colors shadow-lg">
      {t("navbar.login")}
    </Link>
  </div>
);

const MenuList = ({ menuItems, onAdd }: { menuItems: Dish[]; onAdd: (dish: Dish) => void }) => {
  if (menuItems.length === 0) {
    return <p className="text-xs text-center text-gray-400 py-4">Ładowanie menu...</p>;
  }
  return (
    <>
      {menuItems.map((dish) => (
        <div key={dish.token} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-0 bg-white rounded-lg mb-1 shadow-sm transition hover:border-red-200">
          <div>
            <p className="font-bold text-sm text-gray-800">{dish.name}</p>
            <p className="text-xs text-gray-500">{dish.price ? (dish.price / 100).toFixed(2) : "0.00"} PLN</p>
          </div>
          <button type="button" onClick={() => onAdd(dish)} className="bg-red-50 text-red-700 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600 hover:text-white transition-colors">
            +
          </button>
        </div>
      ))}
    </>
  );
};

const CartList = ({ cart, updateQuantity, updateNote, t }: { cart: CartItem[]; updateQuantity: (t: string, d: number) => void; updateNote: (t: string, n: string) => void; t: any }) => {
  if (cart.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 mt-2 p-4 bg-red-50/50 rounded-xl border border-red-100">
      <h4 className="font-bold text-red-800 text-sm">{t("reservation.preorder", "Twój pre-order:")}</h4>
      {cart.map((item) => (
        <div key={item.dishToken} className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm border border-red-50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-gray-800">{item.name}</span>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button type="button" onClick={() => updateQuantity(item.dishToken, -1)} className="w-6 h-6 bg-white shadow-sm rounded flex items-center justify-center font-bold text-gray-600 hover:text-red-600">-</button>
              <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
              <button type="button" onClick={() => updateQuantity(item.dishToken, 1)} className="w-6 h-6 bg-white shadow-sm rounded flex items-center justify-center font-bold text-gray-600 hover:text-green-600">+</button>
            </div>
          </div>
          <input type="text" placeholder={t("reservation.notePlaceholder", "Notatka dla kucharza (np. bez cebuli)")} value={item.note} onChange={(e) => updateNote(item.dishToken, e.target.value)} className="text-xs p-2 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-red-300 focus:bg-white transition-colors w-full" />
        </div>
      ))}
    </div>
  );
};

export default function Reservation() {
  const { isAuthenticated, authFetch } = useAuth();
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState<FormState>({ date: "", startHour: "", endHour: "", tableToken: "" });
  const [status, setStatus] = useState<StatusState>({ isLoading: false, error: null, successMsg: null });
  
  const [tables, setTables] = useState<Table[]>([]);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    document.title = `${t("navbar.reservation")} - Qui la Carne`;
  }, [t]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await authFetch(`/api/dishes?page=1&size=${MENU_PAGE_SIZE}`, {
          method: "GET",
          headers: { Accept: "application/json", "Accept-Language": i18n.language },
        });
        if (response.ok) {
          const result = await response.json();
          setMenuItems(result.data?.items || []);
        }
      } catch (err) {
        console.error("Menu fetch error", err);
      }
    };
    if (isAuthenticated) fetchMenu();
  }, [i18n.language, authFetch, isAuthenticated]);

  useEffect(() => {
    const { date, startHour, endHour } = form;
    if (date && startHour && endHour) {
      const start = new Date(`${date}T${startHour}:00`);
      const end = new Date(`${date}T${endHour}:00`);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end) {
        fetchAvailableTables(start.toISOString(), end.toISOString());
      } else {
        setTables([]);
        setForm((prev) => ({ ...prev, tableToken: "" }));
      }
    }
  }, [form.date, form.startHour, form.endHour, i18n.language]);

  const fetchAvailableTables = async (startIso: string, endIso: string) => {
    setIsFetchingTables(true);
    try {
      const queryParams = new URLSearchParams({ startTime: startIso, endTime: endIso });
      const response = await authFetch(`/api/tables?${queryParams.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json", "Accept-Language": i18n.language },
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setTables(data.data?.tables || data.data?.items || (Array.isArray(data.data) ? data.data : []));
        setForm((prev) => ({ ...prev, tableToken: "" }));
      } else {
        setTables([]);
      }
    } catch (err) {
      setTables([]);
    } finally {
      setIsFetchingTables(false);
    }
  };

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dishToken === dish.token);
      if (existing) return prev.map((item) => (item.dishToken === dish.token ? { ...item, quantity: item.quantity + 1 } : item));
      return [...prev, { dishToken: dish.token, name: dish.name, price: dish.price, quantity: 1, note: "" }];
    });
  };

  const updateQuantity = (token: string, delta: number) => {
    setCart((prev) => prev.map((item) => (item.dishToken === token ? { ...item, quantity: item.quantity + delta } : item)).filter((item) => item.quantity > 0));
  };

  const updateNote = (token: string, note: string) => {
    setCart((prev) => prev.map((item) => (item.dishToken === token ? { ...item, note } : item)));
  };

  const handleReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ error: null, successMsg: null, isLoading: true });

    if (!authFetch) {
      setStatus({ isLoading: false, error: t("reservation.error_unauthorized"), successMsg: null });
      return;
    }

    try {
      const response = await authFetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          tableToken: form.tableToken,
          startTime: new Date(`${form.date}T${form.startHour}:00`).toISOString(),
          endTime: new Date(`${form.date}T${form.endHour}:00`).toISOString(),
          dishes: cart.map(({ dishToken, quantity, note }) => ({ dishToken, quantity, note })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setStatus({ isLoading: false, error: data?.message || data?.error || t("reservation.error_generic"), successMsg: null });
        return;
      }

      setStatus({ isLoading: false, error: null, successMsg: data?.message || t("reservation.success_message") });
      setForm({ date: "", startHour: "", endHour: "", tableToken: "" });
      setTables([]);
      setCart([]);
    } catch (err) {
      setStatus({ isLoading: false, error: t("reservation.connection_error"), successMsg: null });
    }
  };

  return (
    <main className="grow pt-16">
      <header className="relative h-[calc(100vh-4rem)] bg-cover bg-center" style={{ backgroundImage: "url('/tlo.jpg')" }}>
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center py-10 overflow-y-auto">
          <div className="text-center text-white px-4 w-full max-w-4xl mx-auto my-auto">
            <h1 className="text-5xl md:text-7xl italic font-bold font-fancy mb-6 tracking-wide text-red-500 mt-10">
              {t("reservation.title")}
            </h1>
            <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto">
              {t("reservation.description")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
              {!isAuthenticated ? (
                <UnauthenticatedPrompt t={t} />
              ) : (
                <form onSubmit={handleReservation} className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100 text-left">
                  {status.error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-200 text-center">{status.error}</div>}
                  {status.successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-200 text-center">{status.successMsg}</div>}

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("reservation.date", "Data wizyty")}</label>
                    <input type="date" required min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all cursor-pointer" />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("reservation.startTime", "Od godziny")}</label>
                      <select required value={form.startHour} onChange={(e) => setForm({ ...form, startHour: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all cursor-pointer">
                        <option value="" disabled>{t("reservation.choose_time", "Wybierz")}</option>
                        {TIME_SLOTS.map((time) => (
                          <option key={`start-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("reservation.endTime", "Do godziny")}</label>
                      <select required value={form.endHour} onChange={(e) => setForm({ ...form, endHour: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all cursor-pointer">
                        <option value="" disabled>{t("reservation.choose_time", "Wybierz")}</option>
                        {TIME_SLOTS.filter((time) => !form.startHour || time > form.startHour).map((time) => (
                          <option key={`end-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("reservation.tableToken", "Wybór stolika")}</label>
                    {!form.date || !form.startHour || !form.endHour ? (
                      <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 italic text-sm">{t("reservation.select_dates_first", "Wybierz datę i godziny, aby zobaczyć wolne stoliki.")}</div>
                    ) : isFetchingTables ? (
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm animate-pulse">{t("reservation.fetching_tables", "Szukam wolnych stolików...")}</div>
                    ) : tables.length === 0 ? (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{t("reservation.no_tables", "Brak wolnych stolików w wybranym terminie.")}</div>
                    ) : (
                      <select required value={form.tableToken} onChange={(e) => setForm({ ...form, tableToken: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left cursor-pointer">
                        <option value="" disabled>{t("reservation.choose_table", "Wybierz stolik")}</option>
                        {tables.map((table) => (
                          <option key={table.token || table.tableToken || table.id} value={table.token || table.tableToken || table.id}>
                            {table.name || "Stolik"} - {table.status} (Miejsc: {table.capacity || "?"})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-4 border-t border-gray-100 pt-4">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("reservation.dishes", "Dania")} ({t("reservation.optional", "opcjonalnie")})</label>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50">
                      <MenuList menuItems={menuItems} onAdd={addToCart} />
                    </div>
                    <CartList cart={cart} updateQuantity={updateQuantity} updateNote={updateNote} t={t} />
                  </div>

                  <button type="submit" disabled={status.isLoading || !form.tableToken} className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center ${status.isLoading || !form.tableToken ? "bg-red-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1"}`}>
                    {status.isLoading ? <span className="animate-pulse">{t("reservation.loading")}</span> : t("reservation.submitBtn")}
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