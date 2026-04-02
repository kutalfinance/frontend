import { GuideNavigation, GuideTitle } from "./components";

export default function AdminAuditLogsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Audit Logs</GuideTitle>
      <p className="text-muted-foreground italic">Coming soon.</p>
      <GuideNavigation />
    </div>
  );
}
