import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next"; 

export function meta() {
  return [{ title: "Rejestracja - Qui la Carne" }]; 
}

export default function Register() {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

 const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      setError(t("register.error_username_required"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.error_password_mismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("register.error_password_short"));
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
        const response = await fetch('/api/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        const serverMsg =
          (data && (data.message || data.error)) ??
          (data &&
            Array.isArray(data.errors) &&
            data.errors.join(", ")) ??
          t("register.error_creation_failed");
        
        setSuccess(serverMsg);
        return;
      }
      
      setSuccess(true);   
      setError(
        data?.message ?? t("register.success_message")
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

         setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      console.error(error);
      setError(t("register.connection_error"));
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
            {t('register.title')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-800">
            {t('register.subtitle')}
          </p>

          <form 
            onSubmit={handleRegister} 
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {error && (
              <div className={`p-3 rounded-xl text-sm font-medium border text-center ${
                isSuccess 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {error}
              </div>
            )}
            
            <input
              type="text"
              placeholder={t('register.usernamePlaceholder')}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
                type="email"
                placeholder={t('register.emailPlaceholder')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
              />

            <input
              type="password"
              placeholder={t('register.passwordPlaceholder')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
            type="password"
            placeholder={t("register.confirm_password_placeholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
                <span className="animate-pulse">{t('register.loading')}</span>
              ) : (
                t('register.submitBtn')
              )}
            </button>

            <div className="flex items-center gap-4 my-2 opacity-70">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">{t('register.or')}</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex flex-col gap-3 opacity-50 relative group">
              <div className="absolute -inset-2 bg-transparent z-10 cursor-not-allowed" title={t('register.comingSoon')}></div>
              <button type="button" disabled className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
                {t('register.fbBtn')}
              </button>
              <button type="button" disabled className="w-full bg-white text-gray-700 border border-gray-300 font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
                {t('register.googleBtn')}
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-center text-sm">              
              <div className="text-gray-600 mt-2">
                {t('register.hasAccount')}{" "}
                <Link to="/login" className="text-red-700 font-bold hover:underline">
                  {t('register.loginLink')}
                </Link>
              </div>
            </div>

          </form>
        </div>
      </header>
    </main>
  );
}