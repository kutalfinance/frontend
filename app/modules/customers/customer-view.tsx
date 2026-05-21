import { format } from "date-fns";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Calendar,
  CalendarCheck,
  Contact,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Paragraph } from "@/components/ui/text";

import type { Customer } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

export function ViewCustomer({
  customer,
  ...props
}: React.ComponentProps<typeof SheetTrigger> & { customer: Customer }) {
  return (
    <Sheet>
      <SheetTrigger asChild {...props} />
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <SheetTitle>{customer.name}</SheetTitle>
              <SheetDescription>{customer.accountNumber}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="container space-y-6">
          <Section title="Customer Details" icon={Contact}>
            <Field icon={Hash} label="Account Number" value={customer.accountNumber} mono />
            <Field icon={Phone} label="Phone Number" value={customer.phoneNumber} />
            <Field icon={Mail} label="Email" value={customer.email || "—"} />
            <Field icon={MapPin} label="Location" value={customer.location} />
            <Field icon={Building2} label="Branch" value={customer.branch.name} />
            <Field
              icon={Banknote}
              label="Contribution Amount"
              value={formatMoney(customer.contributionAmount)}
            />
          </Section>

          <Separator />

          <Section title="Contribution History" icon={CalendarCheck}>
            <Field
              icon={Calendar}
              label="Registration Date"
              value={
                customer.registrationDate
                  ? format(new Date(customer.registrationDate), "dd MMM yyyy")
                  : "—"
              }
            />
            <Field
              icon={Calendar}
              label="Contribution Start"
              value={
                customer.contributionStartDate
                  ? format(new Date(customer.contributionStartDate), "dd MMM yyyy")
                  : "—"
              }
            />
            <Field
              icon={CalendarCheck}
              label="Last Deposit"
              value={
                customer.lastDepositDate
                  ? format(new Date(customer.lastDepositDate), "dd MMM yyyy")
                  : "—"
              }
            />
            <Field
              icon={Calendar}
              label="Last Withdrawal"
              value={
                customer.lastWithdrawal
                  ? format(new Date(customer.lastWithdrawal), "dd MMM yyyy")
                  : "—"
              }
            />
            <div className="flex items-start gap-3">
              <BadgeCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div className="space-y-1">
                <Paragraph className="text-muted-foreground text-xs">Days Contributed</Paragraph>
                <Badge variant="secondary">{customer.daysContributed ?? 0} days</Badge>
              </div>
            </div>
          </Section>

          {customer.nextOfKin?.name && (
            <>
              <Separator />
              <Section title="Next of Kin" icon={User}>
                <Field icon={User} label="Name" value={customer.nextOfKin.name} />
                <Field icon={Phone} label="Phone Number" value={customer.nextOfKin.phoneNumber} />
                <Field icon={Mail} label="Email" value={customer.nextOfKin.email || "—"} />
              </Section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
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
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
      <div>
        <Paragraph className="text-muted-foreground text-xs">{label}</Paragraph>
        <Paragraph className={mono ? "font-mono text-sm" : "text-sm"}>{value}</Paragraph>
      </div>
    </div>
  );
}
