import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

export function meta() {
  return [{ title: "Potwierdź e-mail - Qui la Carne" }];
}

export default function ConfirmEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (status === "loading") {
      setMessage(t("confirmEmail.verifying_initial"));
    }
  }, [t, status]);

  useEffect(() => {
    if (effectRan.current === true) return;

    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (!emailParam || !tokenParam) {
      setStatus("error");
      setMessage(t("confirmEmail.error_invalid_link"));
      return;
    }

    effectRan.current = true;
    verifyEmail(emailParam, tokenParam);
  }, [searchParams, t]);

const verifyEmail = async (emailValue: string, tokenValue: string) => {
    try {
      const response = await fetch(`/api/auth/register-confirm?token=${encodeURIComponent(tokenValue)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false || data?.isSuccess === false) {
        const serverMsg = (data && (data.message || data.error)) ?? t("confirmEmail.error_default");

        if (serverMsg.toLowerCase().includes("already confirmed") || serverMsg.toLowerCase().includes("already used")) {
            setStatus("success");
            setMessage(t("confirmEmail.error_already_confirmed"));
            return;
        }

        setStatus("error");
        setMessage(serverMsg === "Nie udało się potwierdzić adresu e-mail." ? t("confirmEmail.error_default") : serverMsg);
        return;
      }

      setStatus("success");
      setMessage(data?.message ?? t("confirmEmail.success_message"));

    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(t("confirmEmail.connection_error"));
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
          
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-full text-black border border-gray-100 items-center text-center">
            
            {status === "loading" && (
              <>
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-2"></div>
                <h2 className="text-3xl font-bold font-fancy text-gray-800">{t("confirmEmail.loading_title")}</h2>
                <p className="text-gray-600">{t("confirmEmail.loading_desc")}</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h2 className="text-3xl font-bold font-fancy text-red-600">{t("confirmEmail.error_title")}</h2>
                <p className="text-gray-600">{message}</p>
                <Link to="/login" className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  {t("confirmEmail.back_to_login")}
                </Link>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-bold font-fancy text-green-600">{t("confirmEmail.success_title")}</h2>
                <p className="text-gray-600">{message}</p>
                <Link to="/login" className="mt-4 w-full bg-red-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-colors shadow-lg">
                  {t("confirmEmail.go_to_login")}
                </Link>
              </>
            )}

          </div>
        </div>
      </header>
    </main>
  );
}