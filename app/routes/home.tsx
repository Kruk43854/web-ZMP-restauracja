import { useState } from "react";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Qui la Carne" }];
}

export default function CarouselSection() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const bestsellers = [
    {
      id: 1,
      name: t('home.bestsellers.pizza.name'),
      description: t('home.bestsellers.pizza.desc'),
      price: "36 zł",
      image: "/pizza.jpg"
    },
    {
      id: 2,
      name: t('home.bestsellers.steak.name'),
      description: t('home.bestsellers.steak.desc'),
      price: "140 zł",
      image: "/steak.jpg" 
    },
    {
      id: 3,
      name: t('home.bestsellers.pasta.name'),
      description: t('home.bestsellers.pasta.desc'),
      price: "48 zł",
      image: "/pasta.jpg" 
    }
  ];
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? bestsellers.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === bestsellers.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="grow pt-16">
      <header 
        className="relative h-[calc(100vh-4rem)] bg-cover bg-center"
        style={{ backgroundImage: "url('/tlo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            
            <h1 className="text-7xl md:text-9xl italic font-bold font-fancy mb-6 tracking-wide text-red-500">
              Qui la Carne
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-light">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/menu" className="bg-red-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
                {t('home.hero.menuBtn')}
              </Link>
              <Link to="/reservation" className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-red-900 transition-colors">
                {t('home.hero.reserveBtn')}
              </Link>
            </div>
            
          </div>
        </div>
      </header>

      <div className="font-sans">
        <section className="py-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

            <div className="text-lg text-gray-800 leading-relaxed text-justify md:text-left space-y-6">
              <h2 className="text-5xl font-bold font-fancy mb-16 text-left text-black">{t('home.about.title')}</h2>
              <p className="font-medium">
                {t('home.about.p1')}
              </p>
              <p className="font-medium text-gray-700">
                {t('home.about.p2')}
              </p>
            </div>

            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/owners2.png" 
                alt="Założyciele restauracji Qui la Carne - włoscy bracia" 
                className="w-full h-auto rounded-3xl shadow-2xl object-cover ring-1 ring-black/5"
              />

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 italic font-fancy bg-white p-4 rounded-2xl shadow-xl text-4xl whitespace-nowrap">
                Giorgio & Leonardo
              </div>
            </div>    
            
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold font-fancy text-center mb-16 text-gray-800">
              {t('home.why.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">

              <div className="p-6 rounded-2xl transition-colors hover:bg-red-100">
                <div className="text-red-600 mb-6 flex justify-center">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h5 className="text-2xl font-semibold mb-4 text-gray-900">{t('home.why.f1.title')}</h5>
                <p className="text-gray-600 leading-relaxed">
                  {t('home.why.f1.desc')}
                </p>
              </div>

              <div className="p-6 rounded-2xl transition-colors hover:bg-red-100">
                <div className="text-red-600 mb-6 flex justify-center">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="text-2xl font-semibold mb-4 text-gray-900">{t('home.why.f2.title')}</h5>
                <p className="text-gray-600 leading-relaxed">
                  {t('home.why.f2.desc')}
                </p>
              </div>

              <div className="p-6 rounded-2xl transition-colors hover:bg-red-100">
                <div className="text-red-600 mb-6 flex justify-center">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h5 className="text-2xl font-semibold mb-4 text-gray-900">{t('home.why.f3.title')}</h5>
                <p className="text-gray-600 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: t('home.why.f3.desc') }} />
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-fancy">
                {t('home.carousel.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('home.carousel.subtitle')}
              </p>
            </div>

            <div className="relative w-full max-w-4xl mx-auto">
              
              <div className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-100 min-h-100">

                <div className="w-full md:w-1/2 h-100">
                  <img 
                    src={bestsellers[currentIndex].image} 
                    alt={bestsellers[currentIndex].name}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 text-center md:text-left flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {bestsellers[currentIndex].name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {bestsellers[currentIndex].description}
                  </p>
                  <div className="text-2xl font-semibold text-red-600">
                    {bestsellers[currentIndex].price}
                  </div>
                </div>
                
              </div>

              <button 
                onClick={prevSlide}
                className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-red-600 hover:bg-red-50 hover:scale-110 transition-all focus:outline-none ring-1 ring-gray-200"
                aria-label="Poprzednie danie"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-red-600 hover:bg-red-50 hover:scale-110 transition-all focus:outline-none ring-1 ring-gray-200"
                aria-label="Następne danie"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>

              <div className="flex justify-center mt-8 gap-2">
                {bestsellers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-red-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Przejdź do slajdu ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>
      </div>

    </main>
  );
}