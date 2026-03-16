import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function meta() {
  return [{ title: "Zapomniałem hasła - Qui la Carne" }];
}

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage(t("forgotPassword.error_email_required"));
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage(t("forgotPassword.sending"));
    setIsSuccess(false);

    try {
      const response = await fetch(
        `/api/auth/reset-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        const serverMsg =
          (data && (data.message || data.error)) ??
          (data && Array.isArray(data.errors) && data.errors.join(", ")) ??
          t("forgotPassword.error_sending_failed");
        setMessage(serverMsg);
        setIsSuccess(false);
        return;
      }

      setIsSuccess(true);
      setMessage(data?.message ?? t("forgotPassword.success_message"));
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage(t("forgotPassword.connection_error"));
      setIsSuccess(false);
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
            {t("forgotPassword.title")}
          </h1>
          
          <p className="text-lg md:text-xl mb-8 font-light text-gray-800">
            {t("forgotPassword.description")}
          </p>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {message && (
              <div className={`p-3 rounded-xl text-sm font-medium border text-center ${
                isSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {message}
              </div>
            )}

            <input
              type="email"
              placeholder={t("forgotPassword.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
                loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <span className="animate-pulse">{t("forgotPassword.sending")}</span>
              ) : (
                t("forgotPassword.submit")
              )}
            </button>

            <div className="mt-4 flex flex-col gap-3 text-center text-sm">
              <div className="text-gray-600 mt-2">
                {t("forgotPassword.remember_password")}{" "}
                <Link to="/login" className="text-red-700 font-bold hover:underline">
                  {t("forgotPassword.back_to_login")}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </header>
    </main>
  );
}