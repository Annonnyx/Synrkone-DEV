"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Zap, HardDrive, Shield, LogOut } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projets" },
  { href: "/pricing", label: "Krônes" },
  { href: "/minecraft", label: "Minecraft" },
  { href: "/discord", label: "Discord" },
  { href: "/multivers", label: "Multivers" },
  { href: "/team", label: "Équipe" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const userRole = session?.user?.role ?? "USER";
  const isAuthenticated = status === "authenticated";

  // Liens spéciaux par rôle
  const roleLinks = [];

  if (userRole === "DEV" || userRole === "ADMIN" || userRole === "OWNER") {
    roleLinks.push({ href: "/my-box", label: "Ma Box", icon: HardDrive });
  }

  if (userRole === "ADMIN" || userRole === "OWNER") {
    roleLinks.push({ href: "/boxes", label: "Boxes", icon: Shield });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
      
      <div className="border-b border-white/5 bg-[#0c0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-400 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold text-white">
              Synkrone
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-[#a79eb5] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {/* Role-specific links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-[#a79eb5] transition-colors hover:text-white flex items-center gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-lg px-4 py-2 text-sm text-[#a79eb5] transition-colors hover:text-white"
                >
                  Profil
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg px-3 py-2 text-sm text-red-400/70 transition-colors hover:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-[#a79eb5] transition-colors hover:text-white hover:bg-white/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/5 px-6 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-[#a79eb5] transition-colors hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile role links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#a79eb5] transition-colors hover:text-white hover:bg-white/5"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-[#a79eb5] transition-colors hover:text-white hover:bg-white/5"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => { setOpen(false); signOut(); }}
                    className="flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-violet-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
