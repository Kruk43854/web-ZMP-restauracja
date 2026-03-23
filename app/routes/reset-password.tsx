import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";



export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


    useEffect(() => {
    document.title = t("resetPassword.title") + " - Qui la Carne";
  }, [t]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    if (!tokenParam) {
       setMessage(t("resetPassword.error_missing_token_link"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token.trim()) {
      setMessage(t("resetPassword.error_missing_token_submit"));
      return;
    }
    if (password !== confirmPassword) {
      setMessage(t("resetPassword.error_password_mismatch"));
      return;
    }
    if (password.length < 6) {
      setMessage(t("resetPassword.error_password_short"));
      return;
    }

    setLoading(true);
    setMessage(t("resetPassword.saving"));
    setIsSuccess(false);

    try {
      const response = await fetch(`/api/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        const serverMsg = (data && (data.message || data.error)) ?? t("resetPassword.error_setting_failed");
        setMessage(serverMsg);
        return;
      }

      setIsSuccess(true);
      setMessage(data?.message ?? t("resetPassword.success_message"));
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate('/login'), 5000);

    } catch (error) {
      console.error(error);
      setMessage(t("resetPassword.connection_error"));
    } finally {
      setLoading(false);
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
          <h1 className="text-5xl md:text-7xl italic font-bold font-fancy mb-4 tracking-wide text-red-600 drop-shadow-sm">
            {t("resetPassword.title")}
          </h1>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {!isSuccess && (
              <p className="text-sm text-gray-600 mb-2">
                {t("resetPassword.description")}
              </p>
            )}

            {message && (
              <div className={`p-3 rounded-xl text-sm font-medium border text-center ${
                isSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex flex-col text-left">
               <label className="text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">{t("resetPassword.account_label")}</label>
               <input
                  type="email"
                  value={email}
                  readOnly
                  className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed outline-none"
               />
            </div>

            {!isSuccess && (
              <>
                <input
                  type="password"
                  placeholder={t("resetPassword.new_password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
                />

                <input
                  type="password"
                  placeholder={t("resetPassword.confirm_password_placeholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
                />

                <button 
                  type="submit" 
                  disabled={loading || !token}
                  className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
                    loading || !token ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">{t("resetPassword.saving")}</span>
                  ) : (
                    t("resetPassword.submit")
                  )}
                </button>
              </>
            )}

            <div className="text-center text-sm mt-2">
              {isSuccess ? (
                  <Link to="/login" className="w-full block bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 mt-2">
                    {t("resetPassword.success_button")}
                  </Link>
              ) : (
                  <div className="text-gray-600">
                  {t("resetPassword.remember_password")}{" "}
                  <Link to="/login" className="text-red-700 font-bold hover:underline">
                    {t("resetPassword.back_to_login")}
                  </Link>
                  </div>
              )}
            </div>
          </form>
        </div>
      </header>
    </main>
  );
}