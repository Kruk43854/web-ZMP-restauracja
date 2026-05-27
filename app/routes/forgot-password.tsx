import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "";

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: string[];
}

interface FormStatus {
  loading: boolean;
  message: string;
  isSuccess: boolean;
}

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<FormStatus>({
    loading: false,
    message: "",
    isSuccess: false,
  });

  useEffect(() => {
    document.title = `${t("forgotPassword.title")} - Qui la Carne`;
  }, [t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus({ loading: false, message: t("forgotPassword.error_email_required"), isSuccess: false });
      return;
    }

    setStatus({ loading: true, message: t("forgotPassword.sending"), isSuccess: false });

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const data: ApiResponse = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        const serverMsg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
          t("forgotPassword.error_sending_failed");

        setStatus({ loading: false, message: serverMsg, isSuccess: false });
        return;
      }

      setStatus({
        loading: false,
        message: data?.message || t("forgotPassword.success_message"),
        isSuccess: true,
      });
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, message: t("forgotPassword.connection_error"), isSuccess: false });
    }
  };

  const statusBoxClasses = `p-3 rounded-xl text-sm font-medium border text-center ${
    status.isSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
  }`;

  const submitButtonClasses = `w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
    status.loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
  }`;

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
            {status.message && (
              <div className={statusBoxClasses}>
                {status.message}
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
              disabled={status.loading}
              className={submitButtonClasses}
            >
              {status.loading ? (
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