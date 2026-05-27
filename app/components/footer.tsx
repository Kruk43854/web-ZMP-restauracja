import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-green-500 text-white py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl italic font-bold font-fancy text-white drop-shadow-sm mb-2">
            Qui la Carne
          </h2>
          <p className="text-sm text-white">
            {t("footer.subtitle") ?? "Najlepsza włoska restauracja w mieście."}
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-red-500 transition-colors">
            {t("footer.links.home") ?? "Strona główna"}
          </Link>
          <Link to="/menu" className="hover:text-red-500 transition-colors">
            {t("footer.links.menu") ?? "Menu"}
          </Link>
          <Link to="/settings" className="hover:text-red-500 transition-colors">
            {t("footer.links.dashboard") ?? "Ustawienia"}
          </Link>
        </nav>

        <div className="text-sm text-white text-center md:text-right">
          &copy; 2026 Qui la Carne. <br className="md:hidden" />
          {t("footer.rights") ?? "Wszelkie prawa zastrzeżone."}
        </div>
      </div>
    </footer>
  );
}