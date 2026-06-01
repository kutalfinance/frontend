import { useEffect, useState } from "react";

import { BanknoteArrowDown, BanknoteArrowUp, CheckCircle, Loader, UserRoundPlus, XCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type QueuedOperation } from "@/lib/offline";
import { formatMoney } from "@/lib/utils/money";
import type { SyncCompleteDetail, SyncItemResultDetail, SyncStartedDetail } from "@/lib/sync-queue";

type SyncItemStatus = "pending" | "synced" | "failed";
type SyncItem = QueuedOperation & { status: SyncItemStatus };

function OpIcon({ url }: { url: string }) {
  if (url === "transaction/deposit")
    return <BanknoteArrowUp className="size-5 shrink-0 text-green-600" />;
  if (url === "transaction/withdraw")
    return <BanknoteArrowDown className="size-5 shrink-0 text-red-500" />;
  return <UserRoundPlus className="size-5 shrink-0 text-blue-500" />;
}

function StatusIcon({ status }: { status: SyncItemStatus }) {
  if (status === "synced") return <CheckCircle className="size-4 shrink-0 text-green-600" />;
  if (status === "failed") return <XCircle className="size-4 shrink-0 text-red-500" />;
  return <Loader className="size-4 shrink-0 animate-spin text-amber-500" />;
}

function opAmount(op: QueuedOperation): string | null {
  try {
    const body = JSON.parse(op.body);
    if (body.amount) return formatMoney(body.amount);
  } catch {}
  return null;
}

function opTypeLabel(url: string): string {
  if (url === "transaction/deposit") return "Deposit";
  if (url === "transaction/withdraw") return "Withdrawal";
  return "New Customer";
}

export function SyncProgressSheet() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SyncItem[]>([]);

  useEffect(() => {
    const handleStarted = (e: Event) => {
      const { ops } = (e as CustomEvent<SyncStartedDetail>).detail;
      setItems(ops.map((op) => ({ ...op, status: "pending" })));
      setOpen(true);
    };

    const handleItemResult = (e: Event) => {
      const { id, success } = (e as CustomEvent<SyncItemResultDetail>).detail;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: success ? "synced" : "failed" } : item
        )
      );
    };

    const handleComplete = (e: Event) => {
      const { flushed, failed } = (e as CustomEvent<SyncCompleteDetail>).detail;
      setTimeout(() => {
        setOpen(false);
        if (flushed > 0)
          toast.success(
            `${flushed} ${flushed === 1 ? "action" : "actions"} synced successfully`
          );
        if (failed > 0)
          toast.error(
            `${failed} ${failed === 1 ? "action" : "actions"} failed to sync — will retry on reconnect`
          );
      }, 1500);
    };

    window.addEventListener("kss:sync-started", handleStarted);
    window.addEventListener("kss:sync-item-result", handleItemResult);
    window.addEventListener("kss:sync-complete", handleComplete);
    return () => {
      window.removeEventListener("kss:sync-started", handleStarted);
      window.removeEventListener("kss:sync-item-result", handleItemResult);
      window.removeEventListener("kss:sync-complete", handleComplete);
    };
  }, []);

  const total = items.length;
  const done = items.filter((i) => i.status !== "pending").length;
  const allDone = total > 0 && done === total;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="top" className="px-0 pb-6 pt-8">
        <SheetHeader className="px-6">
          <SheetTitle>
            {allDone ? "Sync complete" : `Syncing ${total} pending ${total === 1 ? "action" : "actions"}...`}
          </SheetTitle>
          <SheetDescription>
            {allDone
              ? `${items.filter((i) => i.status === "synced").length} synced, ${items.filter((i) => i.status === "failed").length} failed`
              : `${done} of ${total} done`}
          </SheetDescription>
        </SheetHeader>

        <ul className="mt-4 divide-y">
          {items.map((item) => {
            const amount = opAmount(item);
            return (
              <li key={item.id} className="flex items-center gap-3 px-6 py-3">
                <OpIcon url={item.url} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.label || opTypeLabel(item.url)}
                  </p>
                  {amount && <p className="text-muted-foreground text-xs">{amount}</p>}
                </div>
                <StatusIcon status={item.status} />
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
