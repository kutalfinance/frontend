import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/home.tsx"),
  route("/initialize", "./routes/initialize.tsx"),

  route("/guide", "./routes/guide/layout.tsx", [
    index("./routes/guide/overview.tsx"),
    ...prefix("admin", [
      route("login", "./routes/guide/admin-login.tsx"),
      route("dashboard", "./routes/guide/admin-dashboard.tsx"),
      route("users", "./routes/guide/admin-users.tsx"),
      route("branches", "./routes/guide/admin-branches.tsx"),
      route("customers", "./routes/guide/admin-customers.tsx"),
      route("transactions", "./routes/guide/admin-transactions.tsx"),
      route("withdrawals", "./routes/guide/admin-withdrawals.tsx"),
      route("reports", "./routes/guide/admin-reports.tsx"),
      route("audit-logs", "./routes/guide/admin-audit-logs.tsx"),
    ]),
    ...prefix("agent", [
      route("login", "./routes/guide/agent-login.tsx"),
      route("dashboard", "./routes/guide/agent-dashboard.tsx"),
      route("customers", "./routes/guide/agent-customers.tsx"),
      route("deposits", "./routes/guide/agent-deposits.tsx"),
      route("withdrawals", "./routes/guide/agent-withdrawals.tsx"),
      route("customer-details", "./routes/guide/agent-customer-details.tsx"),
    ]),
  ]),

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
    route("customers", "./routes/agent/customers.tsx"),
    route("customers/create", "./routes/agent/customer-create.tsx"),
    route("customers/:customerId", "./routes/agent/customer-details.tsx"),
  ]),
] satisfies RouteConfig;
