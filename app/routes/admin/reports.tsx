import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBranchesAdmin } from "@/hooks/data/branches";
import {
  downloadAdminDailyReportOptions,
  downloadAgentDailyReportOptions,
} from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";

export function meta() {
  return [
    { title: `Reports - ${siteConfig.name}` },
    { name: "description", content: "Download branch and admin reports" },
  ];
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminReports() {
  return (
    <div className="container space-y-8">
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Reports</ModuleTitle>
          <ModuleDescription>Generate and download PDF reports for any date range</ModuleDescription>
        </ModuleHeader>
      </ModuleHeading>

      <div className="grid gap-6 md:grid-cols-2">
        <BranchReportCard />
        <AdminReportCard />
      </div>
    </div>
  );
}

function BranchReportCard() {
  const [branchId, setBranchId] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { data, isPending: loadingBranches } = useBranchesAdmin();
  const branches = data?.data ?? [];
  const { mutate, isPending } = useMutation(downloadAgentDailyReportOptions);

  const selectedBranch = branches.find((b) => b.id === branchId);

  function onDownload() {
    if (!selectedBranch) return;
    mutate({ agentId: selectedBranch.agent.id, startDate, endDate });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Branch</Label>
          <Select value={branchId} onValueChange={setBranchId} disabled={loadingBranches}>
            <SelectTrigger>
              <SelectValue placeholder={loadingBranches ? "Loading branches…" : "Select a branch"} />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} — {b.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBranch && (
            <p className="text-muted-foreground text-xs">Agent: {selectedBranch.agent.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="branchStart">From</Label>
            <Input
              id="branchStart"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branchEnd">To</Label>
            <Input
              id="branchEnd"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={onDownload}
          disabled={!branchId || isPending}
          isLoading={isPending}
        >
          Download Branch Report
        </Button>
      </CardContent>
    </Card>
  );
}

function AdminReportCard() {
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { mutate, isPending } = useMutation(downloadAdminDailyReportOptions);

  function onDownload() {
    mutate({ startDate, endDate });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Summary report across all branches — deposits, withdrawals, service charges and pending
          approvals.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="adminStart">From</Label>
            <Input
              id="adminStart"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEnd">To</Label>
            <Input
              id="adminEnd"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" onClick={onDownload} isLoading={isPending}>
          Download Admin Report
        </Button>
      </CardContent>
    </Card>
  );
}
