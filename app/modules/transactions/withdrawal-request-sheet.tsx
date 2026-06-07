import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  User,
} from "lucide-react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Paragraph } from "@/components/ui/text";

import { customerByIdQueryOptions } from "@/hooks/data/customers";
import type { Customer, Transaction } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

import { ApproveTransaction, RejectTransaction } from "./approval-actions";


export function WithdrawalRequestSheet({
  transaction,
  ...props
}: React.ComponentProps<typeof SheetTrigger> & { transaction: Transaction }) {
  return (
    <Sheet>
      <SheetTrigger asChild {...props} />
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Withdrawal Request</SheetTitle>
          <SheetDescription>
            Requested on {format(new Date(transaction.createdAt), "MMM dd, yyyy 'at' h:mm a")} by{" "}
            {transaction.recordedBy.name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <CustomerDetails transaction={transaction} />
        </div>

        <SheetFooter className="flex-row gap-2 border-t pt-4">
          <RejectTransaction transaction={transaction}>
            <Button variant="destructive" className="flex-1">
              <X />
              Reject
            </Button>
          </RejectTransaction>
          <ApproveTransaction transaction={transaction}>
            <Button className="flex-1">
              <Check />
              Approve
            </Button>
          </ApproveTransaction>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CustomerDetails({ transaction }: { transaction: Transaction }) {
  const { data, isPending } = useQuery(customerByIdQueryOptions(transaction.customer.id));
  const customer = data?.data;

  if (isPending) {
    return (
      <div className="container space-y-4 py-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!customer) return null;

  const serviceCharge = transaction.serviceChargeAmount ?? 0;
  const netPayout = transaction.amount - serviceCharge;
  const serviceChargePeriods = transaction.serviceChargePeriods ?? 0;

  return (
    <div className="container space-y-6 py-4">
      {/* Customer identity */}
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-muted-foreground font-mono text-sm">{customer.accountNumber}</p>
        </div>
      </div>

      <Separator />

      {/* Contact & branch */}
      <Section title="Customer Details" icon={User}>
        <Field icon={Phone} label="Phone" value={customer.phoneNumber} />
        <Field icon={Mail} label="Email" value={customer.email || "—"} />
        <Field icon={MapPin} label="Location" value={customer.location} />
        <Field icon={Building2} label="Branch" value={customer.branch.name} />
      </Section>

      <Separator />

      {/* Contribution info */}
      <Section title="Contribution" icon={CalendarIcon}>
        <Field
          icon={Banknote}
          label="Daily Amount"
          value={formatMoney(customer.contributionAmount)}
        />
        <div className="flex items-start gap-3">
          <BadgeCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <div>
            <Paragraph className="text-muted-foreground text-xs">Days Contributed</Paragraph>
            <Paragraph className="text-sm">{customer.daysContributed} days</Paragraph>
          </div>
        </div>
      </Section>

      <Separator />

      {/* Financial breakdown */}
      <Section title="Withdrawal Breakdown" icon={ReceiptText}>
        <div className="bg-muted/50 space-y-2 rounded-lg p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Withdrawal Amount</span>
            <span className="font-medium">{formatMoney(transaction.amount)}</span>
          </div>
          <div className="text-destructive flex justify-between">
            <span>
              Service Charge{" "}
              <span className="text-muted-foreground font-normal">
                ({serviceChargePeriods} {serviceChargePeriods === 1 ? "period" : "periods"})
              </span>
            </span>
            <span>− {formatMoney(serviceCharge)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Net Payout</span>
            <span>{formatMoney(netPayout)}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function CalendarIcon(props: React.ComponentProps<typeof Calendar>) {
  return <Calendar {...props} />;
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground size-4" />
        <Paragraph className="text-sm font-medium">{title}</Paragraph>
      </div>
      <div className="space-y-3 pl-1">{children}</div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
      <div>
        <Paragraph className="text-muted-foreground text-xs">{label}</Paragraph>
        <Paragraph className="text-sm">{value}</Paragraph>
      </div>
    </div>
  );
}
