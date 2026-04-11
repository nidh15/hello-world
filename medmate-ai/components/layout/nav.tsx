"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  Menu,
  X,
  MessageSquareHeart,
  ClipboardList,
  Video,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/chat", label: "AI Chat", icon: MessageSquareHeart },
  { href: "/symptom-checker", label: "Symptom checker", icon: ClipboardList },
  { href: "/telehealth", label: "Telehealth", icon: Video },
  { href: "/history", label: "History", icon: FileText },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-md shadow-ocean-500/25 transition-transform duration-200 group-hover:scale-105">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="flex items-baseline gap-0.5 font-display">
            MedMate{" "}
            <span className="bg-gradient-to-r from-ocean-500 to-ocean-400 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-ocean-50 text-ocean-700 shadow-sm dark:bg-ocean-900/30 dark:text-ocean-200"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden",
            open ? "bg-ocean-50 text-ocean-700" : "hover:bg-accent",
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="animate-fade-in border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-200"
                      : "hover:bg-accent",
                  )}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
