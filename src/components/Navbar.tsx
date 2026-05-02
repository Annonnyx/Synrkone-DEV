"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projets" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/website-creator", label: "Créateur Web" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Animated gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      <div className="glass border-b-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary transition-all group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary-glow">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Synkrone
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3.5 py-2 text-[13px] font-medium text-muted transition-all hover:text-foreground hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/profile"
              className="rounded-xl px-4 py-2 text-[13px] font-medium text-muted transition-all hover:text-foreground hover:bg-white/5"
            >
              Profil
            </Link>
            <Link
              href="/dashboard"
              className="btn-shiny rounded-xl px-5 py-2 text-[13px] font-semibold text-white"
            >
              Lancer
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-muted transition-all hover:text-foreground hover:bg-white/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-glass-border px-4 pb-4 pt-2 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-all hover:text-foreground hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-glass-border pt-3">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-all hover:text-foreground hover:bg-white/5"
              >
                Profil
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-shiny rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Lancer le Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
