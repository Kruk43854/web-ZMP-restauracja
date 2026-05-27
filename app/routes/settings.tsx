import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";

type Tab = "profile" | "security";

interface FormStatus {
  loading: boolean;
  msg: string;
  success: boolean;
}

const initialStatus: FormStatus = { loading: false, msg: "", success: false };


const ProfileTab = ({ authFetch, logout }: { authFetch: any; logout: () => void }) => {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState("");
  
  const [profileStatus, setProfileStatus] = useState<FormStatus>(initialStatus);
  const [emailStatus, setEmailStatus] = useState<FormStatus>(initialStatus);

  const delayedLogout = () => setTimeout(() => logout(), 1500);

  const handleUpdateUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;

    setProfileStatus({ loading: true, msg: "", success: false });

    try {
      const response = await authFetch(`/api/user/me/username?userName=${encodeURIComponent(username)}`, { method: "PATCH" });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setProfileStatus({ loading: false, msg: data?.message || data?.error || t("settings.error_generic"), success: false });
        return;
      }

      setProfileStatus({ loading: false, msg: data?.message || t("settings.profile.success_username"), success: true });
      delayedLogout();
    } catch {
      setProfileStatus({ loading: false, msg: t("settings.connection_error"), success: false });
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setEmailStatus({ loading: true, msg: "", success: false });

    try {
      const response = await authFetch(`/api/user/me/email/update?email=${encodeURIComponent(email)}`, { method: "PATCH" });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setEmailStatus({ loading: false, msg: data?.message || data?.error || t("settings.error_generic"), success: false });
        return;
      }

      setEmailStatus({ loading: false, msg: data?.message || t("settings.profile.success_email_link"), success: true });
      setEmail("");
      delayedLogout();
    } catch {
      setEmailStatus({ loading: false, msg: t("settings.connection_error"), success: false });
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{t("settings.profile.heading")}</h2>

      <form onSubmit={handleUpdateUsername} className="flex flex-col gap-3 max-w-lg">
        {profileStatus.msg && (
          <div className={`p-3 rounded-xl text-sm font-medium border text-center ${profileStatus.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {profileStatus.msg}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.profile.username")}</label>
          <div className="flex gap-2">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none grow" />
            <button type="submit" disabled={profileStatus.loading} className="bg-red-700 text-white font-bold px-6 rounded-xl hover:bg-red-800 disabled:opacity-50">{t("settings.save")}</button>
          </div>
        </div>
      </form>

      <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3 max-w-lg border-t pt-6">
        {emailStatus.msg && (
          <div className={`p-3 rounded-xl text-sm font-medium border text-center ${emailStatus.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {emailStatus.msg}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.profile.new_email")}</label>
          <div className="flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nowy@adres.pl" required className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none grow" />
            <button type="submit" disabled={emailStatus.loading} className="bg-red-700 text-white font-bold px-6 rounded-xl hover:bg-red-800 disabled:opacity-50">{t("settings.profile.send_email_link")}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SecurityTab = ({ authFetch, logout }: { authFetch: any; logout: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  const delayedLogout = () => setTimeout(() => logout(), 1500);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ loading: false, msg: t("settings.security.error_mismatch"), success: false });
      return;
    }

    setStatus({ loading: true, msg: "", success: false });

    try {
      const response = await authFetch(`/api/user/me/password`, {
        method: "PATCH",
        body: JSON.stringify({ oldPassword: passwords.old, password: passwords.new, confirmPassword: passwords.confirm })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        setStatus({ loading: false, msg: data?.message || data?.error || t("settings.error_generic"), success: false });
        return;
      }

      setStatus({ loading: false, msg: data?.message || t("settings.security.success_password"), success: true });
      setPasswords({ old: "", new: "", confirm: "" });
    } catch {
      setStatus({ loading: false, msg: t("settings.connection_error"), success: false });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("settings.security.delete_confirm_prompt"))) return;

    try {
      const response = await authFetch(`/api/user/me/delete`, { 
        method: "DELETE" 
      });
      if (response.ok) {
        await logout();
        navigate("/");
        window.location.reload();
      } else {
        alert(t("settings.error_generic"));
      }
    } catch {
      alert(t("settings.connection_error"));
    }
    delayedLogout();
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{t("settings.security.heading")}</h2>

      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 max-w-lg">
        {status.msg && (
          <div className={`p-3 rounded-xl text-sm font-medium border text-center ${status.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {status.msg}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.current_password")}</label>
          <input type="password" required value={passwords.old} onChange={(e) => setPasswords({ ...passwords, old: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.new_password")}</label>
          <input type="password" required value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">{t("settings.security.confirm_password")}</label>
          <input type="password" required value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 outline-none" />
        </div>
        <button type="submit" disabled={status.loading} className="bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-900 mt-2 disabled:opacity-50">
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
  );
};


export default function Settings() {
  const { t } = useTranslation();
  const { isAuthenticated, authFetch, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    document.title = `${t("settings.title")} - Qui la Carne`;
  }, [t]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
         <h2 className="text-3xl font-bold text-gray-800 mb-4">Sesja wygasła</h2>
         <p className="text-gray-600 mb-6">Zaloguj się ponownie, aby uzyskać dostęp do ustawień.</p>
         <Link to="/login" className="bg-red-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-800 transition-colors shadow-lg">
            Przejdź do logowania
         </Link>
      </div>
    );
  }

  return (
    <main className="grow pt-16">
      <header className="relative min-h-[calc(100vh-4rem)] bg-cover bg-fixed bg-center py-12" style={{ backgroundImage: "url('/tlo.jpg')" }}>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-1/4 flex flex-col gap-4">
            <h1 className="text-4xl italic font-bold font-fancy text-red-700 drop-shadow-sm mb-4">{t("settings.title")}</h1>
            <nav className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
              <button 
                onClick={() => setActiveTab("profile")} 
                className={`text-left px-6 py-4 font-semibold transition-colors border-l-4 ${activeTab === "profile" ? "bg-red-50 text-red-700 border-red-700" : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-red-700"}`}
              >
                {t("settings.tabs.profile")}
              </button>
              <button 
                onClick={() => setActiveTab("security")} 
                className={`text-left px-6 py-4 font-semibold transition-colors border-l-4 ${activeTab === "security" ? "bg-red-50 text-red-700 border-red-700" : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-red-700"}`}
              >
                {t("settings.tabs.security")}
              </button>
            </nav>
            <Link to="/" className="text-center text-gray-500 hover:text-red-700 font-medium mt-4 transition-colors">
              &larr; {t("settings.back_to_home")}
            </Link>
          </aside>

          <section className="w-full md:w-3/4 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
            {activeTab === "profile" && <ProfileTab authFetch={authFetch} logout={logout} />}
            {activeTab === "security" && <SecurityTab authFetch={authFetch} logout={logout} />}
          </section>

        </div>
      </header>
    </main>
  );
}