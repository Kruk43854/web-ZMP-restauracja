import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "";
const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY_MS = 2000;

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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<FormStatus>({
    loading: false,
    message: "",
    isSuccess: false,
  });

  useEffect(() => {
    document.title = `${t("register.title")} - Qui la Carne`;
  }, [t]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      setStatus({ loading: false, message: t("register.error_username_required"), isSuccess: false });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ loading: false, message: t("register.error_password_mismatch"), isSuccess: false });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus({ loading: false, message: t("register.error_password_short"), isSuccess: false });
      return;
    }

    setStatus({ loading: true, message: "", isSuccess: false });

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data: ApiResponse = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        const serverMsg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
          t("register.error_creation_failed");

        setStatus({ loading: false, message: serverMsg, isSuccess: false });
        return;
      }

      setStatus({
        loading: false,
        message: data?.message || t("register.success_message"),
        isSuccess: true,
      });

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), REDIRECT_DELAY_MS);
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, message: t("register.connection_error"), isSuccess: false });
    }
  };

  const statusBoxClasses = `p-3 rounded-xl text-sm font-medium border text-center ${
    status.isSuccess ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
  }`;

  const submitButtonClasses = `w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-2 flex justify-center items-center ${
    status.loading ? "bg-red-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1"
  }`;

  return (
    <main className="grow pt-16">
      <header
        className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center py-12"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">
          <h1 className="text-6xl md:text-8xl italic font-bold font-fancy mb-4 tracking-wide text-red-600 drop-shadow-sm">
            {t("register.title")}
          </h1>

          <p className="text-xl md:text-2xl mb-8 font-light text-gray-800">
            {t("register.subtitle")}
          </p>

          <form
            onSubmit={handleRegister}
            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5 w-full text-black border border-gray-100"
          >
            {status.message && <div className={statusBoxClasses}>{status.message}</div>}

            <input
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
              type="email"
              placeholder={t("register.emailPlaceholder")}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-left"
            />

            <input
              type="password"
              placeholder={t("register.passwordPlaceholder")}
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

            <button type="submit" disabled={status.loading} className={submitButtonClasses}>
              {status.loading ? <span className="animate-pulse">{t("register.loading")}</span> : t("register.submitBtn")}
            </button>

            <div className="mt-4 flex flex-col gap-3 text-center text-sm">
              <div className="text-gray-600 mt-2">
                {t("register.hasAccount")}{" "}
                <Link to="/login" className="text-red-700 font-bold hover:underline">
                  {t("register.loginLink")}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </header>
    </main>
  );
}