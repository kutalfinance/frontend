import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SuperAdminOnly } from "@/components/protected";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paragraph } from "@/components/ui/text";

import {
  downloadAdminDailyReportOptions,
  downloadAgentDailyReportOptions,
  useDeactivateUser,
  useDeleteUser,
  useRestoreUser,
  useUpdateUser,
} from "@/hooks/data/users";
import { type User, UserRoles } from "@/lib/types";

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, "Must be a valid Ghana number (e.g. 0241234567)")
    .optional()
    .or(z.literal("")),
  isApprover: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export function EditUser({
  user,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { user: User }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateUser();

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    values: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber ?? "",
      isApprover: user.approver ?? false,
      isSuperAdmin: user.superAdmin ?? false,
    },
  });

  function onSubmit(data: EditUserForm) {
    mutate(
      { id: user.id, ...data, phoneNumber: data.phoneNumber || undefined },
      { onSuccess: () => setOpen(false) }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update details for {user.name}.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional — for SMS OTP)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 0241234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user.role === UserRoles.ADMIN && (
              <>
                <FormField
                  control={form.control}
                  name="isApprover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="hover:bg-muted relative flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors">
                          <div className="flex-1 space-y-1">
                            <FormLabel>Approver Access</FormLabel>
                            <Paragraph className="text-muted-foreground text-xs">
                              Allow this administrator to approve transactions and critical actions
                            </Paragraph>
                          </div>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="after:absolute after:inset-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SuperAdminOnly>
                  <FormField
                    control={form.control}
                    name="isSuperAdmin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="hover:bg-muted relative flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors">
                            <div className="flex-1 space-y-1">
                              <FormLabel>Super Administrator</FormLabel>
                              <Paragraph className="text-muted-foreground text-xs">
                                Grant full administrative privileges and user management
                                capabilities
                              </Paragraph>
                            </div>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="after:absolute after:inset-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SuperAdminOnly>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button isLoading={isPending} type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function RestoreUser({
  users,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { users: User[] }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useRestoreUser();

  function onRestore() {
    mutate(
      users.map((user) => user.id),
      { onSuccess: () => setOpen(false) }
    );
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button isLoading={isPending} onClick={onRestore}>
            Restore User{users.length > 1 ? "s" : ""}
          </Button>
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
  const { mutate, isPending } = useDeactivateUser();

  function onDeactivate() {
    mutate(
      users.map((user) => user.id),
      { onSuccess: () => setOpen(false) }
    );
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" isLoading={isPending} onClick={onDeactivate}>
            Deactivate User{users.length > 1 ? "s" : ""}
          </Button>
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
  const { mutate, isPending } = useDeleteUser();

  function onDelete() {
    mutate(
      users.map((user) => user.id),
      { onSuccess: () => setOpen(false) }
    );
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" isLoading={isPending} onClick={onDelete}>
            Delete User{users.length > 1 ? "s" : ""}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DownloadAgentReport({
  user,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { user: User }) {
  const today = new Date().toISOString().split("T")[0];
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { mutate, isPending } = useMutation(downloadAgentDailyReportOptions);

  function onDownload() {
    mutate({ agentId: user.id, startDate, endDate }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Agent Report</DialogTitle>
          <DialogDescription>
            Download report for {user.name}. Select a date or range.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="startDate">From</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">To</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
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

export function DownloadAgentSelfReport({
  user,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & { user: User }) {
  const today = new Date().toISOString().split("T")[0];
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { mutate, isPending } = useMutation(downloadAgentDailyReportOptions);

  function onDownload() {
    mutate({ agentId: user.id, startDate, endDate }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Daily Report</DialogTitle>
          <DialogDescription>Download your activity report. Select a date or range.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="selfStartDate">From</Label>
            <Input id="selfStartDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selfEndDate">To</Label>
            <Input id="selfEndDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
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

export function DownloadAdminReport({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  const today = new Date().toISOString().split("T")[0];
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { mutate, isPending } = useMutation(downloadAdminDailyReportOptions);

  function onDownload() {
    mutate({ startDate, endDate }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Admin Report</DialogTitle>
          <DialogDescription>
            Download admin report across all branches. Select a date or range.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="adminStartDate">From</Label>
            <Input id="adminStartDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEndDate">To</Label>
            <Input id="adminEndDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
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
