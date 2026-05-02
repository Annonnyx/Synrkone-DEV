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
} from "lucide-react";

const projects = [
  {
    icon: Bot,
    name: "Vex",
    category: "Bot Discord",
    description: "Bot multifonction propulsé par Synkrone. Modération, utilitaires et fun.",
    href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560",
    color: "violet",
    stats: "2.4K serveurs",
  },
  {
    icon: Bot,
    name: "Asuna",
    category: "Bot Discord",
    description: "Modération avancée avec auto-mod, anti-raid et système de sanctions.",
    href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640",
    color: "violet",
    stats: "1.8K serveurs",
  },
  {
    icon: Bot,
    name: "Kayaba",
    category: "Bot Discord",
    description: "Utilitaires serveur : embeds, annonces, sondages et gestion de rôles.",
    href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780",
    color: "violet",
    stats: "900+ serveurs",
  },
  {
    icon: Bot,
    name: "Yui",
    category: "Bot Discord",
    description: "Fun & mini-jeux : système d'économie, jeux de casino, interactions.",
    href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810",
    color: "rose",
    stats: "Nouveau",
  },
  {
    icon: Sword,
    name: "The French Baguette",
    category: "Serveur Minecraft",
    description: "Serveur Minecraft communautaire francophone. Survie, factions et événements.",
    href: "https://discord.gg/jX9mFnEk72",
    color: "emerald",
    stats: "500+ joueurs",
  },
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
    stats: "Partenaire",
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
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Écosystème
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Projets Synkrone
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Bots, serveurs et partenaires. Découvrez tout ce que nous construisons.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const colors = colorMap[project.color] || colorMap.violet;
            return (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`card group p-6 ${colors.border} transition-all duration-300 hover:shadow-xl ${colors.glow}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} transition-transform group-hover:scale-110`}>
                    <project.icon className="h-7 w-7" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    <Zap className="h-3 w-3" />
                    {project.stats}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-display text-xl font-semibold text-white mb-1">{project.name}</h3>
                  <span className="text-sm text-white/40">{project.category}</span>
                </div>
                
                <p className="mt-3 text-sm text-white/60 leading-relaxed">{project.description}</p>
                
                <span className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${colors.text} transition-all group-hover:gap-2`}>
                  Visiter <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-violet-400">4</div>
            <div className="text-sm text-white/50 mt-1">Bots actifs</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-emerald-400">5.3K+</div>
            <div className="text-sm text-white/50 mt-1">Serveurs</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-amber-400">12K+</div>
            <div className="text-sm text-white/50 mt-1">Utilisateurs</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-display text-3xl font-bold text-rose-400">99.7%</div>
            <div className="text-sm text-white/50 mt-1">Uptime</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 card-featured relative p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 mb-6">
              <Layers className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-white">Vous avez un projet ?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/50">
              Rejoignez notre communauté et proposez vos idées. Nouveaux partenariats bienvenus.
            </p>
            <a
              href="https://discord.gg/nuFNvVybGE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet mt-6 inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Rejoindre le Discord
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
