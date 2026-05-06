"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Bot,
  Crown,
  Settings,
  LogOut,
  Mail,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Coins,
  ChevronRight,
  RefreshCw,
  MessageCircle,
  Crown as CrownIcon,
  UserCheck,
  Hash,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface DiscordRole {
  id: string;
  name: string;
  siteRole: string;
}

interface DiscordInfo {
  discordRoles: DiscordRole[];
  currentSiteRole: string;
  computedSiteRole: string;
  isOnSynkroneServer: boolean;
}

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  OWNER: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  ADMIN: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  DEV:   { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
  USER:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [discordInfo, setDiscordInfo] = useState<DiscordInfo | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const user = session?.user;

  const loadDiscordRoles = async () => {
    setLoadingRoles(true);
    setRolesError(null);
    try {
      const res = await fetch("/api/discord/roles");
      if (res.ok) {
        setDiscordInfo(await res.json());
      } else {
        const err = await res.json().catch(() => ({}));
        setRolesError(err.error || `Erreur ${res.status}`);
      }
    } catch (err) {
      console.error("Erreur chargement rôles Discord:", err);
      setRolesError("Impossible de contacter le serveur");
    } finally {
      setLoadingRoles(false);
    }
  };

  const syncRoles = async () => {
    setLoadingRoles(true);
    setRolesError(null);
    try {
      const res = await fetch("/api/discord/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDiscordInfo(data);
        // Recharger la page pour mettre à jour la session
        window.location.reload();
      } else {
        const err = await res.json().catch(() => ({}));
        setRolesError(err.error || `Erreur ${res.status}`);
      }
    } catch (err) {
      console.error("Erreur sync rôles:", err);
      setRolesError("Impossible de synchroniser");
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadDiscordRoles();
    }
  }, [status]);

  const roleColor = roleColors[user?.role ?? "USER"] ?? roleColors.USER;

  return (
    <div className="relative min-h-screen">
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
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />

            <div className="relative">
              {/* Avatar */}
              <div className="relative mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl" />
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? "Avatar"}
                    className="relative mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-violet-500/20"
                  />
                ) : (
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 ring-2 ring-violet-500/20">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>

              <h2 className="font-display text-xl font-semibold text-white">
                {user?.name ?? "Utilisateur"}
              </h2>
              <p className="text-sm text-white/40">{user?.email ?? "—"}</p>

              {/* Site role badge */}
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full ${roleColor.bg} px-4 py-1.5 text-sm font-medium ${roleColor.text} border ${roleColor.border}`}>
                  <CrownIcon className="h-3.5 w-3.5" />
                  {user?.role ?? "USER"}
                </span>
              </div>

              {/* Discord status */}
              {user?.discordId ? (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#5865F2]/10 px-4 py-1.5 text-sm text-[#5865F2] border border-[#5865F2]/20">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discord lié
                </div>
              ) : (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-sm text-white/40 border border-white/10">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discord non synchronisé
                </div>
              )}

              {/* Member since */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-sm text-white/60 border border-white/10">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                Membre depuis 2025
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
                    <p className="text-sm font-medium text-white">{user?.name ?? "—"}</p>
                  </div>
                  <span className="text-xs text-white/30">Discord</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-white">{user?.email ?? "—"}</p>
                  </div>
                  <span className="text-xs text-white/30">Discord</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Discord</p>
                      <p className="text-sm font-medium text-white">
                        {user?.discordId ? (
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                            Lié ({user.discordId})
                          </span>
                        ) : (
                          "Non lié"
                        )}
                      </p>
                    </div>
                  </div>
                  {user?.discordId && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                      Connecté
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Discord Roles */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5865F2]/10 text-[#5865F2]">
                    <Shield className="h-4 w-4" />
                  </div>
                  Rôles Discord
                </h3>
                <button
                  onClick={syncRoles}
                  disabled={loadingRoles}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingRoles ? "animate-spin" : ""}`} />
                  Actualiser
                </button>
              </div>

              {loadingRoles && !discordInfo ? (
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des rôles...
                </div>
              ) : rolesError ? (
                <div className="text-sm text-white/50 space-y-2">
                  <p className="text-amber-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Impossible de vérifier les rôles : {rolesError}
                  </p>
                  <button
                    onClick={loadDiscordRoles}
                    className="text-xs text-violet-400 hover:text-violet-300 underline"
                  >
                    Réessayer
                  </button>
                </div>
              ) : discordInfo?.isOnSynkroneServer ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 border border-emerald-500/20">
                      <UserCheck className="h-3 w-3" />
                      Membre du serveur Synkrone
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {discordInfo.discordRoles.length > 0 ? (
                      discordInfo.discordRoles.map((role) => {
                        const rc = roleColors[role.siteRole] ?? roleColors.USER;
                        return (
                          <span
                            key={role.id}
                            className={`inline-flex items-center gap-1 rounded-full ${rc.bg} px-3 py-1 text-xs ${rc.text} border ${rc.border}`}
                          >
                            <Hash className="h-3 w-3" />
                            {role.name}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-sm text-white/40">Aucun rôle mappé sur le serveur.</span>
                    )}
                  </div>
                  <p className="text-xs text-white/30">
                    Rôle site calculé : <span className={`font-medium ${roleColors[discordInfo.computedSiteRole]?.text ?? "text-white"}`}>{discordInfo.computedSiteRole}</span>
                    {discordInfo.currentSiteRole !== discordInfo.computedSiteRole && (
                      <span className="text-amber-400"> (sera mis à jour au prochain sync)</span>
                    )}
                  </p>
                </div>
              ) : discordInfo ? (
                <div className="text-sm text-white/50 space-y-2">
                  <p className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-white/30" />
                    Vous n&apos;êtes pas membre du serveur Discord Synkrone.
                  </p>
                  <a
                    href="https://discord.gg/p768u2Pgp3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#5865F2] hover:underline"
                  >
                    Rejoindre le serveur
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <div className="text-sm text-white/50">
                  <p>Cliquez sur &quot;Actualiser&quot; pour vérifier vos rôles Discord.</p>
                </div>
              )}
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
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Zap className="h-4 w-4" />
                </div>
                Dashboard
              </Link>
              {["DEV", "ADMIN", "OWNER"].includes(session?.user?.role || "") && (
                <Link
                  href="/dashboard/boxes"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Settings className="h-4 w-4" />
                  </div>
                  Ma Box
                </Link>
              )}
              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Coins className="h-4 w-4" />
                </div>
                Krônes
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
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
