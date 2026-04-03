import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";


export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const { token, updateUsername, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [isEmailSuccess, setIsEmailSuccess] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");
  const [isSecuritySuccess, setIsSecuritySuccess] = useState(false);
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);

    useEffect(() => {
    document.title = t("settings.title") + " - Qui la Carne";
  }, [t]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleUpdateUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMsg(""); setIsProfileSuccess(false);

    if (!username.trim() || !token) return;
    setIsProfileLoading(true);

    try {
      const response = await fetch(`/api/user/me/username?userName=${encodeURIComponent(username)}`, {
        method: "PATCH",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setProfileMsg((data && (data.message || data.error)) ?? t("settings.error_generic"));
        return;
      }

      setIsProfileSuccess(true);
      setProfileMsg(data?.message ?? t("settings.profile.success_username"));
      updateUsername(username);
    } catch {
      setProfileMsg(t("settings.connection_error"));
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailMsg(""); setIsEmailSuccess(false);

    if (!email.trim() || !token) return;
    setIsEmailLoading(true);

    try {
      const response = await fetch(`/api/user/me/email/update?email=${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setEmailMsg((data && (data.message || data.error)) ?? t("settings.error_generic"));
        return;
      }

      setIsEmailSuccess(true);
      setEmailMsg(data?.message ?? t("settings.profile.success_email_link"));
      setEmail("");
    } catch {
      setEmailMsg(t("settings.connection_error"));
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSecurityMsg(""); setIsSecuritySuccess(false);

    if (newPassword !== confirmPassword) {
      setSecurityMsg(t("settings.security.error_mismatch"));
      return;
    }
    if (!token) return;
    setIsSecurityLoading(true);

    try {
      const response = await fetch(`/api/user/me/password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          oldPassword,
          password: newPassword,
          confirmPassword
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setSecurityMsg((data && (data.message || data.error)) ?? t("settings.error_generic"));
        return;
      }

      setIsSecuritySuccess(true);
      setSecurityMsg(data?.message ?? t("settings.security.success_password"));
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      setSecurityMsg(t("settings.connection_error"));
    } finally {
      setIsSecurityLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("settings.security.delete_confirm_prompt"))) return;
    if (!token) return;

    try {
      const response = await fetch(`/api/user/me/delete`, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
        window.location.reload();
      } else {
        alert(t("settings.error_generic"));
      }
    } catch {
      alert(t("settings.connection_error"));
    }
  };

  if (!token) {
    return <div className="text-center mt-32 text-2xl font-bold">{t("settings.unauthorized")}</div>;
  }

  return (
    <main className="grow pt-16">
      <header className="relative min-h-[calc(100vh-4rem)] bg-cover bg-fixed bg-center py-12" style={{ backgroundImage: "url('/tlo.jpg')" }}>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-1/4 flex flex-col gap-4">
            <h1 className="text-4xl italic font-bold font-fancy text-red-700 drop-shadow-sm mb-4">{t("settings.title")}</h1>
            <nav className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
              <button onClick={() => setActiveTab("profile")} className={`text-left px-6 py-4 font-semibold transition-colors border-l-4 ${activeTab === "profile" ? "bg-red-50 text-red-700 border-red-700" : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-red-700"}`}>
                {t("settings.tabs.profile")}
              </button>
              <button onClick={() => setActiveTab("security")} className={`text-left px-6 py-4 font-semibold transition-colors border-l-4 ${activeTab === "security" ? "bg-red-50 text-red-700 border-red-700" : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-red-700"}`}>
                {t("settings.tabs.security")}
              </button>
            </nav>
            <Link to="/" className="text-center text-gray-500 hover:text-red-700 font-medium mt-4 transition-colors">&larr; {t("settings.back_to_home")}</Link>
          </aside>

          <section className="w-full md:w-3/4 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
            
            {activeTab === "profile" && (
              <div className="animate-fade-in flex flex-col gap-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{t("settings.profile.heading")}</h2>

                <form onSubmit={handleUpdateUsername} className="flex flex-col gap-3 max-w-lg">
                  {profileMsg && <div className={`p-3 rounded-xl text-sm font-medium border text-center ${isProfileSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{profileMsg}</div>}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.profile.username")}</label>
                    <div className="flex gap-2">
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none grow" />
                      <button type="submit" disabled={isProfileLoading} className="bg-red-700 text-white font-bold px-6 rounded-xl hover:bg-red-800 disabled:opacity-50">{t("settings.save")}</button>
                    </div>
                  </div>
                </form>

                <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3 max-w-lg border-t pt-6">
                  {emailMsg && <div className={`p-3 rounded-xl text-sm font-medium border text-center ${isEmailSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{emailMsg}</div>}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.profile.new_email")}</label>
                    <div className="flex gap-2">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nowy@adres.pl" required className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none grow" />
                      <button type="submit" disabled={isEmailLoading} className="bg-red-700 text-white font-bold px-6 rounded-xl hover:bg-red-800 disabled:opacity-50">{t("settings.profile.send_email_link")}</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-fade-in flex flex-col gap-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{t("settings.security.heading")}</h2>

                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 max-w-lg">
                  {securityMsg && <div className={`p-3 rounded-xl text-sm font-medium border text-center ${isSecuritySuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{securityMsg}</div>}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.current_password")}</label>
                    <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.new_password")}</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.confirm_password")}</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
                  </div>
                  <button type="submit" disabled={isSecurityLoading} className="bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-900 mt-2 disabled:opacity-50">
                    {t("settings.security.change_password_btn")}
                  </button>
                </form>

                <div className="p-6 border border-red-200 bg-red-50 rounded-2xl max-w-lg mt-6">
                  <h3 className="text-lg font-bold text-red-800 mb-2">{t("settings.security.danger_zone")}</h3>
                  <p className="text-sm text-red-600 mb-4">{t("settings.security.danger_desc")}</p>
                  <button onClick={handleDeleteAccount} className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 border border-red-300">
                    {t("settings.security.delete_account")}
                  </button>
                </div>
              </div>
            )}

          </section>
        </div>
      </header>
    </main>
  );
}