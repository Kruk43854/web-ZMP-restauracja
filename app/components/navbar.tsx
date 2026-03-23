import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next'; 
import i18n from '../i18n';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('pl') ? 'en' : 'pl';
    i18n.changeLanguage(nextLang);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeMenus = () => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    setUsername(null);
    closeMenus();
    
    navigate('/');
    
    window.location.reload();
  };

  return (
    <nav className="bg-green-500 fixed w-full z-20 top-0 border-b border-green-800 shadow-md">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <p className="text-2xl font-bold">🍕</p> 
          <span className="self-center text-4xl font-semibold font-fancy whitespace-nowrap text-white">
            <i>Qui la Carne</i>
          </span>
        </Link>

        <div className="flex items-center space-x-3 md:order-2">
          
          <button
            onClick={toggleLanguage}
            type="button"
            className="flex items-center justify-center w-10 h-10 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors focus:ring-4 ring-2 ring-green-700 shadow-sm text-lg"
            title={i18n.language?.startsWith('pl') ? 'Switch to English' : 'Zmień na polski'}
          >
            {i18n.language?.startsWith('pl') ? '🇵🇱' : '🇬🇧'}
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={toggleUserDropdown}
              type="button"
              className={`flex text-sm rounded-full w-10 h-10 items-center justify-center text-white ring-2 transition-all focus:ring-4 ${
                username ? 'bg-green-800 ring-green-900 focus:ring-green-300 hover:ring-white' : 'bg-red-600 ring-red-800 focus:ring-red-100 hover:ring-white'
              }`}
              aria-expanded={isUserDropdownOpen}
            >
              <span className="sr-only">{t('navbar.userMenu')}</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.754 1.143 5.24 2.982 7.025.412.3-.005.352.118.002A5.25 5.25 0 0110.5 15.75h3a5.25 5.25 0 015.201 4.145c.123.35.123.35.003zM7.5 8.25a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
              </svg>
            </button>

            <div className={`${isUserDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-3 z-50 w-48 text-base list-none bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-100 transform origin-top-right transition-all`}>
              <ul className="py-2 px-1.5">

                {username ? (
                  <>
                    <li className="block px-4 py-3 text-sm text-gray-900 font-bold border-b border-gray-100 mb-1 truncate">
                      {t('navbar.hello')}, <span className="text-green-600">{username}</span>!
                    </li>
                    <li><Link to="/settings" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-100">{t('navbar.settings')}</Link></li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors mt-1">
                        {t('navbar.logout')}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700">{t('navbar.login')}</Link></li>
                    <li><Link to="/register" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700">{t('navbar.register')}</Link></li>
                    <li><Link to="/settings" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-100">{t('navbar.settings')}</Link></li>
                  </>
                )}

              </ul>
            </div>
          </div>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-green-100 rounded-xl md:hidden hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{t('navbar.openMenu')}</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
          
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-default">
          <ul className="font-medium flex flex-col p-2 mt-2 rounded-2xl bg-green-700 md:p-0.5 md:w-auto md:flex-row md:gap-1 md:mt-0 md:border-0 items-center">
            <li><Link to="/menu" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">{t('navbar.menu')}</Link></li>
            <li><Link to="/reservation" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">{t('navbar.reservation')}</Link></li>
            <li><Link to="/about" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">{t('navbar.about')}</Link></li>

            {username ? (
              <li className='md:hidden border-t border-green-500 pt-2 w-full mt-1'>
                <button onClick={handleLogout} className="w-full block py-2 px-4 text-center text-red-200 font-bold rounded-2xl hover:bg-green-800 transition-colors">
                  {t('navbar.logout')} ({username})
                </button>
              </li>
            ) : (
              <>
                <li className='md:hidden border-t border-green-500 pt-2 w-full mt-1'><Link to="/login" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">{t('navbar.login')}</Link></li>
                <li className='md:hidden border-green-500 w-full'><Link to="/register" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">{t('navbar.register')}</Link></li>
              </>
            )}

          </ul>
        </div>
        
      </div>
    </nav>
  );
}