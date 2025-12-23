import { Link, href, useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building, ChevronDown } from "lucide-react";
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
  approverId: z.string().min(1, "Please select an approver"),
});

type CreateBranchForm = z.infer<typeof createBranchFormSchema>;

export default function CreateBranch() {
  const navigate = useNavigate();
  const { mutate: createBranch, isPending } = useCreateBranch();
  const { data: agentsData } = useUsers({ searchParams: { role: UserRoles.AGENT } });
  const { data: adminsData } = useUsers({
    searchParams: { role: UserRoles.ADMIN, approver: true },
  });
  const agents = agentsData?.data ?? [];
  const approvers = adminsData?.data ?? [];

  const form = useForm<CreateBranchForm>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: { name: "", location: "", agentId: "" },
  });

  const selectedAgent = agents.find((agent) => agent.id === form.watch("agentId"));
  const selectedApprover = approvers.find((approver) => approver.id === form.watch("approverId"));

  function handleSubmit(values: CreateBranchForm) {
    createBranch(values, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  }

  let body = (
    <>
      <DialogHeader>
        <DialogTitle>Create New Branch</DialogTitle>
        <DialogDescription>
          Add a new branch location and assign an agent to manage it.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 sm:grid-cols-2">
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

          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned agent</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {selectedAgent ? (
                          <span className="truncate">
                            {selectedAgent.name} - {selectedAgent.email}
                          </span>
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
                            <CommandItem
                              key={agent.id}
                              onSelect={() => field.onChange(agent.id)}
                              asChild
                            >
                              <PopoverClose className="w-full">
                                {agent.name} - {agent.email}
                              </PopoverClose>
                            </CommandItem>
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
            name="approverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approver</FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="">
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {selectedApprover ? (
                          <span className="truncate">
                            {selectedApprover.name} - {selectedApprover.email}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Select an approver</span>
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
                          {approvers.map((approver) => (
                            <CommandItem
                              key={approver.id}
                              onSelect={() => field.onChange(approver.id)}
                              asChild
                            >
                              <PopoverClose>
                                {approver.name} - {approver.email}
                              </PopoverClose>
                            </CommandItem>
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

          <DialogFooter className="sm:col-span-2">
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
    </>
  );

  if (!agents.length) {
    body = (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building />
            </EmptyMedia>
            <EmptyTitle>No agents available</EmptyTitle>
            <EmptyDescription>
              You need to create agents before adding branches. Please add a branch first.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to={href("/admin/users/create")}>Go to agents</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </>
    );
  }

  return (
    <Dialog defaultOpen onOpenChange={() => navigate(-1)}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>{body}</DialogContent>
    </Dialog>
  );
}
