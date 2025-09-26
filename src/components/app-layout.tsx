import { Link, useLocation } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";

import { Coins, History, Menu, PanelLeft } from "lucide-react";
import { Contact, Home, Landmark, type LucideIcon, Users } from "lucide-react";

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

const adminNavLinks: {
  title: string;
  href: LinkProps["to"];
  pathRegex: RegExp;
  icon: LucideIcon;
}[] = [
  { title: "Dashboard", href: "/admin", pathRegex: /^\/admin$/, icon: Home },
  { title: "Branches", href: ".", pathRegex: /\/admin\/branches/, icon: Landmark },
  { title: "Customers", href: "/admin/customers", pathRegex: /\/admin\/customers/, icon: Contact },
  { title: "Contributions", href: ".", pathRegex: /\/admin\/contributions/, icon: Coins },
  { title: "Users", href: "/admin/users", pathRegex: /\/admin\/users/, icon: Users },
  { title: "Audit Trail", href: ".", pathRegex: /\/admin\/audit/, icon: History },
];

const agentNavLinks: {
  title: string;
  href: LinkProps["to"];
  pathRegex: RegExp;
  icon: LucideIcon;
}[] = [
  { title: "Dashboard", href: "/agent", pathRegex: /^\/agent$/, icon: Home },
  { title: "Branches", href: ".", pathRegex: /\/agent\/branches/, icon: Landmark },
  { title: "Customers", href: ".", pathRegex: /\/agent\/customers/, icon: Contact },
  { title: "Contributions", href: ".", pathRegex: /\/agent\/contributions/, icon: Coins },
];

export function getNavLinks(userRole: string) {
  return userRole === "ADMIN" ? adminNavLinks : agentNavLinks;
}

type AppLayoutContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const AppLayoutContext = createContext<AppLayoutContextType>({} as AppLayoutContextType);

function useAppLayoutContext() {
  const context = useContext(AppLayoutContext);
  if (context === undefined) {
    throw new Error("useAppLayoutContext must be used within a AppLayoutProvider");
  }
  return context;
}

export function AppLayoutProvider({ children, ...props }: React.ComponentProps<"div">) {
  const [open, setOpen] = useState(false);

  return (
    <AppLayoutContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </AppLayoutContext.Provider>
  );
}

export function AppHeader() {
  const { setOpen } = useAppLayoutContext();

  return (
    <div className="border-b">
      <header className="container flex min-h-16 items-center gap-10 px-4">
        <Button
          variant="ghost"
          onClick={() => setOpen((open) => !open)}
          className="hidden lg:inline-flex"
        >
          <PanelLeft />
        </Button>

        <div className="lg:hidden">
          <AppLogo />
        </div>

        <div className="hidden lg:contents">
          <UserMenu />
        </div>

        <Sheet>
          <SheetTrigger asChild className="ml-auto lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />

              <MobileNavigation />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { open } = useAppLayoutContext();
  const { data } = useLoggedInUser();

  const navLinks = getNavLinks(data?.data?.role || "");

  return (
    <div className={cn("hidden w-60 shrink-0 border-r p-4 lg:block", !open && "w-fit")}>
      <nav className="flex flex-col gap-2">
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
            {open && <Paragraph className="leading-4">{link.title}</Paragraph>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function MobileNavigation() {
  const { pathname } = useLocation();
  const { data } = useLoggedInUser();

  const navLinks = getNavLinks(data?.data?.role || "");

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

  return (
    <div className="ml-auto flex items-center gap-4">
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
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout.mutate()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
