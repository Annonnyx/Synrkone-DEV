export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Conditions générales d&apos;utilisation</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <h2 className="text-lg font-semibold text-foreground">1. Objet</h2>
        <p>
          Les présentes CGU régissent l&apos;utilisation de la plateforme Synkrone, permettant la création et la gestion de bots Discord et de sites web via des modules pré-codés.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Inscription</h2>
        <p>
          L&apos;utilisation de Synkrone nécessite la création d&apos;un compte. Vous vous engagez à fournir des informations exactes et à les maintenir à jour.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Tokens Discord</h2>
        <p>
          Vous êtes responsable de la sécurité de votre token Discord. Synkrone chiffre les tokens mais ne saurait être tenu responsable d&apos;une fuite résultant de votre négligence.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Utilisation acceptable</h2>
        <p>
          Il est interdit d&apos;utiliser Synkrone pour : spam, harcèlement, contenu illégal, violation des CGU Discord, ou toute activité nuisible.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Abonnements et paiements</h2>
        <p>
          Les abonnements sont facturés mensuellement. Aucun remboursement n&apos;est accordé pour les périodes déjà entamées, sauf disposition légale applicable.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Limitation de responsabilité</h2>
        <p>
          Synkrone est fourni &quot;en l&apos;état&quot;. Nous ne garantissons pas la disponibilité continue du service et ne saurions être tenus responsables des pertes indirectes.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Résiliation</h2>
        <p>
          Vous pouvez supprimer votre compte à tout moment. En cas de violation des CGU, Synkrone se réserve le droit de suspendre ou résilier votre accès.
        </p>
      </div>
    </div>
  );
}
