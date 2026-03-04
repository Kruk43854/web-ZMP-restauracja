import { useState } from 'react';
import { Link } from 'react-router'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeMenus = () => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-green-500 fixed w-full z-20 top-0 border-b border-green-800 shadow-md">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* tu bedzie logo */}
          <p className="text-2xl font-bold">🍕</p> 
          <span className="self-center text-4xl font-semibold font-fancy whitespace-nowrap text-white">
            <i>Qui la Carne</i>
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-green-100 rounded-xl-lg md:hidden hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Otwórz menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
         <ul className="font-medium flex flex-col p-2 mt-2 rounded-2xl bg-green-700 md:p-0.5 md:w-auto md:flex-row md:gap-1 md:mt-0 md:border-0 items-center">
            <li><Link to="/menu" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">Menu</Link></li>
            <li><Link to="/reservation" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">Rezerwacja</Link></li>
            <li><Link to="/about" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">O nas</Link></li>
            <li className='md:hidden border-green-500 pt-2'><Link to="/login" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">Logowanie</Link></li>
            <li className='md:hidden border-green-500 pt-2'><Link to="/register" className="block py-2 px-4 text-center text-white rounded-2xl hover:bg-green-800 transition-colors">Rejestracja</Link></li>
          </ul>
        </div>
        <div className="relative hidden md:block">
          <button
            onClick={toggleUserDropdown}
            type="button"
            className="flex text-sm bg-red-600 rounded-full w-10 h-10 items-center justify-center text-white ring-2 ring-red-00 hover:ring-white transition-all focus:ring-4 focus:ring-red-100"
            aria-expanded={isUserDropdownOpen}
          >
            <span className="sr-only">Menu użytkownika</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.754 1.143 5.24 2.982 7.025.412.3-.005.352.118.002A5.25 5.25 0 0110.5 15.75h3a5.25 5.25 0 015.201 4.145c.123.35.123.35.003zM7.5 8.25a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
            </svg>
          </button>

          <div 
            className={`${isUserDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-3 z-50 w-40 text-base list-none bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-100 transform origin-top-right transition-all`}
          >
            <ul className="py-2 px-1.5">
              <li>
                <Link to="/login" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700">
                  Logowanie
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700">
                  Rejestracja
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={closeMenus} className="block px-4 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-100">
                  Ustawienia
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}