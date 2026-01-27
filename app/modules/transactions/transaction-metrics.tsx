import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { transactionsMetricsOptions } from "@/hooks/data/transactions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";

export function TransactionMetrics({ customerId }: { customerId?: string }) {
  const { data, isPending } = useQuery(
    transactionsMetricsOptions({ searchParams: { customerId } })
  );
  const metrics = data?.data;

  const metricsData = [
    {
      icon: Coins,
      label: "Balance",
      value: formatMoney(metrics?.balance ?? 0),
      className: "text-muted-foreground",
    },
    {
      icon: Coins,
      label: "Total Deposited",
      value: formatMoney(metrics?.totalDeposited ?? 0),
      className: "text-success",
    },
    {
      icon: Coins,
      label: "Total Withdrawn",
      value: formatMoney((metrics?.totalWithdrawn ?? 0) * 100000),
      className: "text-destructive",
    },
    {
      icon: Coins,
      label: "Total Charged",
      value: formatMoney(metrics?.totalCharged ?? 0),
      className: "text-foreground",
    },
  ];

  return (
    <div className="grid min-w-sm grid-cols-[repeat(auto-fill,minmax(16rem,auto))] gap-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <Card key={metric.label} className="h-fit gap-2">
          <CardHeader>
            <div className="w-fit rounded-md border p-2">
              <metric.icon className={cn("text-muted-foreground size-5", metric.className)} />
            </div>
          </CardHeader>
          <CardContent>
            <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
            <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : metric.value}</Heading>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
