import { Scale, AlertTriangle, Coins, Shield, Server, UserX, Mail } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
          <Scale className="h-4 w-4" />
          Conditions légales
        </div>
        <h1 className="font-display text-4xl font-semibold text-white">Conditions générales d&apos;utilisation</h1>
        <p className="mt-4 text-white/50">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>

      {/* Introduction */}
      <div className="card p-6 mb-8">
        <p className="text-white/70 leading-relaxed">
          Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la plateforme Synkrone. 
          En créant un compte et en utilisant nos services, vous acceptez ces conditions dans leur intégralité. 
          Si vous n&apos;êtes pas d&apos;accord, veuillez ne pas utiliser nos services.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <span className="font-display text-lg font-bold">1</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Objet du service</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Synkrone est une plateforme en ligne permettant la création, la configuration et l&apos;hébergement de bots Discord 
              personnalisés via des modules pré-codés. Le service comprend :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Un dashboard de configuration visuelle des bots</li>
              <li>Un système de modules activables/désactivables (modération, auto-rôles, économie, etc.)</li>
              <li>Un hébergement cloud optionnel des bots créés</li>
              <li>Un constructeur de sites web pour serveurs Discord</li>
              <li>Un système de monnaie virtuelle (Krônes) pour l&apos;accès aux fonctionnalités premium</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <span className="font-display text-lg font-bold">2</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Inscription et compte</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              L&apos;utilisation de Synkrone nécessite la création d&apos;un compte utilisateur. En créant un compte, vous vous engagez à :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fournir des informations exactes, complètes et à jour</li>
              <li>Maintenir la confidentialité de vos identifiants de connexion</li>
              <li>Être âgé d&apos;au moins 13 ans (ou 16 ans dans certains pays de l&apos;UE)</li>
              <li>Ne pas créer de comptes multiples sans autorisation</li>
              <li>Notifier immédiatement Synkrone en cas d&apos;utilisation non autorisée de votre compte</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Tokens Discord et sécurité</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Pour fonctionner, les bots Discord nécessitent un token d&apos;authentification. En utilisant Synkrone :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Vous êtes seul responsable de la sécurité de vos tokens Discord</li>
              <li>Synkrone chiffre les tokens stockés sur nos serveurs</li>
              <li>En cas de fuite due à votre négligence (partage du token, code exposé), Synkrone ne peut être tenu responsable</li>
              <li>Vous devez révoquer immédiatement un token compromis via le Discord Developer Portal</li>
            </ul>
            <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-xs text-amber-400 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Ne partagez jamais votre token. Celui-ci donne un contrôle total sur votre bot.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <UserX className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Utilisation interdite</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>Il est strictement interdit d&apos;utiliser Synkrone pour :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Spam, harcèlement ou intimidation d&apos;utilisateurs</li>
              <li>Distribution de contenu illégal (malware, pornographie infantile, etc.)</li>
              <li>Violation des Conditions d&apos;Utilisation de Discord</li>
              <li>Attaques DDoS ou tentative de disruption de services</li>
              <li>Phishing ou usurpation d&apos;identité</li>
              <li>Exploitation de bugs ou failles de sécurité</li>
              <li>Revente non autorisée de comptes ou de services</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Système de Krônes et paiements</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Synkrone utilise une monnaie virtuelle appelée &quot;Krônes&quot; pour l&apos;accès aux fonctionnalités premium :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Les Krônes sont achetées avec de la monnaie réelle (EUR)</li>
              <li>Les Krônes n&apos;ont aucune valeur monétaire en dehors de la plateforme</li>
              <li>Aucun remboursement n&apos;est effectué sauf obligation légale</li>
              <li>Les Krônes non utilisés restent sur le compte indéfiniment</li>
              <li>Synkrone se réserve le droit de modifier les tarifs avec préavis de 30 jours</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Server className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Hébergement et disponibilité</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Synkrone propose un hébergement cloud optionnel pour les bots créés :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>L&apos;hébergement Synkrone est fourni &quot;en l&apos;état&quot; sans garantie de disponibilité à 100%</li>
              <li>Des interruptions de service peuvent survenir pour maintenance</li>
              <li>Synkrone ne garantit pas la conservation des logs au-delà de 30 jours</li>
              <li>Les utilisateurs peuvent opter pour l&apos;auto-hébergement à tout moment</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <span className="font-display text-lg font-bold">7</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Propriété intellectuelle</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Tous les éléments de Synkrone (code, design, logos, modules) sont protégés par le droit d&apos;auteur. 
              L&apos;utilisation du code source fourni en cas d&apos;auto-hébergement est soumise à une licence limitée :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Vous ne pouvez pas revendre le code source</li>
              <li>Vous ne pouvez pas utiliser le code pour créer un service concurrent</li>
              <li>Les mises à jour sont fournies pendant la durée spécifiée à l&apos;achat</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <span className="font-display text-lg font-bold">8</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Résiliation et suspension</h2>
          </div>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              Synkrone se réserve le droit de suspendre ou résilier un compte en cas de :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violation des présentes CGU</li>
              <li>Comportement nuisible envers d&apos;autres utilisateurs</li>
              <li>Tentative de compromission de la plateforme</li>
              <li>Inactivité prolongée (plus de 12 mois) pour les comptes gratuits</li>
            </ul>
            <p className="mt-3">
              En cas de résiliation pour violation, aucun remboursement ne sera effectué.
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
            Pour toute question concernant ces CGU, vous pouvez nous contacter :
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="mailto:contact@synkrone.fr" 
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              contact@synkrone.fr
            </a>
            <a 
              href="https://discord.gg/nuFNvVybGE" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              Discord Support
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
