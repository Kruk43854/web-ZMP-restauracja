import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Navbar from "./components/navbar"; 

import appStylesHref from "./app.css?url";

export const links = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar /> 
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}