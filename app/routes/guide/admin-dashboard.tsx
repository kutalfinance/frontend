import { Link } from "react-router";

import { AdminNavPreview, GuideNavigation, GuideTitle } from "./components";

export default function AdminDashboardGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Dashboard</GuideTitle>
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing the Dashboard</h3>
        <p>
          Click <strong>Home</strong> in the navigation bar to return to the dashboard at any time.
        </p>
        <AdminNavPreview highlight="Home" />
      </div>

      <p>
        The admin dashboard is the <strong>Transactions</strong> page. It displays all transactions
        across the system with filtering by branch, customer, date range, type, and status. Summary
        metrics at the top show total deposits, withdrawals, and balances.
      </p>
      <p>
        For a detailed walkthrough of filtering, searching, and understanding transaction data, see
        the{" "}
        <Link to="/guide/admin/transactions" className="text-primary hover:underline">
          Transactions
        </Link>{" "}
        guide.
      </p>
      <GuideNavigation />
    </div>
  );
}
