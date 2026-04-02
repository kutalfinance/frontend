import { GuideNavigation, GuideTitle } from "./components";

export default function AdminBranchesGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Managing Branches</GuideTitle>
      <p className="text-muted-foreground italic">Coming soon.</p>
      <GuideNavigation />
    </div>
  );
}
