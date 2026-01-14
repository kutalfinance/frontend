import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { downloadBranchDailyReportOptions, useDeleteBranch } from "@/hooks/data/branches";
import type { Branch } from "@/lib/types";

export function DeleteBranch({
  branch,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { branch: Branch }) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteBranch } = useDeleteBranch();

  function onDelete() {
    deleteBranch(branch.id);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete branch "{branch.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the branch{" "}
            <strong>{branch.name}</strong> located in <strong>{branch.location}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onDelete}>
            <Button variant="destructive">Delete Branch</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DownloadBranchReport({
  branch,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { branch: Branch }) {
  const [open, setOpen] = useState(false);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split("T")[0]);
  const { mutate, isPending } = useMutation(downloadBranchDailyReportOptions);

  function onDownload() {
    mutate({ branchId: branch.id, reportDate }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Daily Report</DialogTitle>
          <DialogDescription>
            Download daily report for {branch.name}. Select a date to generate the report.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reportDate">Report Date</Label>
          <Input
            id="reportDate"
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onDownload} disabled={isPending}>
            {isPending ? "Downloading..." : "Download Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
