import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SuperAdminOnly } from "@/components/protected";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type User, UserRoles } from "@/lib/types";

const editUserFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  role: z.enum(UserRoles),
  isSuperAdmin: z.boolean().optional(),
});

type EditUserForm = z.infer<typeof editUserFormSchema>;

export function EditUser({
  user,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { user: User }) {
  const isPending = false;
  const editForm = useForm<EditUserForm>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: { name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin },
  });

  function handleSubmit(values: EditUserForm) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger {...props} />

      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and permissions. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter user's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(UserRoles).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {editForm.watch("role") === UserRoles.ADMIN && (
              <SuperAdminOnly>
                <FormField
                  control={editForm.control}
                  name="isSuperAdmin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="hover:bg-muted relative flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors">
                          <div className="flex-1 space-y-1">
                            <FormLabel htmlFor="super-admin-switch">Super Administrator</FormLabel>
                            <FormDescription className="text-muted-foreground text-xs">
                              Grant full administrative privileges and user management capabilities
                            </FormDescription>
                          </div>
                          <Checkbox
                            id="super-admin-switch"
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
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button isLoading={isPending} type="submit">
                Update User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
