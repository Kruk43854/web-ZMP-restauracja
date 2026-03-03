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
              <Link to="/reservation" className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-red-900 transition-colors">
                Zarezerwuj stolik
              </Link>
            </div>
            
          </div>
        </div>
      </header>

    <div className="font-sans">
      <section className="py-12 bg-white">
<div className="container mx-auto px-4 py-24 rounded-3xl">

  

  <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

    <div className="text-lg text-gray-800 leading-relaxed text-justify md:text-left space-y-6">
        <h2 className="text-5xl font-bold mb-16 text-left text-black">Kim jesteśmy?</h2>
      <p className="font-medium">
        Jesteśmy włoskimi braćmi, którzy postanowili przenieść sekrety naszej rodzinnej kuchni do wnętrz pełnych nowoczesnej elegancji.
      </p>
      <p className="font-medium text-gray-700">
        Wierzymy, że prawdziwa włoska gościnność to połączenie szacunku do tradycji z odrobiną współczesnego szyku. U nas każde danie opowiada historię naszego domu, a starannie wyselekcjonowane składniki prosto z Italii sprawiają, że autentyczne smaki smakują tu najlepiej. Zapraszamy do stołu, gdzie czas płynie wolniej.
      </p>
    </div>

    <div className="transform hover:scale-105 transition-transform duration-500">
      <img 
        src="/owners2.png" 
        alt="Założyciele restauracji Qui la Carne - włoscy bracia" 
        className="w-full h-auto rounded-3xl shadow-2xl object-cover ring-1 ring-black/5"
      />
    </div>
    
  </div>
</div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Dlaczego warto nas odwiedzić?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">

            <div className="p-6 rounded-2xl transition-colors hover:bg-red-50">
              <div className="text-red-600 mb-6 flex justify-center">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h5 className="text-2xl font-semibold mb-4 text-gray-900">Autentyczne smaki</h5>
              <p className="text-gray-600 leading-relaxed">
                Sprowadzamy najlepsze produkty prosto z Włoch. U nas zjesz tak, jak w sercu Neapolu, bez kompromisów w jakości.
              </p>
            </div>

            <div className="p-6 rounded-2xl transition-colors hover:bg-red-50">
              <div className="text-red-600 mb-6 flex justify-center">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h5 className="text-2xl font-semibold mb-4 text-gray-900">Błyskawiczna rezerwacja</h5>
              <p className="text-gray-600 leading-relaxed">
                Nie czekaj w kolejce. Zarezerwuj swój ulubiony stolik na wieczór w kilka sekund dzięki naszemu wygodnemu systemowi online.
              </p>
            </div>

            <div className="p-6 rounded-2xl transition-colors hover:bg-red-50">
              <div className="text-red-600 mb-6 flex justify-center">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h5 className="text-2xl font-semibold mb-4 text-gray-900">Rodzinna atmosfera</h5>
              <p className="text-gray-600 leading-relaxed">
                Włoska gościnność to nasza wizytówka. W <i>Qui la Carne</i> każdy gość traktowany jest jak członek naszej rodziny.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>


    </main>
  );
}