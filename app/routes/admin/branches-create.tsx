import { Link, href, useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building, ChevronDown, X } from "lucide-react";
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
  approverIds: z.array(z.string()).min(1, "Please select at least one approver"),
});

type CreateBranchForm = z.infer<typeof createBranchFormSchema>;

export default function CreateBranch() {
  const navigate = useNavigate();
  const { mutate: createBranch, isPending } = useCreateBranch();
  const { data: agentsData } = useUsers({
    searchParams: { role: UserRoles.AGENT, hasNoBranch: true },
  });
  const { data: adminsData } = useUsers({
    searchParams: { role: UserRoles.ADMIN, approver: true },
  });
  const agents = agentsData?.data ?? [];
  const approvers = adminsData?.data ?? [];

  const form = useForm<CreateBranchForm>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: { name: "", location: "", agentId: "", approverIds: [] },
  });

  const selectedAgent = agents.find((agent) => agent.id === form.watch("agentId"));
  const selectedApproverIds = form.watch("approverIds");

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
            name="approverIds"
            render={({ field }) => (
              <FormItem>
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
                          {approver?.name}
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
      <DialogContent>{body}</DialogContent>
    </Dialog>
  );
}
