import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("reservation", "routes/reservation.tsx"),
    route("menu", "routes/menu.tsx"),
    route("about", "routes/about.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx")

    ] satisfies RouteConfig;
