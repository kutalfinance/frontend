import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/users", "./routes/users.tsx", [route("/users/create", "./routes/users-create.tsx")]),
    route("/customers", "./routes/customers.tsx", [
      route("/customers/create", "./routes/customers-create.tsx"),
    ]),
  ]),

  layout("./routes/auth.tsx", [
    route("/auth/initialize", "./routes/auth-init.tsx"),
    route("/auth/otp", "./routes/auth-init-otp.tsx"),
    route("/auth/login", "./routes/auth-login.tsx"),
  ]),
] satisfies RouteConfig;
