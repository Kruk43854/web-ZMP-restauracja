import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("reservation", "routes/reservation.tsx"),
    route("menu", "routes/menu.tsx"),
    route("about", "routes/about.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("forgot-password", "routes/forgot-password.tsx"),
    route("confirmation", "routes/confirm-email.tsx"),
    route("reset-password", "routes/reset-password.tsx"),

    ] satisfies RouteConfig;
