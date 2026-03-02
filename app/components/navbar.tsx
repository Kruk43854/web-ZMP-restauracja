import { useState } from 'react';
import { Link } from 'react-router'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-green-700 fixed w-full z-20 top-0 border-b border-green-800 shadow-md">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* tu bedzie logo */}
          <p className="text-2xl font-bold">🍕</p> 
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Qui la Carne
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
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-green-800 rounded-lg bg-green-700 md:flex-row md:space-x-2 md:mt-0 md:border-0">
            <li><Link to="/menu" className="block py-2 px-4 text-white rounded-2xl hover:bg-green-800 transition-colors">Menu</Link></li>
            <li><Link to="/reservation" className="block py-2 px-4 text-white rounded-2xl hover:bg-green-800 transition-colors">Rezerwacja</Link></li>
            <li><Link to="/about" className="block py-2 px-4 text-white rounded-2xl hover:bg-green-800 transition-colors">O nas</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}