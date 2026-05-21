import { Link, type LinkProps, href, useLocation } from "react-router";

import { Building2, CheckCircle, History, Home, Menu, Users } from "lucide-react";
import { Contact, type LucideIcon } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Paragraph } from "@/components/ui/text";

import { useLoggedInUser, useLogout } from "@/hooks/auth/common";
import { cn } from "@/lib/utils";
import { DownloadAdminReport, DownloadAgentSelfReport } from "@/modules/users/user-actions";

import { DialogTrigger } from "./ui/dialog";

export function AppLayoutProvider({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      <AppHeader />

      {children}

      <footer className="border-t">
        <div className="text-muted-foreground container py-4 text-center text-sm">
          &copy; {new Date().getFullYear()} <AppLogo />. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function AppHeader() {
  const { pathname } = useLocation();
  const { data } = useLoggedInUser();

  const navLinks = getNavLinks(data?.data?.role || "");

  return (
    <div className="border-b">
      <header className="container flex min-h-16 items-center justify-between gap-10">
        <Sheet>
          <SheetTrigger asChild className={cn("lg:hidden", !navLinks.length && "hidden")}>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />

              <MobileNavigation navLinks={navLinks} />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-10">
          <AppLogo />

          <nav className="hidden gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className={cn(
                  "text-muted-foreground hover:text-primary flex items-center gap-2 rounded-md px-3 py-3 text-sm transition-colors",
                  link.pathRegex.test(pathname) && "text-primary bg-accent"
                )}
                title={link.title}
              >
                <link.icon className="size-4" />
                <Paragraph className="leading-4">{link.title}</Paragraph>
              </Link>
            ))}
          </nav>
        </div>

        <UserMenu />
      </header>
    </div>
  );
}

function MobileNavigation({ navLinks }: { navLinks: ReturnType<typeof getNavLinks> }) {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col gap-2 py-10">
      {navLinks.map((link) => (
        <SheetClose key={link.title} asChild>
          <Link
            to={link.href}
            className={cn(
              "text-muted-foreground hover:text-primary flex items-center gap-2.5 rounded-md px-3 py-4 transition-colors",
              link.pathRegex.test(pathname) && "text-primary bg-muted"
            )}
            title={link.title}
          >
            <link.icon className="size-5" />
            <Paragraph className="text-lg leading-4">{link.title}</Paragraph>
          </Link>
        </SheetClose>
      ))}
    </nav>
  );
}

function UserMenu() {
  const { data } = useLoggedInUser();
  const logout = useLogout();
  const user = data?.data;

  if (!user) return null;

  const isApprover = user.approver;
  const isAdmin = user.role == "ADMIN";

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground text-xs">{user.email}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isApprover && (
          <DropdownMenuItem asChild>
            <Link to={href("/admin/pending-approvals")}>Pending approvals</Link>
          </DropdownMenuItem>
        )}
        <DialogTrigger asChild>
          <DropdownMenuItem>Download report</DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem asChild>
          <Link to="/guide">User guide</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex items-center gap-4">
      {isApprover && (
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link to={href("/admin/pending-approvals")}>
            <CheckCircle className="size-4" />
            <span className="hidden sm:inline">Approvals</span>
          </Link>
        </Button>
      )}

      {isAdmin ? (
        <DownloadAdminReport>{dropdownMenu}</DownloadAdminReport>
      ) : (
        <DownloadAgentSelfReport user={user}>{dropdownMenu}</DownloadAgentSelfReport>
      )}
    </div>
  );
}

const adminNavLinks: {
  title: string;
  href: LinkProps["to"];
  pathRegex: RegExp;
  icon: LucideIcon;
}[] = [
    {
      title: "Home",
      href: href("/admin"),
      pathRegex: /^\/admin$/,
      icon: Home,
    },
    {
      title: "Branches",
      href: href("/admin/branches"),
      pathRegex: /\/admin\/branches/,
      icon: Building2,
    },
    {
      title: "Customers",
      href: href("/admin/customers"),
      pathRegex: /\/admin\/customers/,
      icon: Contact,
    },
    {
      title: "Users",
      href: href("/admin/users"),
      pathRegex: /\/admin\/users/,
      icon: Users,
    },
    {
      title: "Audit Logs",
      href: href("/admin/audit"),
      pathRegex: /\/admin\/audit/,
      icon: History,
    },
  ];

export function getNavLinks(userRole: string) {
  return userRole === "ADMIN" ? adminNavLinks : [];
}
