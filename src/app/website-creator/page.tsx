"use client";

import { useState } from "react";
import {
  Globe,
  Code,
  Layout,
  ArrowRight,
  Bot,
  Eye,
  Sparkles,
  Crown,
  Check,
} from "lucide-react";

const presets = [
  {
    id: "community",
    name: "Communauté",
    description: "Page d'accueil pour votre serveur Discord avec infos, règles et liens.",
    preview: "Serveur communautaire avec sections Règles, Événements et Liens.",
    premium: false,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Présentez vos projets et créations avec un design épuré.",
    preview: "Portfolio minimaliste avec projets, à propos et contact.",
    premium: false,
  },
  {
    id: "store",
    name: "Boutique",
    description: "Vendez vos produits ou services avec une interface de boutique.",
    preview: "Boutique en ligne avec catalogue, panier et page produit.",
    premium: true,
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Page de présentation pour un projet ou produit avec CTA.",
    preview: "Landing page avec hero, features et appel à l'action.",
    premium: false,
  },
  {
    id: "wiki",
    name: "Wiki / Documentation",
    description: "Documentation organisée pour votre projet ou serveur.",
    preview: "Wiki avec recherche, catégories et pages de contenu.",
    premium: true,
  },
  {
    id: "custom",
    name: "Custom 100%",
    description: "Codez votre site de zéro et intégrez-le via /setup.",
    preview: "Votre code HTML/CSS/JS, hébergé par Synkrone.",
    premium: false,
  },
];

export default function WebsiteCreatorPage() {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [codeSnippet, setCodeSnippet] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Créateur de sites web</h1>
        <p className="mt-3 text-muted">
          Créez un site web pour votre serveur ou projet : presets ou code custom.
        </p>
      </div>

      {/* Mode selector */}
      <div className="mb-8 flex justify-center">
        <div className="glass flex gap-1.5 rounded-2xl p-1.5">
          <button
            onClick={() => setMode("preset")}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              mode === "preset"
                ? "bg-primary text-white shadow-lg shadow-primary-glow"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Layout className="mr-2 inline h-4 w-4" />
            Presets
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              mode === "custom"
                ? "bg-primary text-white shadow-lg shadow-primary-glow"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Code className="mr-2 inline h-4 w-4" />
            Code custom
          </button>
        </div>
      </div>

      {mode === "preset" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bento-item group p-6 hover:border-primary/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                {preset.premium && (
                  <span className="flex items-center gap-1 rounded-full bg-premium/10 px-2.5 py-0.5 text-[10px] font-bold text-premium">
                    <Crown className="h-3 w-3" /> PRO
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{preset.name}</h3>
              <p className="mt-1 text-sm text-muted">{preset.description}</p>
              <div className="mt-4 rounded-xl border border-glass-border bg-white/3 p-3">
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <Eye className="h-3 w-3" />
                  {preset.preview}
                </p>
              </div>
              <button className="mt-4 w-full rounded-xl border border-glass-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                Utiliser ce preset
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="bento-item p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Code className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Code custom</h2>
            </div>

            <p className="text-sm text-muted mb-4">
              Collez votre code HTML/CSS/JS ci-dessous. Une fois déployé, vous
              pourrez l&apos;intégrer à votre serveur Discord en utilisant la commande
              bot <code className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">/setup [code-court]</code>.
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Code-court (identifiant unique)
              </label>
              <input
                type="text"
                placeholder="mon-site"
                className="w-full rounded-xl border border-glass-border bg-white/3 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <p className="mt-1 text-xs text-muted">
                Sera utilisé dans <code className="text-primary">/setup mon-site</code>
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Votre code HTML
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={10}
                placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>...</head>&#10;  <body>...</body>&#10;</html>"
                className="w-full rounded-xl border border-glass-border bg-white/3 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 mb-4">
              <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Comment ça marche
              </h3>
              <ol className="mt-2 space-y-1 text-xs text-muted list-decimal list-inside">
                <li>Collez votre code HTML/CSS/JS ci-dessus</li>
                <li>Définissez un code-court unique</li>
                <li>Déployez le site via le bouton ci-dessous</li>
                <li>Sur Discord, utilisez <code className="text-accent">/setup [code-court]</code></li>
                <li>Le bot configure le site et vous donne l&apos;URL</li>
              </ol>
            </div>

            <button className="btn-shiny w-full rounded-xl px-4 py-3 text-sm font-semibold text-white">
              Déployer le site
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bento-item relative p-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="relative z-10">
        <h2 className="text-2xl font-bold text-foreground">
          Besoin d&apos;aide pour votre site ?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Rejoignez notre support Discord et la communauté vous aidera à créer le site parfait.
        </p>
        <a
          href="https://discord.gg/nuFNvVybGE"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shiny mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          Support Discord
          <ArrowRight className="h-4 w-4" />
        </a>
        </div>
      </div>
    </div>
  );
}
