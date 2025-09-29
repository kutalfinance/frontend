import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateBranch } from "@/hooks/data/branches";
import { useUsers } from "@/hooks/data/users";

export const Route = createFileRoute("/admin/branches/create")({
  component: () => <CreateBranch />,
});

const createBranchFormSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  agentId: z.string().min(1, "Please select an agent"),
});

type CreateBranchForm = z.infer<typeof createBranchFormSchema>;

export function CreateBranch() {
  const navigate = useNavigate();
  const { mutate: createBranch, isPending } = useCreateBranch();
  const { data: usersData } = useUsers();
  const agents = usersData?.data?.filter((user) => user.role === "AGENT") ?? [];

  const form = useForm<CreateBranchForm>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: { name: "", location: "", agentId: "" },
  });

  function handleSubmit(values: CreateBranchForm) {
    createBranch(values, {
      onSuccess: () => {
        navigate({ to: "/admin/branches" });
      },
    });
  }

  return (
    <Dialog defaultOpen onOpenChange={() => navigate({ to: "/admin/branches" })}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
          <DialogDescription>
            Add a new branch location and assign an agent to manage it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter branch name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter branch location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Agent</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent to assign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} - {agent.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button isLoading={isPending} type="submit">
                Create Branch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
