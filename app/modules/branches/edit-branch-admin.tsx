import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useUpdateBranch } from "@/hooks/data/branches";
import { useUsers } from "@/hooks/data/users";
import { type Branch, type User, UserRoles } from "@/lib/types";

const editBranchFormSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  agentId: z.string().min(1, "Please select an agent"),
  approverIds: z.array(z.string()).min(1, "Please select at least one approver"),
});

type EditBranchForm = z.infer<typeof editBranchFormSchema>;

export function EditBranchAdmin({
  branch,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { branch: Branch }) {
  const [open, setOpen] = useState(false);
  const { mutate: updateBranch, isPending } = useUpdateBranch();
  const { data: usersData } = useUsers({
    searchParams: { role: UserRoles.AGENT, hasNoBranch: true },
  });
  const { data: adminsData } = useUsers({
    searchParams: { role: UserRoles.ADMIN, approver: true },
  });
  const fetchedAgents = usersData?.data ?? [];
  const currentAgent = fetchedAgents.find((a) => a.id === branch.agent.id);
  const agents = currentAgent
    ? fetchedAgents
    : [{ id: branch.agent.id, name: branch.agent.name, email: "" } as User, ...fetchedAgents];
  const approvers = adminsData?.data ?? [];

  const form = useForm<EditBranchForm>({
    resolver: zodResolver(editBranchFormSchema),
    defaultValues: {
      name: branch.name,
      location: branch.location,
      agentId: branch.agent.id || "",
      approverIds: branch.approvers?.map((a) => a.id) ?? [],
    },
  });

  const selectedAgent = agents.find((agent) => agent.id === form.watch("agentId"));
  const selectedApproverIds = form.watch("approverIds");

  function handleSubmit(values: EditBranchForm) {
    updateBranch({ id: branch.id, ...values }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>Update branch details and agent assignment.</DialogDescription>
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
                <FormItem className="w-full">
                  <FormLabel>Assigned agent</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild className="w-full">
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal"
                        >
                          {selectedAgent ? (
                            <>
                              {selectedAgent.name} - {selectedAgent.email}
                            </>
                          ) : (
                            <span className="text-muted-foreground">Select an agent</span>
                          )}

                          <ChevronDown className="text-muted-foreground ml-auto" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search agents..." />
                        <CommandList>
                          <CommandEmpty>No agents found.</CommandEmpty>
                          <CommandGroup>
                            {agents.map((agent) => (
                              <PopoverClose asChild key={agent.id}>
                                <CommandItem onSelect={() => field.onChange(agent.id)}>
                                  {agent.name} - {agent.email}
                                </CommandItem>
                              </PopoverClose>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approverIds"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Approvers</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal"
                        >
                          {selectedApproverIds.length > 0 ? (
                            <span className="truncate">
                              {selectedApproverIds.length} approver
                              {selectedApproverIds.length > 1 ? "s" : ""} selected
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Select approvers</span>
                          )}
                          <ChevronDown className="text-muted-foreground ml-auto" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search approvers..." />
                        <CommandList>
                          <CommandEmpty>No approvers found.</CommandEmpty>
                          <CommandGroup>
                            {approvers.map((approver) => {
                              const isSelected = field.value.includes(approver.id);
                              return (
                                <CommandItem
                                  key={approver.id}
                                  onSelect={() => {
                                    const next = isSelected
                                      ? field.value.filter((id) => id !== approver.id)
                                      : [...field.value, approver.id];
                                    field.onChange(next);
                                  }}
                                >
                                  <Checkbox checked={isSelected} className="mr-2" />
                                  {approver.name} - {approver.email}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedApproverIds.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedApproverIds.map((id) => {
                        const approver = approvers.find((a) => a.id === id);
                        return (
                          <span
                            key={id}
                            className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                          >
                            {approver?.name ?? branch.approvers?.find((a) => a.id === id)?.name}
                            <button
                              type="button"
                              onClick={() => field.onChange(field.value.filter((v) => v !== id))}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
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
                Update Branch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
