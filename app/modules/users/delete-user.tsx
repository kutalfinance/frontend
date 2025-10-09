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

import { useDeactivateUser, useDeleteUser } from "@/hooks/data/users";
import type { User } from "@/lib/types";

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
      <AlertDialogTrigger asChild {...props} />
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
