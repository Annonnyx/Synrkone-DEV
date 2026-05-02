export default function NoticesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mentions légales</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted">
        <h2 className="text-lg font-semibold text-foreground">Éditeur du site</h2>
        <p>
          Synkrone<br />
          Contact : via le serveur Discord support — https://discord.gg/nuFNvVybGE
        </p>

        <h2 className="text-lg font-semibold text-foreground">Hébergement</h2>
        <p>
          Le site Synkrone est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu du site Synkrone (textes, images, logos, design) est protégé par le droit d&apos;auteur. Toute reproduction non autorisée est interdite.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Liens externes</h2>
        <p>
          Le site peut contenir des liens vers des sites tiers. Synkrone ne saurait être tenu responsable du contenu de ces sites.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </div>
    </div>
  );
}
