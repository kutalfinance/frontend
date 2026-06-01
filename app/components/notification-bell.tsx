import { useEffect, useState } from "react";

import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Bell,
  CheckCircle,
  Loader,
  UserRoundPlus,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { type QueuedOperation, getQueuedOperations } from "@/lib/offline";
import { setOfflineMode } from "@/lib/offline-mode";
import type { SyncCompleteDetail, SyncItemResultDetail, SyncStartedDetail } from "@/lib/sync-queue";
import { formatMoney } from "@/lib/utils/money";

// ─── helpers ────────────────────────────────────────────────────────────────

type SyncStatus = "pending" | "synced" | "failed";
type SyncItem = QueuedOperation & { status: SyncStatus };

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function opAmount(op: QueuedOperation): string | null {
  try {
    const b = JSON.parse(op.body);
    if (b.amount) return formatMoney(b.amount);
  } catch {}
  return null;
}

function opTypeLabel(url: string) {
  if (url === "transaction/deposit") return "Deposit";
  if (url === "transaction/withdraw") return "Withdrawal";
  return "New Customer";
}

function OpIcon({ url }: { url: string }) {
  if (url === "transaction/deposit")
    return <BanknoteArrowUp className="size-5 shrink-0 text-green-600" />;
  if (url === "transaction/withdraw")
    return <BanknoteArrowDown className="size-5 shrink-0 text-red-500" />;
  return <UserRoundPlus className="size-5 shrink-0 text-blue-500" />;
}

function SyncStatusIcon({ status }: { status: SyncStatus }) {
  if (status === "synced") return <CheckCircle className="size-4 shrink-0 text-green-600" />;
  if (status === "failed") return <XCircle className="size-4 shrink-0 text-red-500" />;
  return <Loader className="size-4 shrink-0 animate-spin text-amber-500" />;
}

// ─── main component ──────────────────────────────────────────────────────────

export function NotificationBell() {
  const isOnline = useOnlineStatus();
  const [open, setOpen] = useState(false);

  // pending queue
  const [pendingOps, setPendingOps] = useState<QueuedOperation[]>([]);

  // sync progress
  const [syncing, setSyncing] = useState(false);
  const [syncItems, setSyncItems] = useState<SyncItem[]>([]);

  useEffect(() => {
    const refreshQueue = () => getQueuedOperations().then(setPendingOps);
    refreshQueue();
    window.addEventListener("kss:queue-updated", refreshQueue);
    return () => window.removeEventListener("kss:queue-updated", refreshQueue);
  }, []);

  useEffect(() => {
    const handleStarted = (e: Event) => {
      const { ops } = (e as CustomEvent<SyncStartedDetail>).detail;
      setSyncItems(ops.map((op) => ({ ...op, status: "pending" })));
      setSyncing(true);
      setOpen(true);
    };

    const handleItemResult = (e: Event) => {
      const { id, success } = (e as CustomEvent<SyncItemResultDetail>).detail;
      setSyncItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: success ? "synced" : "failed" } : item
        )
      );
    };

    const handleComplete = (e: Event) => {
      const { flushed, failed } = (e as CustomEvent<SyncCompleteDetail>).detail;
      setTimeout(() => {
        setSyncing(false);
        setOpen(false);
        setSyncItems([]);
        if (flushed > 0)
          toast.success(`${flushed} ${flushed === 1 ? "action" : "actions"} synced successfully`);
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

  const hasBadge = !isOnline || pendingOps.length > 0 || syncing;
  const done = syncItems.filter((i) => i.status !== "pending").length;
  const allSyncDone = syncItems.length > 0 && done === syncItems.length;

  // ─── sheet content ────────────────────────────────────────────────────────

  let sheetTitle: string;
  let sheetDescription: string;

  if (syncing) {
    sheetTitle = allSyncDone ? "Sync complete" : `Syncing ${syncItems.length} ${syncItems.length === 1 ? "action" : "actions"}...`;
    sheetDescription = allSyncDone
      ? `${syncItems.filter((i) => i.status === "synced").length} synced, ${syncItems.filter((i) => i.status === "failed").length} failed`
      : `${done} of ${syncItems.length} done`;
  } else if (!isOnline) {
    sheetTitle = "Offline";
    sheetDescription =
      pendingOps.length > 0
        ? `${pendingOps.length} ${pendingOps.length === 1 ? "action" : "actions"} queued — will sync when connection is restored`
        : "No pending actions. Will sync automatically when connection is restored.";
  } else {
    sheetTitle = "All caught up";
    sheetDescription = "You're online and everything is synced.";
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {hasBadge && (
          <span
            className={`absolute top-1.5 right-1.5 size-2 rounded-full ${syncing ? "animate-pulse bg-amber-500" : "bg-amber-500"}`}
          />
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="top" className="px-0 pb-6 pt-8">
          <SheetHeader className="px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {syncing ? (
                  <Loader className="size-4 animate-spin text-amber-500" />
                ) : isOnline ? (
                  <Wifi className="size-4 text-green-600" />
                ) : (
                  <WifiOff className="size-4 text-amber-500" />
                )}
                <SheetTitle>{sheetTitle}</SheetTitle>
              </div>
              {!syncing && (
                <Button
                  variant={isOnline ? "outline" : "default"}
                  size="sm"
                  onClick={() => setOfflineMode(isOnline)}
                >
                  {isOnline ? "Go Offline" : "Go Online"}
                </Button>
              )}
            </div>
            <SheetDescription>{sheetDescription}</SheetDescription>
          </SheetHeader>

          {/* syncing state */}
          {syncing && syncItems.length > 0 && (
            <ul className="mt-4 divide-y">
              {syncItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-6 py-3">
                  <OpIcon url={item.url} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.label || opTypeLabel(item.url)}
                    </p>
                    {opAmount(item) && (
                      <p className="text-muted-foreground text-xs">{opAmount(item)}</p>
                    )}
                  </div>
                  <SyncStatusIcon status={item.status} />
                </li>
              ))}
            </ul>
          )}

          {/* offline pending state */}
          {!syncing && !isOnline && pendingOps.length > 0 && (
            <ul className="mt-4 divide-y">
              {pendingOps.map((op) => (
                <li key={op.id} className="flex items-center gap-3 px-6 py-3">
                  <OpIcon url={op.url} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{op.label || opTypeLabel(op.url)}</p>
                    {opAmount(op) && (
                      <p className="text-muted-foreground text-xs">{opAmount(op)}</p>
                    )}
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {timeAgo(op.queuedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
