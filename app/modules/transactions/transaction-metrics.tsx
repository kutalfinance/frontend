import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Coins, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { transactionsMetricsOptions } from "@/hooks/data/transactions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";

export function TransactionMetrics({ customerId }: { customerId?: string }) {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const { data, isPending } = useQuery(
    transactionsMetricsOptions({
      searchParams: {
        customerId,
        startDate: appliedFrom || undefined,
        endDate: appliedTo || undefined,
      },
    })
  );
  const metrics = data?.data;

  const hasDateFilter = appliedFrom || appliedTo;

  function formatDisplayDate(dateStr: string) {
    return format(new Date(dateStr), "MMM dd, yyyy");
  }

  function getDisplayText() {
    if (appliedFrom && appliedTo) {
      return `${formatDisplayDate(appliedFrom)} – ${formatDisplayDate(appliedTo)}`;
    }
    if (appliedFrom) return `From ${formatDisplayDate(appliedFrom)}`;
    if (appliedTo) return `Until ${formatDisplayDate(appliedTo)}`;
    return "All time";
  }

  function onApply() {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setOpen(false);
  }

  function onClear() {
    setFromDate("");
    setToDate("");
    setAppliedFrom("");
    setAppliedTo("");
    setOpen(false);
  }

  const metricsData = [
    {
      label: "Balance",
      value: formatMoney(metrics?.balance ?? 0),
      className: "text-muted-foreground",
    },
    {
      label: "Total Deposited",
      value: formatMoney(metrics?.totalDeposited ?? 0),
      className: "text-success",
    },
    {
      label: "Total Withdrawn",
      value: formatMoney(metrics?.totalWithdrawn ?? 0),
      className: "text-destructive",
    },
    {
      label: "Total Charged",
      value: formatMoney(metrics?.totalCharged ?? 0),
      className: "text-foreground",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={hasDateFilter ? "secondary" : "outline"} size="sm">
              <CalendarIcon className="size-4" />
              <span className="max-w-56 truncate">{getDisplayText()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4" align="start">
            <div className="space-y-2">
              <Label htmlFor="metrics-from">From</Label>
              <Input
                id="metrics-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metrics-to">To</Label>
              <Input
                id="metrics-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClear}>
                Clear
              </Button>
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {hasDateFilter && (
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onClear}>
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid min-w-sm grid-cols-[repeat(auto-fill,minmax(16rem,auto))] gap-2 lg:grid-cols-4">
        {metricsData.map((metric) => (
          <Card key={metric.label} className="h-fit gap-2">
            <CardHeader>
              <div className="w-fit rounded-md border p-2">
                <Coins className={cn("text-muted-foreground size-5", metric.className)} />
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
              <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : metric.value}</Heading>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
