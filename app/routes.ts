import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  layout("./routes/auth.tsx", [
    route("/auth/initialize", "./routes/auth-init.tsx"),
    route("/auth/otp", "./routes/auth-init-otp.tsx"),
    route("/auth/login", "./routes/auth-login.tsx"),
  ]),
] satisfies RouteConfig;
