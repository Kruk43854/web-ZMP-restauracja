import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Qui la Carne" }];
}

export default function Home() {
  return (
    <main className="grow pt-16">
      <header 
        className="relative h-[calc(100vh-4rem)] bg-cover bg-center"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            
            <h1 className="text-7xl md:text-9xl italic font-fancy mb-6 tracking-wide text-red-500">
              Qui la Carne
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-light">
              Najlepsza włoska restauracja w Polsce!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/menu" className="bg-red-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
                Zobacz Menu
              </Link>
              <Link to="/contact" className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-red-900 transition-colors">
                Zarezerwuj stolik
              </Link>
            </div>
            
          </div>
        </div>
      </header>
    </main>
  );
}