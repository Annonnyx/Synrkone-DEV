"use client";

import {
  User,
  Bot,
  Crown,
  Settings,
  Bell,
  CreditCard,
  LogOut,
  Mail,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Coins,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen">
      {/* Global background glow */}
      <div className="page-glow" />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-semibold text-white">Profil</h1>
          <p className="mt-2 text-white/50">Gérez votre compte et vos préférences.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User card - Left column */}
          <div className="card p-8 text-center lg:col-span-1 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
            
            <div className="relative">
              {/* Avatar with glow */}
              <div className="relative mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl" />
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 ring-2 ring-violet-500/20">
                  <User className="h-12 w-12" />
                </div>
              </div>
              
              <h2 className="font-display text-xl font-semibold text-white">Utilisateur</h2>
              <p className="text-sm text-white/40">utilisateur@exemple.com</p>
              
              {/* Member badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-sm text-white/60 border border-white/10">
                <Calendar className="h-4 w-4 text-amber-400" />
                Membre depuis 2025
              </div>
              
              {/* Plan badge */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="h-4 w-4" />
                  Gratuit
                </span>
              </div>
              
              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                  <div className="font-display text-xl font-bold text-violet-400">0</div>
                  <div className="text-xs text-white/40">Bots</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                  <div className="font-display text-xl font-bold text-amber-400">0</div>
                  <div className="text-xs text-white/40">Krônes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details - Right column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Account info */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <User className="h-4 w-4" />
                </div>
                Informations du compte
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Nom d&apos;utilisateur</p>
                    <p className="text-sm font-medium text-white">Utilisateur</p>
                  </div>
                  <button className="text-xs text-violet-400 hover:text-violet-300 font-medium">Modifier</button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-white">utilisateur@exemple.com</p>
                  </div>
                  <button className="text-xs text-violet-400 hover:text-violet-300 font-medium">Modifier</button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Discord</p>
                    <p className="text-sm font-medium text-white/60">Non lié</p>
                  </div>
                  <button className="text-xs text-violet-400 hover:text-violet-300 font-medium">Lier</button>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full" />
              
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Crown className="h-4 w-4" />
                </div>
                Abonnement
              </h3>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                <div>
                  <p className="font-medium text-white flex items-center gap-2">
                    Plan Gratuit
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                      Actif
                    </span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">Bots limités, modules de base</p>
                </div>
                <Link
                  href="/pricing"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  Passer Premium
                </Link>
              </div>
            </div>

            {/* Bots */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                  <Bot className="h-4 w-4" />
                </div>
                Vos bots
              </h3>
              <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 mb-3">
                  <Bot className="h-7 w-7 text-white/30" />
                </div>
                <p className="text-white/50">Aucun bot pour le moment.</p>
                <Link href="/dashboard" className="mt-3 inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                  Créer votre premier bot
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Settings className="h-4 w-4" />
                </div>
                Paramètres
              </button>
              <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Bell className="h-4 w-4" />
                </div>
                Notifications
              </button>
              <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                Facturation
              </button>
              <button className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 transition-colors hover:bg-red-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <LogOut className="h-4 w-4" />
                </div>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
