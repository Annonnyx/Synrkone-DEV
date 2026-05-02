import { Users, Code, Server, Sparkles, Mail, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "VEX",
    role: "Co-fondateur & Lead Dev",
    avatar: "🔮",
    color: "violet",
    description: "Développeur principal et fondateur de Synkrone. En charge de l'architecture logicielle et du développement des fonctionnalités core.",
    skills: ["Full-Stack", "Architecture", "Bots Discord"],
    links: [
      { href: "https://github.com/vex", label: "GitHub" },
      { href: "https://twitter.com/vex", label: "Twitter" },
    ],
  },
  {
    name: "ONYX",
    role: "Co-fondateur & DevOps",
    avatar: "⚡",
    color: "amber",
    description: "Responsable Infrastructure et développeur. Gère les serveurs, le cloud et assure la stabilité des systèmes.",
    skills: ["DevOps", "Cloud", "Sécurité"],
    links: [
      { href: "https://github.com/onyx", label: "GitHub" },
      { href: "https://twitter.com/onyx", label: "Twitter" },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
};

const openPositions = [
  {
    title: "Développeur Frontend",
    type: "Stage / Alternance",
    description: "Rejoins l'équipe pour améliorer l'expérience utilisateur de Synkrone.",
    requirements: ["React / Next.js", "TailwindCSS", "TypeScript"],
    icon: Code,
  },
  {
    title: "Community Manager",
    type: "Bénévole",
    description: "Anime notre communauté Discord et fais rayonner Synkrone.",
    requirements: ["Passion Discord", "Créativité", "Rédaction"],
    icon: Users,
  },
  {
    title: "Modérateur",
    type: "Bénévole",
    description: "Maintiens un environnement sain sur nos serveurs de support.",
    requirements: ["Disponibilité", "Calme", "Connaissance Discord"],
    icon: Shield,
  },
];

export default function TeamPage() {
  return (
    <div className="relative min-h-screen">
      {/* Global background glow */}
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
            <Users className="h-4 w-4" />
            L&apos;équipe
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Les architectes de Synkrone
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Une petite équipe passionnée qui construit des outils puissants pour les communautés Discord.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-20">
          {teamMembers.map((member) => {
            const colors = colorMap[member.color];
            return (
              <div
                key={member.name}
                className={`card relative overflow-hidden group ${colors.border} hover:shadow-xl ${colors.glow}`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-30`} />
                
                <div className="relative p-8">
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-4xl border ${colors.border}`}>
                      {member.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display text-2xl font-bold text-white">{member.name}</h2>
                        <span className={`text-xs font-medium ${colors.text} bg-white/5 px-2 py-1 rounded-full border border-white/10`}>
                          {member.role}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm leading-relaxed mb-4">
                        {member.description}
                      </p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${colors.text}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Links */}
                      <div className="flex gap-3">
                        {member.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs text-white/60 hover:${colors.text} transition-colors hover:underline`}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Join Us Section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 mb-6">
            <Sparkles className="h-4 w-4" />
            Rejoindre l&apos;aventure
          </span>
          <h2 className="font-display text-4xl font-semibold text-white">
            On recrute !
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Tu veux contribuer à Synkrone ? Voici les rôles ouverts. Tous les profils sont les bienvenus.
          </p>
        </div>

        {/* Job Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {openPositions.map((job) => (
            <div
              key={job.title}
              className="card p-6 group hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <job.icon className="h-6 w-6" />
                </div>
                <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
                  {job.type}
                </span>
              </div>
              
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {job.title}
              </h3>
              <p className="text-sm text-white/50 mb-4">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req) => (
                  <span
                    key={req}
                    className="text-xs px-2 py-1 rounded bg-white/5 text-white/60"
                  >
                    {req}
                  </span>
                ))}
              </div>
              
              <a
                href="https://discord.gg/nuFNvVybGE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                Postuler
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 mb-4">
            <Globe className="h-7 w-7" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-white mb-2">
            Une idée ? Une suggestion ?
          </h3>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Même sans poste ouvert, on est toujours curieux de rencontrer des gens passionnés. 
            Rejoins notre Discord et présente-toi !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/nuFNvVybGE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet inline-flex items-center gap-2 px-6 py-3"
            >
              <Zap className="h-5 w-5" />
              Rejoindre le Discord
            </a>
            <a
              href="mailto:contact@synkrone.fr"
              className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
            >
              <Mail className="h-5 w-5" />
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
