"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  HelpCircle,
  Copy,
  Check,
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileCode,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Box,
} from "lucide-react";

// Mapping des icônes Lucide par nom
const iconMap: Record<string, React.ElementType> = {
  Users, Image, Shield, Coins, Music, Ticket, MessageSquare, Crown,
  Bot, Zap, Activity, Server, UsersRound, Terminal, Clock, Cpu, Wifi,
  BarChart3, MessageCircle, Hash, AlertTriangle, CheckCircle2, XCircle,
  ChevronDown, HelpCircle, Copy, Check,
};

interface ModuleDef {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  icon: string;
  premium: boolean;
  enabled: boolean;
  category: string;
  pointCost: number;
}

interface ModuleInstance {
  id: string;
  enabled: boolean;
  module: ModuleDef;
}

interface BotData {
  id: string;
  name: string;
  token?: string;
  hosting: string;
  status: string;
  maxKr: number;
  usedKr: number;
  modules: ModuleInstance[];
  stats?: BotStats;
}

interface BotStats {
  servers: number;
  users: number;
  commandsToday: number;
  totalCommands: number;
  uptime: string;
  latency: string;
  memory: string;
  cpu: string;
  messagesProcessed: number;
  errors: number;
  lastRestart: string;
  topCommands: { name: string; uses: number }[];
  dailyActivity: number[];
}

type HostingOption = "synkrone" | "self";

type DashboardStep = "setup" | "modules" | "stats" | "files" | "boxes";

interface FileEntry {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: string;
  location: string;
  createdAt: string;
  uploaderId: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bot, setBot] = useState<BotData | null>(null);
  const [modules, setModules] = useState<ModuleInstance[]>([]);
  const [availableModules, setAvailableModules] = useState<ModuleDef[]>([]);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [botName, setBotName] = useState("");
  const [token, setToken] = useState("");
  const [prefix, setPrefix] = useState("!");
  const [useSlashCommands, setUseSlashCommands] = useState(false);
  const [step, setStep] = useState<DashboardStep>("setup");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [hosting, setHosting] = useState<HostingOption>("synkrone");
  const [showTokenGuide, setShowTokenGuide] = useState(false);

  const totalKrUsed = bot?.usedKr || 0;
  const maxKr = bot?.maxKr || 30;

  // Vérifier l'auth et charger les données au montage
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadData();
  }, [status, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger le bot et ses modules
      const botRes = await fetch("/api/bot");
      if (botRes.ok) {
        const botData = await botRes.json();
        if (botData) {
          setBot(botData);
          setBotName(botData.name);
          setModules(botData.modules || []);
          setStats(botData.stats || null);
          setHosting(botData.hosting as HostingOption);
          setPrefix(botData.prefix || "!");
          setUseSlashCommands(botData.useSlashCommands || false);
        }
      }

      // Charger les modules disponibles
      const modsRes = await fetch("/api/modules");
      if (modsRes.ok) {
        setAvailableModules(await modsRes.json());
      }
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (instanceId: string, newEnabled: boolean) => {
    try {
      const res = await fetch("/api/bot/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleInstanceId: instanceId, enabled: newEnabled }),
      });

      if (res.ok) {
        // Mettre à jour localement
        setModules((prev) =>
          prev.map((m) => (m.id === instanceId ? { ...m, enabled: newEnabled } : m))
        );
        // Recharger le bot pour avoir les Krônes à jour
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur lors de l'activation du module");
      }
    } catch (err) {
      console.error("Erreur toggle module:", err);
    }
  };

  const saveBot = async () => {
    setSaving(true);
    try {
      const method = bot ? "PATCH" : "POST";
      const res = await fetch("/api/bot", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: botName, token, hosting, prefix, useSlashCommands }),
      });

      if (res.ok) {
        const saved = await res.json();
        setBot(saved);
        if (!bot) {
          // Premier créé, passer aux modules
          setStep("modules");
          loadData();
        }
      }
    } catch (err) {
      console.error("Erreur sauvegarde bot:", err);
    } finally {
      setSaving(false);
    }
  };

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/files?location=PROJECT");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Erreur chargement fichiers:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", "PROJECT");
      const res = await fetch("/api/files", { method: "POST", body: formData });
      if (res.ok) loadFiles();
    } catch (err) {
      console.error("Erreur upload:", err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    try {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) loadFiles();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.startsWith("text/") || mimeType.includes("json") || mimeType.includes("xml")) return FileText;
    if (mimeType.includes("javascript") || mimeType.includes("typescript")) return FileCode;
    return File;
  };

  const formatSize = (bytes: string | number) => {
    const b = Number(bytes);
    if (b < 1024) return `${b} o`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
    return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">Créez et gérez votre bot Discord.</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setStep("setup")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              step === "setup" ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setStep("modules")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              step === "modules" ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => setStep("stats")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              step === "stats" ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Statistiques
          </button>
          <button
            onClick={() => { setStep("files"); loadFiles(); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              step === "files" ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Fichiers
          </button>
          {["DEV", "ADMIN", "OWNER"].includes(session?.user?.role || "") && (
            <button
              onClick={() => setStep("boxes")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                step === "boxes" ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Box className="mr-1.5 inline h-3.5 w-3.5" />
              Boxes
            </button>
          )}
        </div>
      </div>

      {step === "setup" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bot creation form */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">Créer un bot</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Mon Projet Synkrone"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Token du bot
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Collez votre token Discord ici"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-20 text-sm text-white placeholder:text-white/60/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white/60 hover:text-white"
                  >
                    {showToken ? "Cacher" : "Voir"}
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => setShowTokenGuide(!showTokenGuide)}
                    className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    Comment récupérer mon TOKEN ?
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showTokenGuide ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Prefix selection */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Préfixe de commande
                </label>
                <div className="flex flex-wrap gap-2">
                  {["!", "?", "&", ".", ",", "-", "+", "~", "$", "%", "#", "@", ";", ":", "*"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrefix(p)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold transition-all ${
                        prefix === p
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                          : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/50">
                  Les commandes seront accessibles via <code className="text-violet-400">{prefix}commande</code>
                </p>
              </div>

              {/* Slash commands toggle */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-violet-400" />
                      /Commandes Discord
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      Active les slash commands natives de Discord
                    </p>
                  </div>
                  <button
                    onClick={() => setUseSlashCommands(!useSlashCommands)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useSlashCommands ? "bg-violet-600" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useSlashCommands ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {useSlashCommands && (
                  <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5">
                    <p className="text-xs text-amber-200/80">
                      Option réservée aux offres payantes. Les /commandes nécessitent un plan Premium.
                    </p>
                  </div>
                )}
              </div>

              {/* Token Guide Accordion */}
              {showTokenGuide && (
                <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent p-4 animate-fade-up">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                      <Key className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm font-medium text-white">Récupérer votre token</h3>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">1</span>
                      <div className="text-white/60">
                        <span className="text-white font-medium">Créer l&apos;app</span> —{" "}
                        <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-0.5">
                          Developer Portal <ExternalLink className="h-3 w-3" />
                        </a>
                        , cliquez <span className="text-white/80">New Application</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">2</span>
                      <div className="text-white/60">
                        <span className="text-white font-medium">Intents</span> — Onglet{" "}
                        <span className="text-white/80">Bot</span>, activez{" "}
                        <span className="text-emerald-400">Presence + Members + Message Content</span>.{" "}
                        <span className="text-amber-400">⚠️ Save Changes</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">3</span>
                      <div className="text-white/60">
                        <span className="text-white font-medium">Inviter</span> —{" "}
                        <span className="text-white/80">OAuth2 → URL Generator</span>, cochez{" "}
                        <span className="text-white/80">bot</span> +{" "}
                        <span className="text-violet-400 font-medium">Administrator</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">4</span>
                      <div className="text-white/60">
                        <span className="text-white font-medium">Token</span> — Onglet{" "}
                        <span className="text-white/80">Bot</span>, cliquez{" "}
                        <span className="text-white/80">Reset Token → Copy</span>.{" "}
                        <span className="text-amber-400">Ne partagez jamais !</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hosting option */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white mb-4">Option d&apos;hébergement</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Synkrone hosting */}
                  <button
                    onClick={() => setHosting("synkrone")}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      hosting === "synkrone"
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Synkrone</span>
                      {hosting === "synkrone" && (
                        <span className="flex h-2 w-2 rounded-full bg-violet-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/50">Inclus dans l&apos;abonnement</p>
                    <p className="text-xs text-violet-400 mt-1">Hébergement cloud + support</p>
                  </button>

                  {/* Self hosting */}
                  <button
                    onClick={() => setHosting("self")}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      hosting === "self"
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Auto-hébergé</span>
                      {hosting === "self" && (
                        <span className="flex h-2 w-2 rounded-full bg-violet-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/50">Paiement unique</p>
                    <p className="text-xs text-violet-400 mt-1">29,99 € une fois</p>
                  </button>
                </div>

                {hosting === "self" && (
                  <div className="mt-3 rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
                    <p className="text-xs text-amber-200/80">
                      Vous recevrez le code source complet et les instructions pour héberger vous-même sur votre serveur.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-violet-400" />
                  Options requises sur Discord Dev
                </h3>
                <ul className="mt-2 space-y-1 text-xs text-white/50">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    Activer les Intents : SERVER MEMBERS, MESSAGE CONTENT
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    Activer l&apos;OAuth2 Bot scope
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    Permissions : Administrator (recommandé)
                  </li>
                </ul>
              </div>

              <button
                onClick={saveBot}
                disabled={saving || !botName.trim()}
                className="btn-violet w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
              >
                <Zap className="mr-2 inline h-4 w-4" />
                {saving ? "Création en cours..." : hosting === "synkrone" ? "Créer et héberger le bot" : "Créer et recevoir le code"}
              </button>
            </div>
          </div>

          {/* Or let us create it */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">
                Nous créons le bot pour vous
              </h2>
            </div>

            <p className="text-sm text-white/60 mb-4">
              Pas envie de configurer le Discord Developer Portal ? Nous nous en
              occupons. Création du bot, configuration des intents et permissions,
              tout est pris en charge.
            </p>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-400">
                <Crown className="h-4 w-4" />
                Service payant — 4,99 €
              </div>
              <p className="mt-1 text-xs text-white/60">
                Inclut la création du bot, la configuration complète et le premier
                mois d&apos;hébergement.
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {["Création de l'application Discord", "Configuration des intents", "Permissions optimisées", "Token livré sécurisé"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {item}
                  </div>
                )
              )}
            </div>

            <button className="w-full rounded-xl border border-primary/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-400 transition-all hover:bg-primary/20 hover:border-primary/50">
              Commander la création
            </button>
          </div>

          {/* Existing bots */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-white">Vos bots</h2>
              <button className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all">
                + Nouveau bot
              </button>
            </div>
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
              <Bot className="mx-auto h-12 w-12 text-white/60/30" />
              <p className="mt-3 text-sm text-white/60">Aucun bot créé pour le moment.</p>
              <p className="text-xs text-white/60/60">Configurez votre premier bot ci-dessus pour commencer.</p>
            </div>
          </div>
        </div>
      ) : step === "modules" ? (
        /* Modules view */
        <div id="modules">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Modules disponibles</h2>
              <p className="mt-1 text-sm text-white/60">
                Activez les modules que vous souhaitez. Chaque module consomme des Krônes.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" /> Gratuit
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-premium" /> Premium
              </span>
            </div>
          </div>

          {/* Points bar */}
          <div className="mb-6 card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Krônes utilisés</h3>
                <p className="text-sm text-white/50 mt-1">
                  Chaque module consomme des Krônes. Activez selon vos besoins.
                </p>
              </div>
              <div className="text-right">
                <span className={`font-display text-2xl font-bold ${totalKrUsed > maxKr ? "text-red-400" : "text-violet-400"}`}>
                  {totalKrUsed}
                </span>
                <span className="text-white/40 text-sm"> / {maxKr} Kr</span>
              </div>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalKrUsed > maxKr ? "bg-red-500" : "bg-gradient-to-r from-violet-600 to-violet-400"
                }`}
                style={{ width: `${Math.min((totalKrUsed / maxKr) * 100, 100)}%` }}
              />
            </div>
            
            <p className="mt-4 text-xs text-white/60">
              Besoin de plus de Krônes ?{" "}
              <a href="/pricing" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                Augmenter votre offre →
              </a>
            </p>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-violet-400 animate-spin" />
              <p className="mt-4 text-sm text-white/60">Chargement des modules...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((modInstance) => {
                const mod = modInstance.module;
                const IconComponent = iconMap[mod.icon] || Bot;
                return (
                  <div
                    key={modInstance.id}
                    className={`card group p-5 transition-all duration-300 ${
                      modInstance.enabled 
                        ? "border-violet-500/40 shadow-lg shadow-violet-500/10 bg-gradient-to-br from-violet-500/5 to-transparent" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                            modInstance.enabled 
                              ? "bg-gradient-to-br from-violet-500/30 to-violet-600/10 text-violet-300 shadow-lg shadow-violet-500/20" 
                              : "bg-white/5 text-white/50"
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className={`text-sm font-semibold transition-colors ${
                            modInstance.enabled ? "text-white" : "text-white/80"
                          }`}>
                            {mod.name}
                          </h3>
                          <span className={`text-[11px] transition-colors ${
                            modInstance.enabled ? "text-violet-400" : "text-white/50"
                          }`}>{mod.pointCost} Kr{mod.premium && " (Premium)"}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleModule(modInstance.id, !modInstance.enabled)}
                        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-all duration-300 ${
                          modInstance.enabled 
                            ? "bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-500/30" 
                            : "bg-white/10 hover:bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-0 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                            modInstance.enabled ? "translate-x-[26px]" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-white/60">
              Total : <span className="font-semibold text-white">{totalKrUsed} Kr</span> utilisés sur {maxKr}
            </span>
            <span className="text-xs text-white/40">
              {bot ? `Bot: ${bot.name} (${bot.status})` : "Créez d'abord un bot"}
            </span>
          </div>
        </div>
      ) : step === "stats" ? (
        /* Stats view */
        <div id="stats">
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-white">Statistiques du bot</h2>
            <p className="mt-1 text-sm text-white/60">
              Suivez en temps réel les performances et l&apos;activité de votre bot.
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              { label: "Serveurs", value: (stats?.servers || 0).toString(), icon: Server, color: "text-violet-400" },
              { label: "Utilisateurs atteints", value: (stats?.users || 0).toLocaleString(), icon: UsersRound, color: "text-cyan-400" },
              { label: "Commandes aujourd'hui", value: (stats?.commandsToday || 0).toString(), icon: Terminal, color: "text-emerald-400" },
              { label: "Commandes totales", value: (stats?.totalCommands || 0).toLocaleString(), icon: BarChart3, color: "text-violet-400" },
            ].map((metric) => (
              <div key={metric.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-white/60">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Performance metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              { label: "Uptime", value: stats?.uptime || "0%", icon: Clock, status: "success" },
              { label: "Latence", value: stats?.latency || "0ms", icon: Wifi, status: "success" },
              { label: "Mémoire", value: stats?.memory || "0 MB", icon: Cpu, status: "success" },
              { label: "CPU", value: stats?.cpu || "0%", icon: Activity, status: "success" },
            ].map((perf) => (
              <div key={perf.label} className="card p-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  perf.status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  <perf.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{perf.value}</p>
                  <p className="text-[11px] text-white/60">{perf.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Activity chart (simplified) */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-violet-400" />
                Activité horaire (dernières 12h)
              </h3>
              <div className="flex items-end gap-2 h-32">
                {(stats?.dailyActivity || []).map((val: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/60 hover:bg-primary transition-colors"
                      style={{ height: `${(val / 82) * 100}%` }}
                    />
                    <span className="text-[9px] text-white/60">{(i + 8) % 24}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top commands */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-violet-400" />
                Commandes les plus utilisées
              </h3>
              <div className="space-y-3">
                {(stats?.topCommands || []).map((cmd: {name: string, uses: number}, i: number) => (
                  <div key={cmd.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/60 w-4">#{i + 1}</span>
                    <code className="flex-1 text-sm text-white bg-white/5 rounded-lg px-2.5 py-1 border border-white/10">
                      {cmd.name}
                    </code>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-primary/40" style={{ width: `${(cmd.uses / 89) * 80}px` }} />
                      <span className="text-xs text-white/60 w-8 text-right">{cmd.uses}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages & errors */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                Messages &amp; Erreurs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xl font-bold text-white">{(stats?.messagesProcessed || 0).toLocaleString()}</p>
                  <p className="text-xs text-white/60">Messages traités</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className={`text-xl font-bold ${(stats?.errors || 0) > 0 ? "text-warning" : "text-emerald-400"}`}>
                    {stats?.errors || 0}
                  </p>
                  <p className="text-xs text-white/60">Erreurs (24h)</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center col-span-2">
                  <div className="flex items-center justify-center gap-2">
                    {(stats?.errors || 0) === 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <p className="text-sm text-white">
                      {(stats?.errors || 0) === 0 ? "Aucune erreur récente" : `${stats?.errors} erreurs détectées`}
                    </p>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Dernier redémarrage : {stats?.lastRestart || "Jamais"}</p>
                </div>
              </div>
            </div>

            {/* Server list */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="h-4 w-4 text-violet-400" />
                Serveurs connectés
              </h3>
              {(stats?.servers || 0) === 0 ? (
                <div className="py-6 text-center">
                  <Server className="mx-auto h-8 w-8 text-white/20" />
                  <p className="mt-2 text-sm text-white/60">Aucun serveur connecté.</p>
                  <p className="text-xs text-white/40 mt-1">Invitez votre bot sur un serveur Discord pour voir les stats.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-white">{stats?.servers}</p>
                    <p className="text-xs text-white/60">serveurs connectés</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : step === "files" ? (
        /* Files view */
        <div id="files">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Fichiers du projet</h2>
              <p className="mt-1 text-sm text-white/60">
                Gérez les fichiers stockés sur le VPS. Vous pouvez voir et importer des fichiers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadFiles}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${loadingFiles ? "animate-spin" : ""}`} />
              </button>
              <label className="btn-violet cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {uploadingFile ? "Envoi en cours..." : "Importer un fichier"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploadingFile}
                />
              </label>
            </div>
          </div>

          {loadingFiles ? (
            <div className="card p-12 text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-violet-400 animate-spin" />
              <p className="mt-4 text-sm text-white/60">Chargement des fichiers...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="card p-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
              <p className="mt-4 text-sm text-white/60">Aucun fichier pour le moment.</p>
              <p className="text-xs text-white/40 mt-1">Importez votre premier fichier ci-dessus.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = getFileIcon(file.mimeType);
                return (
                  <div
                    key={file.id}
                    className="card group flex items-center justify-between px-5 py-4 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-white/40">
                          {formatSize(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/api/files/${file.id}/download`}
                        className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="rounded-lg border border-red-500/20 p-2 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : step === "boxes" ? (
        /* Boxes view - redirect to dedicated page */
        <div className="text-center py-12">
          <Box className="mx-auto h-16 w-16 text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Gestion des Boxes</h3>
          <p className="text-sm text-white/60 mb-6">
            Accédez à la gestion complète des serveurs virtuels.
          </p>
          <button
            onClick={() => router.push('/dashboard/boxes')}
            className="btn-violet rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            <Box className="mr-2 inline h-4 w-4" />
            Accéder aux boxes
          </button>
        </div>
      ) : null}
    </div>
  );
}
