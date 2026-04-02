import { Link } from "react-router";

import { GuideNavigation, GuideTitle } from "./components";

export default function AdminDashboardGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Dashboard</GuideTitle>
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
