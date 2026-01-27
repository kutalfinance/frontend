import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/home.tsx"),
  route("/initialize", "./routes/initialize.tsx"),

  layout("./routes/auth/auth-layout.tsx", [
    ...prefix("auth", [
      index("./routes/auth/auth-home.tsx"),
      route("/admin/login", "./routes/auth/admin/login.tsx"),
      route("/admin/setup", "./routes/auth/admin/setup.tsx"),
      route("/admin/verify", "./routes/auth/admin/verify.tsx"),

      route("/agent/login", "./routes/auth/agent/login.tsx"),
      route("/agent/verify", "./routes/auth/agent/verify.tsx"),
    ]),
  ]),

  route("/admin", "./routes/admin/layout.tsx", [
    route("", "./routes/admin/transactions.tsx"),
    route("customers", "./routes/admin/customers.tsx", [
      route("create", "./routes/admin/customer-create.tsx"),
    ]),
    route("branches", "./routes/admin/branches.tsx", [
      route("create", "./routes/admin/branches-create.tsx"),
    ]),
    route("users", "./routes/admin/users.tsx", [
      route("create", "./routes/admin/users-create.tsx"),
      route("deactivated", "./routes/admin/users-deactivated.tsx"),
    ]),
    route("pending-approvals", "./routes/admin/pending-approvals.tsx"),
    route("audit", "./routes/admin/audit.tsx"),
  ]),

  route("/agent", "./routes/agent/layout.tsx", [
    index("./routes/agent/index.tsx"),
    route("customers/create", "./routes/agent/customer-create.tsx"),
    route("customers/:customerId", "./routes/agent/customer-details.tsx"),
  ]),
] satisfies RouteConfig;
