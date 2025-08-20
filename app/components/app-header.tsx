import { NavLink, useLocation } from "react-router";

import { Menu, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

import { AppLogo } from "./app-logo";
import { Button } from "./ui/button";
import { Paragraph } from "./ui/text";

export function AppHeader() {
  return (
    <div className="border-b">
      <header className="container flex min-h-16 items-center gap-10">
        <AppLogo />

        <div className="hidden lg:contents">
          <nav className="flex gap-7">
            {navLinks.map((link) => (
              <NavLinkItem key={link.title} to={link.href} link={link} />
            ))}
          </nav>

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

              <nav className="flex flex-col gap-4 py-10 text-lg">
                {navLinks.map((link) => (
                  <SheetClose asChild>
                    <NavLinkItem to={link.href} key={link.title} link={link} />
                  </SheetClose>
                ))}
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}

function UserMenu() {
  return (
    <div className="ml-auto flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <Settings />
      </Button>
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
    </div>
  );
}

function NavLinkItem({
  link,
  ...props
}: React.ComponentProps<typeof NavLink> & { link: (typeof navLinks)[0] }) {
  const { pathname } = useLocation();

  return (
    <NavLink
      viewTransition
      className={cn(
        "text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md p-2 transition-colors",
        link.pathRegex.test(pathname) && "text-primary"
      )}
      title={link.title}
      {...props}
    >
      <Paragraph className="leading-4">{link.title}</Paragraph>
    </NavLink>
  );
}

export const navLinks = [
  { title: "Home", href: "/", pathRegex: /\/$/ },
  { title: "Dashboard", href: "#", pathRegex: /\/dashboard/ },
  { title: "Branches", href: "#", pathRegex: /\/branches/ },
  { title: "Customers", href: "#", pathRegex: /\/customers/ },
  { title: "Users", href: "/users", pathRegex: /\/users/ },
];
