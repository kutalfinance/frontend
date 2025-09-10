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

const navLinks = [
  { title: "Home", href: "", pathRegex: /\/(u|a)\/$/ },
  { title: "Branches", href: "#", pathRegex: /\/branches/ },
  { title: "Customers", href: "customers", pathRegex: /\/customers/ },
  { title: "Users", href: "users", pathRegex: /\/users/ },
];

export function AppHeader() {
  const { pathname } = useLocation();

  return (
    <div className="border-b">
      <header className="container flex min-h-16 items-center gap-10">
        <AppLogo />

        <div className="hidden lg:contents">
          <nav className="flex gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.href}
                className={cn(
                  "text-muted-foreground hover:text-primary flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                  link.pathRegex.test(pathname) && "text-primary bg-muted"
                )}
                title={link.title}
              >
                <Paragraph className="leading-4">{link.title}</Paragraph>
              </NavLink>
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

              <nav className="flex flex-col gap-2 py-10">
                {navLinks.map((link) => (
                  <SheetClose key={link.title} asChild>
                    <NavLink
                      viewTransition
                      to={link.href}
                      className={cn(
                        "text-muted-foreground hover:text-primary flex items-center gap-1.5 rounded-md px-3 py-4 text-lg transition-colors",
                        link.pathRegex.test(pathname) && "text-primary bg-muted"
                      )}
                      title={link.title}
                    >
                      <Paragraph className="leading-4">{link.title}</Paragraph>
                    </NavLink>
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
