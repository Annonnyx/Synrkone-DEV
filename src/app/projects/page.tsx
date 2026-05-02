"use client";

import {
  Bot,
  Sword,
  Globe,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Zap,
  Gamepad2,
  Layers,
  Copy,
  Check,
  Server,
  Users,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const bots = [
  {
    icon: Bot,
    name: "Vex",
    version: "v2.4.1",
    category: "Bot Multifonction",
    description: "Modération, utilitaires, fun et économie.",
    href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560",
    color: "violet",
    stats: "2.4K serveurs",
    avatarUrl: null, // URL avatar Discord: "https://cdn.discordapp.com/avatars/ID/avatar.png"
    features: [
      "Modération auto",
      "Économie",
      "Musique",
    ],
  },
  {
    icon: Bot,
    name: "Asuna",
    version: "v1.8.2",
    category: "Bot Modération",
    description: "Anti-raid, anti-spam, sanctions auto.",
    href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640",
    color: "violet",
    stats: "1.8K serveurs",
    avatarUrl: null, // URL avatar Discord
    features: [
      "Auto-modération",
      "Anti-raid",
      "Logs",
    ],
  },
  {
    icon: Bot,
    name: "Kayaba",
    version: "v1.5.0",
    category: "Bot Utilitaires",
    description: "Embeds, annonces, sondages, tickets.",
    href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780",
    color: "violet",
    stats: "900+ serveurs",
    avatarUrl: null, // URL avatar Discord
    features: [
      "Embeds",
      "Auto-rôles",
      "Tickets",
    ],
  },
  {
    icon: Bot,
    name: "Yui",
    version: "v1.0.0",
    category: "Bot Fun & Jeux",
    description: "Mini-jeux, économie fun, interactions.",
    href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810",
    color: "rose",
    stats: "Nouveau",
    avatarUrl: null, // URL avatar Discord
    features: [
      "Casino",
      "Niveaux",
      "Relations",
    ],
  },
];

const minecraftProjects = [
  {
    icon: Sword,
    name: "The French Baguette",
    version: "v1.16.5",
    modpackType: "Tech / Aventure",
    category: "Modpack Minecraft",
    description: "Un modpack colossal 100% français. Tech, magie et exploration dans un univers unique.",
    href: "https://discord.gg/jX9mFnEk72",
    color: "emerald",
    stats: "500+ joueurs actifs",
    ip: "play.frenchbaguette.fr",
    features: [
      "Create, Mekanism, AE2",
      "Botania, Blood Magic",
      "Dimensions custom",
      "Quêtes en français",
    ],
    online: true,
  },
  {
    icon: Gamepad2,
    name: "Xenus",
    version: "v1.19.2",
    modpackType: "Skyblock Tech",
    category: "Modpack Skyblock",
    description: "Skyblock technologique avec progression complexe. Automatisation et défis infinis.",
    href: "https://discord.gg/jX9mFnEk72",
    color: "cyan",
    stats: "300+ joueurs",
    ip: "sky.frenchbaguette.fr",
    features: [
      "Ex Nihilo Sequentia",
      "Tech reimagined",
      "Multiblocks avancés",
      "Économie serveur",
    ],
    online: true,
  },
  {
    icon: Globe,
    name: "Vanipack",
    version: "v1.21.1",
    modpackType: "Vanilla+",
    category: "Vanilla Améliorée",
    description: "Expérience vanilla améliorée. Qualité de vie, optimisations, contenu léger.",
    href: "https://discord.gg/jX9mFnEk72",
    color: "amber",
    stats: "Serveur non-modded",
    ip: "vanilla.frenchbaguette.fr",
    features: [
      "Optimisé Sodium",
      "Shaders support",
      "QOL mods",
      "Compatible vanilla",
    ],
    online: true,
  },
];

const communityProjects = [
  {
    icon: MessageCircle,
    name: "Synkrone Support",
    category: "Communauté",
    description: "Communauté d'entraide et support pour tous les produits Synkrone.",
    href: "https://discord.gg/nuFNvVybGE",
    color: "amber",
    stats: "1.2K membres",
  },
  {
    icon: Globe,
    name: "Maths-App",
    category: "Site partenaire",
    description: "Application web de mathématiques, partenaire de Synkrone.",
    href: "https://maths-app.com",
    color: "cyan",
    stats: "Partenaire officiel",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  violet: { 
    bg: "bg-violet-500/10", 
    text: "text-violet-400", 
    border: "hover:border-violet-500/40",
    glow: "group-hover:shadow-violet-500/20"
  },
  rose: { 
    bg: "bg-rose-500/10", 
    text: "text-rose-400", 
    border: "hover:border-rose-500/40",
    glow: "group-hover:shadow-rose-500/20"
  },
  emerald: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-400", 
    border: "hover:border-emerald-500/40",
    glow: "group-hover:shadow-emerald-500/20"
  },
  amber: { 
    bg: "bg-amber-500/10", 
    text: "text-amber-400", 
    border: "hover:border-amber-500/40",
    glow: "group-hover:shadow-amber-500/20"
  },
  cyan: { 
    bg: "bg-cyan-500/10", 
    text: "text-cyan-400", 
    border: "hover:border-cyan-500/40",
    glow: "group-hover:shadow-cyan-500/20"
  },
};

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Global background glow */}
      <div className="page-glow" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Écosystème
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Nos projets
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Bots Discord, serveurs Minecraft et outils communautaires. Tout ce que nous construisons.
          </p>
        </div>

        {/* Bots Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Bots Discord</h2>
              <p className="text-sm text-white/40">Créez avec Synkrone ou ajoutez les bots officiels</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot, i) => {
              const colors = colorMap[bot.color];
              return (
                <a
                  key={bot.name}
                  href={bot.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card group p-5 ${colors.border} transition-all duration-300 hover:shadow-xl ${colors.glow}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text} transition-all duration-300 group-hover:scale-110 overflow-hidden`}>
                      {bot.avatarUrl ? (
                        <img src={bot.avatarUrl} alt={bot.name} className="w-full h-full object-cover" />
                      ) : (
                        <bot.icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                        <Zap className="h-3 w-3" />
                        {bot.stats}
                      </span>
                      <div className="text-[10px] text-white/30 mt-1">{bot.version}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{bot.name}</h3>
                    <p className="text-xs text-white/40">{bot.category}</p>
                  </div>
                  
                  <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-2">{bot.description}</p>
                  
                  <ul className="mt-3 space-y-1">
                    {bot.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-1.5 text-xs text-white/40">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${colors.text}`}>
                      Ajouter
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Minecraft Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sword className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Serveurs Minecraft</h2>
              <p className="text-sm text-white/40">Modpacks et serveurs communautaires</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {minecraftProjects.map((project, i) => {
              const colors = colorMap[project.color];
              return (
                <div
                  key={project.name}
                  className={`card group p-6 ${colors.border} transition-all duration-300 hover:shadow-xl ${colors.glow}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} transition-transform group-hover:scale-105`}>
                      <project.icon className="h-7 w-7" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {project.online && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      <span className="text-xs text-emerald-400">En ligne</span>
                    </div>
                  </div>
                  
                  <div className="mb-1">
                    <h3 className="font-display text-xl font-semibold text-white">{project.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>{project.version}</span>
                      <span>•</span>
                      <span>{project.modpackType}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/50 mb-4">{project.description}</p>
                  
                  {/* IP Box */}
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-white/30" />
                        <span className="text-sm font-mono text-white/70">{project.ip}</span>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(project.ip)}
                        className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Copier l'IP"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
                      project.color === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Rejoindre Discord
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Communauté</h2>
              <p className="text-sm text-white/40">Rejoins nos espaces</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {communityProjects.map((project, i) => {
              const colors = colorMap[project.color];
              return (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card group p-6 text-center ${colors.border}`}
                >
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${project.color}-500/30 to-${project.color === 'amber' ? 'violet' : project.color}-500/20 opacity-50 blur-xl transition-opacity group-hover:opacity-80`} />
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.text} transition-transform group-hover:scale-110`}>
                      <project.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-medium text-white">{project.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{project.description}</p>
                  <div className="mt-3 text-xs text-white/30">{project.stats}</div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-violet-400">4</div>
            <div className="text-sm text-white/50 mt-1">Bots actifs</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-emerald-400">3</div>
            <div className="text-sm text-white/50 mt-1">Serveurs MC</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-amber-400">6K+</div>
            <div className="text-sm text-white/50 mt-1">Utilisateurs</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-cyan-400">99.7%</div>
            <div className="text-sm text-white/50 mt-1">Uptime</div>
          </div>
        </div>

        {/* CTA */}
        <div className="card-featured relative p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 mb-6">
              <Layers className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Envie de créer ?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
              Crée ton propre bot avec Synkrone. Modulaire, puissant, sans code.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="/dashboard" className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base">
                Lancer le dashboard
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
