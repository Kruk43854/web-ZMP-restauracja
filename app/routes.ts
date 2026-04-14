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
    route("confirm-email-change", "routes/confirm-email-change.tsx"),
    route("reset-password", "routes/reset-password.tsx"),
    route("settings", "routes/settings.tsx"),
    route("my-reservations", "routes/my-reservations.tsx"),

    ] satisfies RouteConfig;
