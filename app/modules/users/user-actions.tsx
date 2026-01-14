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

import {
  downloadAgentDailyReportOptions,
  useDeactivateUser,
  useDeleteUser,
  useRestoreUser,
} from "@/hooks/data/users";
import type { User } from "@/lib/types";

export function RestoreUser({
  users,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { users: User[] }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useRestoreUser();

  function onRestore() {
    mutate(users.map((user) => user.id));
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore user{users.length > 1 ? "s" : ""}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore the selected user{users.length > 1 ? "s" : ""}, allowing them to
            access the system again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onRestore}>
            <Button>Restore User{users.length > 1 ? "s" : ""}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeactivateUser({
  users,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { users: User[] }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeactivateUser();

  function onDelete() {
    mutate(users.map((user) => user.id));
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate user{users.length > 1 ? "s" : ""}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate the selected user{users.length > 1 ? "s" : ""}, preventing them
            from accessing the system. This action can be reversed later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onDelete}>
            <Button variant="destructive">Deactivate User{users.length > 1 ? "s" : ""}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteUser({
  users,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { users: User[] }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteUser();

  function onDelete() {
    mutate(users.map((user) => user.id));
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user{users.length > 1 ? "s" : ""} account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected user
            {users.length > 1 ? "s" : ""} from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onDelete}>
            <Button variant="destructive">Delete User{users.length > 1 ? "s" : ""}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DownloadAgentReport({
  user,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { user: User }) {
  const [open, setOpen] = useState(false);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split("T")[0]);
  const { mutate, isPending } = useMutation(downloadAgentDailyReportOptions);

  function onDownload() {
    mutate({ agentId: user.id, reportDate }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Daily Report</DialogTitle>
          <DialogDescription>
            Download daily report for {user.name}. Select a date to generate the report.
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
