import {
  Bot,
  Gamepad2,
  Globe,
  MessageCircle,
  Sword,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const projects = [
  {
    icon: Bot,
    name: "Vex",
    category: "Bot Discord",
    description: "Bot multifonction propulsé par Synkrone. Modération, utilitaires et fun.",
    href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560",
    color: "primary",
  },
  {
    icon: Bot,
    name: "Asuna",
    category: "Bot Discord",
    description: "Modération avancée avec auto-mod, anti-raid et système de sanctions.",
    href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640",
    color: "primary",
  },
  {
    icon: Bot,
    name: "Kayaba",
    category: "Bot Discord",
    description: "Utilitaires serveur : embeds, annonces, sondages et gestion de rôles.",
    href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780",
    color: "primary",
  },
  {
    icon: Bot,
    name: "Yui",
    category: "Bot Discord",
    description: "Fun & mini-jeux : système d'économie, jeux de casino, interactions.",
    href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810",
    color: "primary",
  },
  {
    icon: Sword,
    name: "The French Baguette",
    category: "Serveur Minecraft",
    description: "Serveur Minecraft communautaire francophone. Survie, factions et événements.",
    href: "https://discord.gg/jX9mFnEk72",
    color: "accent",
  },
  {
    icon: MessageCircle,
    name: "Synkrone Support",
    category: "Serveur Discord",
    description: "Communauté d'entraide et support pour tous les produits Synkrone.",
    href: "https://discord.gg/nuFNvVybGE",
    color: "accent",
  },
  {
    icon: Globe,
    name: "Maths-App",
    category: "Site partenaire",
    description: "Application web de mathématiques, partenaire de Synkrone.",
    href: "https://maths-app.com",
    color: "success",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "hover:border-primary/40" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "hover:border-accent/40" },
  success: { bg: "bg-success/10", text: "text-success", border: "hover:border-success/40" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projets Synkrone</h1>
        <p className="mt-3 text-muted">
          Découvrez tous les projets de l&apos;écosystème Synkrone : bots, serveurs, sites web.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const colors = colorMap[project.color] || colorMap.primary;
          return (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`bento-item group p-6 ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                  <project.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                  <span className="text-xs text-muted">{project.category}</span>
                </div>
              </div>
              <p className="text-sm text-muted">{project.description}</p>
              <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${colors.text}`}>
                Visiter <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 bento-item relative p-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-foreground">Vous avez un projet ?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Rejoignez notre communauté et proposez vos idées. Nous sommes toujours à la recherche de nouveaux partenariats.
          </p>
          <a
            href="https://discord.gg/nuFNvVybGE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shiny mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            Rejoindre le Discord
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
