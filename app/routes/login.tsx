import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next"; 


export default function Login() {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

      useEffect(() => {
      document.title = t("login.title") + " - Qui la Carne";
    }, [t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
        const response = await fetch('/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", data.data.username);
        navigate("/");
      } else {
        setError(data.message || t('login.errors.invalidCredentials'));
      }
    } catch (err) {
      setError(t('login.errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grow pt-16">
      <header 
        className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center py-12"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">
          <h1 className="text-6xl md:text-8xl italic font-bold font-fancy mb-4 tracking-wide text-red-600 drop-shadow-sm">
            {t('login.title')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-800">
            {t('login.subtitle')}
          </p>

          <form 
            onSubmit={handleLogin} 
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-200">
                {error}
              </div>
            )}
            
            <input
              type="text"
              placeholder={t('login.usernamePlaceholder')}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
                isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">{t('login.loading')}</span>
              ) : (
                t('login.submitBtn')
              )}
            </button>

            <div className="flex items-center gap-4 my-2 opacity-70">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">{t('login.or')}</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex flex-col gap-3 opacity-50 relative group">
              <div className="absolute -inset-2 bg-transparent z-10 cursor-not-allowed" title={t('login.comingSoon')}></div>
              <button type="button" disabled className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
                {t('login.fbBtn')}
              </button>
              <button type="button" disabled className="w-full bg-white text-gray-700 border border-gray-300 font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
                {t('login.googleBtn')}
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-red-700 transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
              
              <div className="text-gray-600 mt-2">
                {t('login.noAccount')}{" "}
                <Link to="/register" className="text-red-700 font-bold hover:underline">
                  {t('login.registerLink')}
                </Link>
              </div>
            </div>

          </form>
        </div>
      </header>
    </main>
  );
}