import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "";
const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY_MS = 5000;

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

interface FormStatus {
  loading: boolean;
  message: string;
  isSuccess: boolean;
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<FormStatus>({
    loading: false,
    message: "",
    isSuccess: false,
  });

  useEffect(() => {
    document.title = `${t("resetPassword.title")} - Qui la Carne`;
  }, [t]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    if (!tokenParam) {
      setStatus(prev => ({ ...prev, message: t("resetPassword.error_missing_token_link") }));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token.trim()) {
      setStatus({ loading: false, message: t("resetPassword.error_missing_token_submit"), isSuccess: false });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ loading: false, message: t("resetPassword.error_password_mismatch"), isSuccess: false });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus({ loading: false, message: t("resetPassword.error_password_short"), isSuccess: false });
      return;
    }

    setStatus({ loading: true, message: t("resetPassword.saving"), isSuccess: false });

    try {
      const response = await fetch(`${API_URL}/api/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data: ApiResponse | null = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        const serverMsg = data?.message || data?.error || t("resetPassword.error_setting_failed");
        setStatus({ loading: false, message: serverMsg, isSuccess: false });
        return;
      }

      setStatus({
        loading: false,
        message: data?.message || t("resetPassword.success_message"),
        isSuccess: true,
      });
      
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate('/login'), REDIRECT_DELAY_MS);

    } catch (error) {
      console.error(error);
      setStatus({ loading: false, message: t("resetPassword.connection_error"), isSuccess: false });
    }
  };

  const statusBoxClasses = `p-3 rounded-xl text-sm font-medium border text-center ${
    status.isSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
  }`;

  const submitButtonClasses = `w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
    status.loading || !token ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'
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
            {t("resetPassword.title")}
          </h1>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {!status.isSuccess && (
              <p className="text-sm text-gray-600 mb-2">
                {t("resetPassword.description")}
              </p>
            )}

            {status.message && (
              <div className={statusBoxClasses}>
                {status.message}
              </div>
            )}

            <div className="flex flex-col text-left">
               <label className="text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">
                 {t("resetPassword.account_label")}
               </label>
               <input
                  type="email"
                  value={email}
                  readOnly
                  className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed outline-none"
               />
            </div>

            {!status.isSuccess && (
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
                  disabled={status.loading || !token}
                  className={submitButtonClasses}
                >
                  {status.loading ? (
                    <span className="animate-pulse">{t("resetPassword.saving")}</span>
                  ) : (
                    t("resetPassword.submit")
                  )}
                </button>
              </>
            )}

            <div className="text-center text-sm mt-2">
              {status.isSuccess ? (
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