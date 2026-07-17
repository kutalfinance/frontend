import { useEffect, useState } from "react";

import { BanknoteArrowDown, BanknoteArrowUp, UserRoundPlus, WifiOff } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type QueuedOperation, getQueuedOperations } from "@/lib/offline";
import { formatMoney } from "@/lib/utils/money";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function OpIcon({ url }: { url: string }) {
  if (url === "transaction/deposit")
    return <BanknoteArrowUp className="size-5 shrink-0 text-green-600" />;
  if (url === "transaction/withdraw")
    return <BanknoteArrowDown className="size-5 shrink-0 text-red-500" />;
  return <UserRoundPlus className="size-5 shrink-0 text-blue-500" />;
}

function opTypeLabel(url: string): string {
  if (url === "transaction/deposit") return "Deposit";
  if (url === "transaction/withdraw") return "Withdrawal";
  return "New Customer";
}

function opAmount(op: QueuedOperation): string | null {
  try {
    const body = JSON.parse(op.body);
    if (body.amount) return formatMoney(body.amount);
  } catch {}
  return null;
}

export function OfflineBanner() {
  const [ops, setOps] = useState<QueuedOperation[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refresh = () => getQueuedOperations().then(setOps);
    refresh();
    window.addEventListener("kss:queue-updated", refresh);
    return () => window.removeEventListener("kss:queue-updated", refresh);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-xs font-medium text-white hover:bg-amber-600 transition-colors"
      >
        <WifiOff className="size-3.5 shrink-0" />
        <span>
          You&apos;re offline.
          {ops.length > 0 ? (
            <span className="ml-1">
              <span className="font-bold">{ops.length} pending</span> — tap to view
            </span>
          ) : (
            <span className="ml-1 opacity-80">Actions will sync when connection is restored.</span>
          )}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="top" className="px-0 pb-6 pt-8">
          <SheetHeader className="px-6">
            <div className="flex items-center gap-2">
              <WifiOff className="size-4 text-amber-500" />
              <SheetTitle>Pending Actions</SheetTitle>
            </div>
            <SheetDescription>
              {ops.length === 0
                ? "No pending actions."
                : `${ops.length} ${ops.length === 1 ? "action" : "actions"} queued — will sync automatically when you're back online.`}
            </SheetDescription>
          </SheetHeader>

          {ops.length > 0 && (
            <ul className="mt-4 divide-y">
              {ops.map((op) => {
                const amount = opAmount(op);
                return (
                  <li key={op.id} className="flex items-center gap-3 px-6 py-3">
                    <OpIcon url={op.url} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{op.label || opTypeLabel(op.url)}</p>
                      {amount && (
                        <p className="text-muted-foreground text-xs">{amount}</p>
                      )}
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {timeAgo(op.queuedAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
