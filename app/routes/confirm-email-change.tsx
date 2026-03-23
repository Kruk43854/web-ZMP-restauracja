import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";


export default function ConfirmEmailChange() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const effectRan = useRef(false);


    useEffect(() => {
    document.title = t("footer.links.dashboard") + " - Qui la Carne";
  }, [t]);

  useEffect(() => {
    if (effectRan.current) return;
    const tokenParam = searchParams.get("verificationToken");

    if (!tokenParam) {
      setStatus("error");
      setMessage(t("confirmEmailChange.error_invalid_link"));
      return;
    }

    effectRan.current = true;
    verifyEmailChange(tokenParam);
  }, [searchParams, t]);

  const verifyEmailChange = async (tokenValue: string) => {
    const authToken = localStorage.getItem("token");
    
    try {
      const response = await fetch(`/api/user/me/email/confirm?verificationToken=${encodeURIComponent(tokenValue)}`, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          ...(authToken && { "Authorization": `Bearer ${authToken}` })
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setStatus("error");
        setMessage((data && (data.message || data.error)) ?? t("confirmEmailChange.error_default"));
        return;
      }

      setStatus("success");
      setMessage(data?.message ?? t("confirmEmailChange.success_message"));
    } catch {
      setStatus("error");
      setMessage(t("confirmEmailChange.connection_error"));
    }
  };

  return (
    <main className="grow pt-16">
      <header className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center py-12" style={{ backgroundImage: "url('/tlo.jpg')" }}>
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-full text-black items-center text-center">
            
            {status === "loading" && (
              <>
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <h2 className="text-3xl font-bold text-gray-800">{t("confirmEmailChange.loading_title")}</h2>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold">X</div>
                <h2 className="text-3xl font-bold text-red-600">{t("confirmEmailChange.error_title")}</h2>
                <p className="text-gray-600">{message}</p>
                <Link to="/settings" className="mt-4 px-6 py-3 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200">{t("confirmEmailChange.back_to_settings")}</Link>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold">✓</div>
                <h2 className="text-3xl font-bold text-green-600">{t("confirmEmailChange.success_title")}</h2>
                <p className="text-gray-600">{message}</p>
                <Link to="/settings" className="mt-4 w-full bg-red-700 text-white font-bold py-4 rounded-xl hover:bg-red-800">{t("confirmEmailChange.back_to_settings")}</Link>
              </>
            )}

          </div>
        </div>
      </header>
    </main>
  );
}