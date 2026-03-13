#  Qui la Carne - Frontend

Aplikacja webowa dla włoskiej restauracji "Qui la Carne".

## 🛠 Technologie

Projekt opiera się na:

* **Framework:** React + React Router v7
* **Build Tool:** Vite
* **Język:** TypeScript
* **Style:** Tailwind CSS
* **Tłumaczenia (i18n):** `react-i18next`
* **Komunikacja z API:** natywny `fetch` API

## ✨ Główne funkcjonalności

* **Internacjonalizacja (i18n):** Pełne wsparcie dla języka polskiego i angielskiego ze zmianą w locie z poziomu nawigacji.
* **Autoryzacja (JWT):** Rejestracja i logowanie użytkowników, obsługa błędów z serwera, zapisywanie tokenów w `localStorage`.
* **Dynamiczny Routing:** Płynne przechodzenie między widokami bez przeładowywania strony (React Router).
* **Responsywny UI:** W pełni dopasowany do urządzeń mobilnych układ (Tailwind CSS).

## 🚀 Uruchomienie projektu lokalnie

### Wymagania wstępne
Zainstaluj:
* [Node.js](https://nodejs.org/) (wersja 18+ zalecana)
* Menadżer pakietów npm (instalowany razem z Node.js)

### Instalacja i uruchomienie

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/Kruk43854/web-ZMP-restauracja

```
   Zainstaluj zależności:
 ```bash
npm install
Utwórz plik .env w głównym katalogu projektu i zdefiniuj adres API (jeśli nie używasz wbudowanego proxy Vite):

Fragment kodu
VITE_API_URL=http://localhost:8080
Uruchom serwer deweloperski:

Bash
npm run dev
Aplikacja będzie dostępna pod adresem: http://localhost:5173.