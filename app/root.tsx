import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Navbar from "./components/navbar"; 
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import appStylesHref from "./app.css?url";

export const links = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <Navbar /> 
            <Outlet />
          </AuthProvider>
        </GoogleOAuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}