import type { Route } from "./+types/reservation";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Rezerwacja - Qui la Carne" }];
}

export default function Reservation() {
  return (
    <main className="grow pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-fancy text-red-700 mb-4">Zarezerwuj stolik</h1>
          <p className="text-lg text-gray-600">
            Czekamy na Ciebie. Wybierz dogodny termin, a my przygotujemy dla Ciebie wyjątkowy wieczór.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
          <div className="md:w-2/5 bg-red-800 p-8 text-white flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-[url('/tlo.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-fancy mb-4">Godziny otwarcia</h3>
              <ul className="space-y-2 mb-8 text-red-100">
                <li className="flex justify-between border-b border-red-700/50 pb-2">
                  <span>Pon - Czw:</span> <span>12:00 - 22:00</span>
                </li>
                <li className="flex justify-between border-b border-red-700/50 pb-2">
                  <span>Piątek - Sobota:</span> <span>12:00 - 23:30</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Niedziela:</span> <span>13:00 - 21:00</span>
                </li>
              </ul>
              <p className="text-sm text-red-200 italic">
                W przypadku rezerwacji powyżej 8 osób, prosimy o kontakt telefoniczny.
              </p>
            </div>
          </div>

          <div className="md:w-3/5 p-8 md:p-12">
            <form className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input 
                    type="date" 
                    id="date" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Godzina</label>
                  <input 
                    type="time" 
                    id="time" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">Liczba osób</label>
                  <select 
                    id="guests" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  >
                    <option>1 osoba</option>
                    <option>2 osoby</option>
                    <option>3 osoby</option>
                    <option>4 osoby</option>
                    <option>5 osób</option>
                    <option>6 osób</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Imię i nazwisko</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="np. Jan Kowalski"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Numer telefonu</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="+48 000 000 000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-red-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-colors mt-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Potwierdź rezerwację
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}