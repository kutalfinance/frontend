import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateBranch } from "@/hooks/data/branches";
import { useUsers } from "@/hooks/data/users";
import { UserRoles, type Branch } from "@/lib/types";
import { ChevronDown } from "lucide-react";

const editBranchFormSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  agentId: z.string().min(1, "Please select an agent"),
});

type EditBranchForm = z.infer<typeof editBranchFormSchema>;

export function EditBranch({
  branch,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { branch: Branch }) {
  const { mutate: updateBranch, isPending } = useUpdateBranch();
  const { data: usersData } = useUsers({ searchParams: { role: UserRoles.AGENT } });
  const agents = usersData?.data ?? [];

  const form = useForm<EditBranchForm>({
    resolver: zodResolver(editBranchFormSchema),
    defaultValues: {
      name: branch.name,
      location: branch.location,
      agentId: branch.agent.id || "",
    },
  });

  const selectedAgent = agents.find((agent) => agent.id === form.watch("agentId"));

  function handleSubmit(values: EditBranchForm) {
    updateBranch({ id: branch.id, ...values });
  }

  return (
    <Dialog>
      <DialogTrigger {...props} />

      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
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
                              <PopoverClose asChild>
                                <CommandItem
                                  key={agent.id}
                                  onSelect={() => field.onChange(agent.id)}
                                >
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
