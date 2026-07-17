import { useState } from "react";

import { AlertCircle, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBranchesAdmin } from "@/hooks/data/branches";
import {
  useDeactivateBranch,
  useDeleteBranch,
  useRelieveAgent,
} from "@/hooks/data/branches";
import { useCustomers } from "@/hooks/data/customers";
import { useDeleteCustomers, useMoveCustomers } from "@/hooks/data/customers";
import type { Branch } from "@/lib/types";

type CustomerAction = "keep" | "move" | "delete";

type BranchActionDialogProps = {
  branch: Branch;
  mode: "disable" | "delete";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BranchActionDialog({ branch, mode, open, onOpenChange }: BranchActionDialogProps) {
  const [customerAction, setCustomerAction] = useState<CustomerAction>(
    mode === "delete" ? "move" : "keep"
  );
  const [targetBranchId, setTargetBranchId] = useState("");

  const { data: customersRes } = useCustomers({ searchParams: { branchId: branch.id } });
  const { data: branchesRes } = useBranchesAdmin();
  const customers = customersRes?.data ?? [];
  const otherBranches = (branchesRes?.data ?? []).filter((b) => b.id !== branch.id);

  const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();
  const { mutate: deactivateBranch, isPending: isDeactivating } = useDeactivateBranch();
  const { mutate: relieveAgent, isPending: isRelieving } = useRelieveAgent();
  const { mutate: deleteCustomers, isPending: isDeletingCustomers } = useDeleteCustomers();
  const { mutate: moveCustomers, isPending: isMoving } = useMoveCustomers();

  const isPending = isDeleting || isDeactivating || isRelieving || isDeletingCustomers || isMoving;

  async function handleConfirm() {
    const customerIds = customers.map((c) => c.id);

    const done = () => onOpenChange(false);

    const proceed = () => {
      if (mode === "delete") {
        deleteBranch([branch.id], { onSuccess: done });
      } else {
        deactivateBranch([branch.id], { onSuccess: done });
      }
    };

    if (customerAction === "delete" && customerIds.length > 0) {
      deleteCustomers(customerIds, { onSuccess: proceed });
    } else if (customerAction === "move" && targetBranchId && customerIds.length > 0) {
      moveCustomers({ ids: customerIds, targetBranchId }, { onSuccess: proceed });
    } else if (customerAction === "keep" || customerIds.length === 0) {
      if (mode === "delete" && branch.agent) {
        relieveAgent(branch.id, { onSuccess: proceed });
      } else {
        proceed();
      }
    }
  }

  const isDelete = mode === "delete";
  const title = isDelete ? `Delete branch "${branch.name}"?` : `Disable branch "${branch.name}"?`;
  const confirmLabel = isDelete ? "Delete Branch" : "Disable Branch";

  const canConfirm =
    customerAction !== "move" || (customerAction === "move" && !!targetBranchId);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                {isDelete
                  ? "This permanently removes the branch and cannot be undone."
                  : "The branch will be hidden and can be re-enabled later."}
              </p>

              {branch.agent && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    Agent <strong>{branch.agent.name}</strong> will be{" "}
                    {isDelete ? "relieved from this branch" : "unlinked if you choose to disable"}.
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {customers.length > 0
                    ? `What should happen to the ${customers.length} customer(s)?`
                    : "This branch has no customers."}
                </p>

                {customers.length > 0 && (
                  <RadioGroup
                    value={customerAction}
                    onValueChange={(v) => setCustomerAction(v as CustomerAction)}
                    className="space-y-2"
                  >
                    {!isDelete && (
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="keep" id="keep" />
                        <Label htmlFor="keep">Keep customers in this branch</Label>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="move" id="move" />
                      <Label htmlFor="move">Move to another branch</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="delete" id="delete" />
                      <Label htmlFor="delete" className="text-destructive">
                        Delete all customers
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {customerAction === "move" && (
                  <Select value={targetBranchId} onValueChange={setTargetBranchId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select target branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherBranches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name} — {b.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || !canConfirm}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
