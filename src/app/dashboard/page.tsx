"use client";

import { useState } from "react";
import {
  Bot,
  Plus,
  Shield,
  Image,
  Users,
  Coins,
  Music,
  Ticket,
  MessageSquare,
  Crown,
  ExternalLink,
  Key,
  Zap,
  Activity,
  Server,
  UsersRound,
  Terminal,
  Clock,
  Cpu,
  Wifi,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Hash,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  premium: boolean;
  enabled: boolean;
  pointCost: number;
}

const defaultModules: Module[] = [
  { id: "autorole", name: "Auto-Rôles", description: "Attribue automatiquement des rôles à l'arrivée des membres.", icon: Users, premium: false, enabled: true, pointCost: 1 },
  { id: "generation", name: "Génération IA", description: "Génération d'images et de textes via l'IA.", icon: Image, premium: true, enabled: false, pointCost: 3 },
  { id: "moderation", name: "Modération", description: "Auto-mod, anti-spam, anti-raid, filtrage de contenu.", icon: Shield, premium: false, enabled: true, pointCost: 2 },
  { id: "economy", name: "Économie", description: "Système de monnaie, boutique, transactions entre membres.", icon: Coins, premium: true, enabled: false, pointCost: 3 },
  { id: "music", name: "Musique", description: "Lecture de musique depuis YouTube, Spotify et plus.", icon: Music, premium: false, enabled: false, pointCost: 2 },
  { id: "tickets", name: "Tickets", description: "Système de tickets de support avec catégories.", icon: Ticket, premium: false, enabled: true, pointCost: 1 },
  { id: "welcome", name: "Messages de bienvenue", description: "Messages personnalisés d'arrivée et de départ.", icon: MessageSquare, premium: false, enabled: false, pointCost: 1 },
  { id: "giveaway", name: "Giveaways", description: "Organisez des tirages au sort automatiques.", icon: Crown, premium: true, enabled: false, pointCost: 2 },
];

const mockStats = {
  servers: 12,
  users: 4820,
  commandsToday: 347,
  totalCommands: 12893,
  uptime: "99.7%",
  latency: "42ms",
  memory: "128 MB",
  cpu: "3.2%",
  messagesProcessed: 8421,
  errors: 2,
  lastRestart: "Il y a 3j 14h",
  topCommands: [
    { name: "/help", uses: 89 },
    { name: "/rank", uses: 64 },
    { name: "/ticket", uses: 51 },
    { name: "/autorole", uses: 38 },
    { name: "/mod warn", uses: 27 },
  ],
  dailyActivity: [12, 18, 25, 31, 45, 52, 48, 67, 82, 74, 58, 43],
};

export default function DashboardPage() {
  const [modules, setModules] = useState(defaultModules);
  const [botName, setBotName] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"setup" | "modules" | "stats">("setup");
  const [showToken, setShowToken] = useState(false);

  const totalPointsUsed = modules.filter((m) => m.enabled).reduce((sum, m) => sum + m.pointCost, 0);
  const maxPoints = 25;

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Créez et gérez votre bot Discord.</p>
        </div>
        <div className="flex gap-1.5 glass rounded-2xl p-1.5">
          <button
            onClick={() => setStep("setup")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              step === "setup" ? "bg-primary text-white shadow-lg shadow-primary-glow" : "text-muted hover:text-foreground"
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setStep("modules")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              step === "modules" ? "bg-primary text-white shadow-lg shadow-primary-glow" : "text-muted hover:text-foreground"
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => setStep("stats")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              step === "stats" ? "bg-primary text-white shadow-lg shadow-primary-glow" : "text-muted hover:text-foreground"
            }`}
          >
            Statistiques
          </button>
        </div>
      </div>

      {step === "setup" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bot creation form */}
          <div className="bento-item p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Créer un bot</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Nom du bot
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Mon Bot Synkrone"
                  className="w-full rounded-xl border border-glass-border bg-white/3 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Token du bot
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Collez votre token Discord ici"
                    className="w-full rounded-xl border border-glass-border bg-white/3 px-4 py-2.5 pr-20 text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-muted hover:text-foreground"
                  >
                    {showToken ? "Cacher" : "Voir"}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Obtenez votre token sur{" "}
                  <a
                    href="https://discord.com/developers/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Discord Developer Portal
                    <ExternalLink className="ml-0.5 inline h-3 w-3" />
                  </a>
                </p>
              </div>

              <div className="rounded-xl border border-glass-border bg-white/3 p-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Key className="h-4 w-4 text-warning" />
                  Options requises sur Discord Dev
                </h3>
                <ul className="mt-2 space-y-1 text-xs text-muted">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Activer les Intents : SERVER MEMBERS, MESSAGE CONTENT
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Activer l&apos;OAuth2 Bot scope
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Permissions : Administrator (recommandé)
                  </li>
                </ul>
              </div>

              <button className="btn-shiny w-full rounded-xl px-4 py-3 text-sm font-semibold text-white">
                <Zap className="mr-2 inline h-4 w-4" />
                Créer et démarrer le bot
              </button>
            </div>
          </div>

          {/* Or let us create it */}
          <div className="bento-item p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Nous créons le bot pour vous
              </h2>
            </div>

            <p className="text-sm text-muted mb-4">
              Pas envie de configurer le Discord Developer Portal ? Nous nous en
              occupons. Création du bot, configuration des intents et permissions,
              tout est pris en charge.
            </p>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Crown className="h-4 w-4" />
                Service payant — 4,99 €
              </div>
              <p className="mt-1 text-xs text-muted">
                Inclut la création du bot, la configuration complète et le premier
                mois d&apos;hébergement.
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {["Création de l'application Discord", "Configuration des intents", "Permissions optimisées", "Token livré sécurisé"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {item}
                  </div>
                )
              )}
            </div>

            <button className="w-full rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50">
              Commander la création
            </button>
          </div>

          {/* Existing bots */}
          <div className="bento-item p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Vos bots</h2>
              <button className="rounded-xl border border-glass-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-white/5 hover:text-foreground transition-all">
                + Nouveau bot
              </button>
            </div>
            <div className="rounded-xl border border-dashed border-glass-border p-8 text-center">
              <Bot className="mx-auto h-12 w-12 text-muted/30" />
              <p className="mt-3 text-sm text-muted">Aucun bot créé pour le moment.</p>
              <p className="text-xs text-muted/60">Configurez votre premier bot ci-dessus pour commencer.</p>
            </div>
          </div>
        </div>
      ) : step === "modules" ? (
        /* Modules view */
        <div id="modules">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Modules disponibles</h2>
              <p className="mt-1 text-sm text-muted">
                Activez les modules que vous souhaitez. Chaque module consomme des points.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" /> Gratuit
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-premium" /> Premium
              </span>
            </div>
          </div>

          {/* Points bar */}
          <div className="mb-6 bento-item p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Points de modules utilisés</span>
              <span className={`text-sm font-bold ${totalPointsUsed > maxPoints ? "text-danger" : "text-primary"}`}>
                {totalPointsUsed} / {maxPoints} pts
              </span>
            </div>
            <div className="h-3 rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalPointsUsed > maxPoints ? "bg-danger" : "bg-primary"
                }`}
                style={{ width: `${Math.min((totalPointsUsed / maxPoints) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Votre offre actuelle vous donne {maxPoints} pts de modules.{" "}
              <a href="/pricing" className="text-primary hover:underline">
                Augmenter votre offre →
              </a>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`bento-item group p-5 ${
                  mod.enabled ? "border-primary/30 glow-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        mod.enabled ? "bg-primary/20 text-primary" : "bg-card-hover text-muted"
                      }`}
                    >
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {mod.name}
                        {mod.premium && (
                          <span className="rounded-full bg-premium/10 px-2 py-0.5 text-[10px] font-bold text-premium">
                            PRO
                          </span>
                        )}
                      </h3>
                      <span className="text-[11px] text-muted">{mod.pointCost} pt{mod.pointCost > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      mod.enabled ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        mod.enabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted">{mod.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-muted">
              Total : <span className="font-semibold text-foreground">{totalPointsUsed} pts</span> utilisés sur {maxPoints}
            </span>
            <button className="btn-shiny rounded-xl px-6 py-2.5 text-sm font-semibold text-white">
              Sauvegarder la configuration
            </button>
          </div>
        </div>
      ) : (
        /* Stats view */
        <div id="stats">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Statistiques du bot</h2>
            <p className="mt-1 text-sm text-muted">
              Suivez en temps réel les performances et l&apos;activité de votre bot.
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              { label: "Serveurs", value: mockStats.servers.toString(), icon: Server, color: "text-primary" },
              { label: "Utilisateurs atteints", value: mockStats.users.toLocaleString(), icon: UsersRound, color: "text-accent" },
              { label: "Commandes aujourd&apos;hui", value: mockStats.commandsToday.toString(), icon: Terminal, color: "text-success" },
              { label: "Commandes totales", value: mockStats.totalCommands.toLocaleString(), icon: BarChart3, color: "text-premium" },
            ].map((metric) => (
              <div key={metric.label} className="bento-item p-5">
                <div className="flex items-center justify-between">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Performance metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              { label: "Uptime", value: mockStats.uptime, icon: Clock, status: "success" },
              { label: "Latence", value: mockStats.latency, icon: Wifi, status: "success" },
              { label: "Mémoire", value: mockStats.memory, icon: Cpu, status: "success" },
              { label: "CPU", value: mockStats.cpu, icon: Activity, status: "success" },
            ].map((perf) => (
              <div key={perf.label} className="bento-item p-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  perf.status === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                }`}>
                  <perf.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{perf.value}</p>
                  <p className="text-[11px] text-muted">{perf.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Activity chart (simplified) */}
            <div className="bento-item p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Activité horaire (dernières 12h)
              </h3>
              <div className="flex items-end gap-2 h-32">
                {mockStats.dailyActivity.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/60 hover:bg-primary transition-colors"
                      style={{ height: `${(val / 82) * 100}%` }}
                    />
                    <span className="text-[9px] text-muted">{(i + 8) % 24}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top commands */}
            <div className="bento-item p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                Commandes les plus utilisées
              </h3>
              <div className="space-y-3">
                {mockStats.topCommands.map((cmd, i) => (
                  <div key={cmd.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted w-4">#{i + 1}</span>
                    <code className="flex-1 text-sm text-foreground bg-white/3 rounded-lg px-2.5 py-1 border border-glass-border">
                      {cmd.name}
                    </code>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-primary/40" style={{ width: `${(cmd.uses / 89) * 80}px` }} />
                      <span className="text-xs text-muted w-8 text-right">{cmd.uses}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages & errors */}
            <div className="bento-item p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-accent" />
                Messages &amp; Erreurs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-glass-border bg-white/3 p-4 text-center">
                  <p className="text-xl font-bold text-foreground">{mockStats.messagesProcessed.toLocaleString()}</p>
                  <p className="text-xs text-muted">Messages traités</p>
                </div>
                <div className="rounded-xl border border-glass-border bg-white/3 p-4 text-center">
                  <p className={`text-xl font-bold ${mockStats.errors > 0 ? "text-warning" : "text-success"}`}>
                    {mockStats.errors}
                  </p>
                  <p className="text-xs text-muted">Erreurs (24h)</p>
                </div>
                <div className="rounded-xl border border-glass-border bg-white/3 p-4 text-center col-span-2">
                  <div className="flex items-center justify-center gap-2">
                    {mockStats.errors === 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <p className="text-sm text-foreground">
                      {mockStats.errors === 0 ? "Aucune erreur récente" : `${mockStats.errors} erreurs détectées`}
                    </p>
                  </div>
                  <p className="text-xs text-muted mt-1">Dernier redémarrage : {mockStats.lastRestart}</p>
                </div>
              </div>
            </div>

            {/* Server list */}
            <div className="bento-item p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Serveurs connectés
              </h3>
              <div className="space-y-2">
                {["Serveur Principal", "Communauté FR", "Test Bot"].map((server, i) => (
                  <div key={server} className="flex items-center justify-between rounded-xl border border-glass-border bg-white/3 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {server[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{server}</p>
                        <p className="text-[11px] text-muted">{[320, 1850, 5][i]} membres</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-[11px] text-success">En ligne</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
