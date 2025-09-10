import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // Admin user routes
  layout("./routes/layout.tsx", [
    index("./routes/home.tsx"),

    route("users", "./routes/users.tsx", [route("users/create", "./routes/users-create.tsx")]),
    route("customers", "./routes/customers.tsx", [
      route("create", "./routes/customers-create.tsx"),
    ]),
  ]),

  route("auth", "./routes/auth-layout.tsx", [
    index("./routes/auth.tsx"),

    // Admin auth routes (nested under /u)
    ...prefix("admin", [
      route("/initialize", "./routes/auth-admin-init.tsx"),
      route("/login", "./routes/auth-admin-login.tsx"),
      route("/otp", "./routes/auth-admin-otp.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
