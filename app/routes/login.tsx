import { Link } from "react-router";

export function meta() {
  return [{ title: "Logowanie - Qui la Carne" }];
}

export default function Login() {
  return (
    <main className="grow pt-16">
      <header 
        className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center py-12"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">
          <h1 className="text-6xl md:text-8xl italic font-bold font-fancy mb-4 tracking-wide text-red-600 drop-shadow-sm">
            Logowanie
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-800">
            Najlepsza włoska restauracja w Polsce!
          </p>

          <form className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100">
            
            <input
              type="email"
              placeholder="Adres e-mail"
              required
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
              type="password"
              placeholder="Hasło"
              required
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <button 
              type="button" 
              className="w-full bg-red-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-2"
            >
              Zaloguj się
            </button>

            <div className="flex items-center gap-4 my-2 opacity-70">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">LUB</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-xl hover:bg-[#166fe5] transition-colors flex justify-center items-center gap-2">
                Zaloguj przez Facebook
              </button>
              <button type="button" className="w-full bg-white text-gray-700 border border-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                Zaloguj przez Google
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-red-700 transition-colors"
              >
                Zapomniałeś hasła?
              </Link>
              
              <div className="text-gray-600 mt-2">
                Nie masz konta?{" "}
                <Link to="/register" className="text-red-700 font-bold hover:underline">
                  Zarejestruj się
                </Link>
              </div>
            </div>

          </form>
        </div>
      </header>
    </main>
  );
}