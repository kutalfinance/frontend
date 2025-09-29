import { useState } from "react";

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

import { useDeleteUser } from "@/hooks/data/users";
import type { User } from "@/lib/types";

export function DeleteUser({
  user,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { user: User }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteUser();

  function onDelete() {
    mutate({ id: user.id, role: user.role });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {user.isSuperAdmin ? "super admin" : user.role.toLowerCase()} account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{user.name}</strong>{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onDelete}>
            <Button variant="destructive">Delete User</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
