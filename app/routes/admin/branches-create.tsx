import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

import { useCreateBranch } from "@/hooks/data/branches";
import { useUsers } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { UserRoles } from "@/lib/types";

export function meta() {
  return [
    { title: `Add Branch - ${siteConfig.name}` },
    { name: "description", content: "Create new branch location" },
  ];
}

const createBranchFormSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  agentId: z.string().min(1, "Please select an agent"),
});

type CreateBranchForm = z.infer<typeof createBranchFormSchema>;

export default function CreateBranch() {
  const navigate = useNavigate();
  const { mutate: createBranch, isPending } = useCreateBranch();
  const { data: usersData } = useUsers({ searchParams: { role: UserRoles.AGENT } });
  const agents = usersData?.data ?? [];

  const form = useForm<CreateBranchForm>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: { name: "", location: "", agentId: "" },
  });

  const selectedAgent = agents.find((agent) => agent.id === form.watch("agentId"));

  function handleSubmit(values: CreateBranchForm) {
    createBranch(values, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  }

  return (
    <Dialog defaultOpen onOpenChange={() => navigate(-1)}>
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
                Create Branch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
