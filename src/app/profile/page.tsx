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
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Profil</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User card */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center lg:col-span-1">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Utilisateur</h2>
          <p className="text-sm text-muted">utilisateur@exemple.com</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted/10 px-3 py-1 text-xs font-medium text-muted">
            <Calendar className="h-3 w-3" />
            Membre depuis 2025
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Gratuit
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account info */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations du compte
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <div>
                  <p className="text-xs text-muted">Nom d&apos;utilisateur</p>
                  <p className="text-sm font-medium text-foreground">Utilisateur</p>
                </div>
                <button className="text-xs text-primary hover:underline">Modifier</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="text-sm font-medium text-foreground">utilisateur@exemple.com</p>
                </div>
                <button className="text-xs text-primary hover:underline">Modifier</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <div>
                  <p className="text-xs text-muted">Discord ID</p>
                  <p className="text-sm font-medium text-foreground">Non lié</p>
                </div>
                <button className="text-xs text-primary hover:underline">Lier</button>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Crown className="h-5 w-5 text-premium" />
              Abonnement
            </h3>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Plan Gratuit</p>
                <p className="text-xs text-muted">Bots limités, modules de base</p>
              </div>
              <a
                href="/pricing"
                className="rounded-lg bg-premium/10 px-3 py-1.5 text-xs font-semibold text-premium hover:bg-premium/20 transition-colors"
              >
                Passer Premium
              </a>
            </div>
          </div>

          {/* Bots */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Vos bots
            </h3>
            <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center">
              <Bot className="mx-auto h-10 w-10 text-muted/30" />
              <p className="mt-2 text-sm text-muted">Aucun bot pour le moment.</p>
              <a href="/dashboard" className="mt-2 inline-block text-xs text-primary hover:underline">
                Créer votre premier bot →
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground">
              <Settings className="h-5 w-5" />
              Paramètres
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground">
              <Bell className="h-5 w-5" />
              Notifications
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground">
              <CreditCard className="h-5 w-5" />
              Facturation
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger transition-colors hover:bg-danger/10">
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
