import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { contributionsMetricsOptions } from "@/hooks/data/contributions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";

export function ContributionMetrics({ customerId }: { customerId?: string }) {
  const { data, isPending } = useQuery(
    contributionsMetricsOptions({ searchParams: { customerId } })
  );
  const metrics = data?.data;

  const metricsData = [
    {
      icon: Coins,
      label: "Net Contributions",
      value: formatMoney(metrics?.net ?? 0),
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
      value: formatMoney(metrics?.totalWithdrawn ?? 0),
      className: "text-destructive",
    },
  ];

  return (
    <div className="grid min-w-sm grid-cols-[repeat(auto-fill,minmax(16rem,auto))] gap-2 lg:grid-cols-3">
      {metricsData.map((metric) => (
        <Card key={metric.label} className="h-fit gap-2">
          <CardContent>
            <div className="flex items-center gap-1.5">
              <metric.icon className={cn("size-4", metric.className)} />
              <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
            </div>
            <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : metric.value}</Heading>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
