import { Building2, Mail, Globe, Scale, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NoticesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 mb-6">
          <FileText className="h-4 w-4" />
          Informations légales
        </div>
        <h1 className="font-display text-4xl font-semibold text-white">Mentions légales</h1>
        <p className="mt-4 text-white/50">Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004</p>
      </div>

      {/* Editor */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Éditeur du site</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-2">
          <p><strong className="text-white">Synkrone</strong></p>
          <p>Plateforme de création et d&apos;hébergement de bots Discord</p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-3">
            <li>Email : <a href="mailto:contact@synkrone.fr" className="text-violet-400 hover:underline">contact@synkrone.fr</a></li>
            <li>Discord : <a href="https://discord.gg/nuFNvVybGE" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-1">Serveur Support <ExternalLink className="h-3 w-3" /></a></li>
          </ul>
          <p className="text-xs text-white/40 mt-4">
            Directeur de la publication : Noé Barneron
          </p>
        </div>
      </section>

      {/* Hosting */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Globe className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Hébergement</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-2">
          <p><strong className="text-white">Hetzner Online GmbH</strong></p>
          <p>Industriestr. 25, 91710 Gunzenhausen, Allemagne</p>
          <p className="text-xs text-white/40 mt-2">
            et/ou OVH SAS, 2 rue Kellermann, 59100 Roubaix, France
          </p>
          <p className="text-xs text-white/40">
            Les données sont hébergées principalement au sein de l&apos;Union Européenne.
          </p>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Propriété intellectuelle</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>
            L&apos;ensemble du contenu du site Synkrone (textes, images, graphismes, logos, icônes, code source) 
            est la propriété exclusive de Synkrone ou de ses partenaires.
          </p>
          <p>
            Toute reproduction, distribution, modification ou utilisation, même partielle, sans autorisation 
            préalable écrite est strictement interdite et constitue une contrefaçon sanctionnée par les articles 
            L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10 mt-4">
            <p className="text-xs">
              <strong className="text-white">Marques déposées :</strong><br />
              Synkrone™, le logo Synkrone, et tous les noms de bots associés (Vex, Asuna, Kayaba, Yui) 
              sont des marques déposées. Toute utilisation non autorisée est interdite.
            </p>
          </div>
        </div>
      </section>

      {/* Liability */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Limitation de responsabilité</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>
            Synkrone s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur son site. 
            Toutefois, Synkrone ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition.
          </p>
          <p>
            En conséquence, Synkrone décline toute responsabilité :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>pour toute imprécision, inexactitude ou omission des informations disponibles</li>
            <li>pour tous dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers</li>
            <li>pour les dommages indirects résultant de l&apos;utilisation du service</li>
            <li>pour les dysfonctionnements du service dûs à des facteurs externes (réseau, force majeure)</li>
          </ul>
        </div>
      </section>

      {/* Cookies */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Cookies et collecte de données</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>
            Le site utilise des cookies essentiels au fonctionnement du service (session, authentification) 
            et des cookies analytiques pour améliorer l&apos;expérience utilisateur.
          </p>
          <p>
            Conformément à la directive ePrivacy et au RGPD, les cookies non essentiels ne sont déposés 
            qu&apos;après consentement explicite de l&apos;utilisateur.
          </p>
          <p>
            Pour plus d&apos;informations, consultez notre{' '}
            <Link href="/legal/privacy" className="text-violet-400 hover:underline">
              Politique de confidentialité
            </Link>.
          </p>
        </div>
      </section>

      {/* Hyperlinks */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <ExternalLink className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Liens hypertextes</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>
            Le site Synkrone peut contenir des liens vers d&apos;autres sites. Synkrone n&apos;exerce aucun contrôle 
            sur ces sites et décline toute responsabilité quant à leur contenu ou leur politique de confidentialité.
          </p>
          <p>
            Toute création de lien vers le site Synkrone doit faire l&apos;objet d&apos;une autorisation préalable. 
            Pour toute demande, contactez-nous à <a href="mailto:contact@synkrone.fr" className="text-violet-400 hover:underline">contact@synkrone.fr</a>.
          </p>
        </div>
      </section>

      {/* Applicable Law */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Droit applicable et juridiction</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, une solution 
            amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront compétents.
          </p>
          <p className="text-xs text-white/40">
            Pour les consommateurs européens, la plateforme de règlement en ligne des litiges (RLL) de l&apos;UE 
            est accessible à l&apos;adresse : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ec.europa.eu/consumers/odr</a>
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="card-featured p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Contact</h2>
        </div>
        <p className="text-white/60 text-sm mb-4">
          Pour toute question concernant les mentions légales :
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href="mailto:contact@synkrone.fr" 
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
            contact@synkrone.fr
          </a>
        </div>
        <p className="text-xs text-white/40 mt-4">
          Ces mentions légales ont été mises à jour le {new Date().toLocaleDateString("fr-FR")}. 
          Synkrone se réserve le droit de les modifier à tout moment.
        </p>
      </section>
    </div>
  );
}
