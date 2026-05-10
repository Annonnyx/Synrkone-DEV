import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";
import { syncDiscordRoles } from "@/lib/discord-sync";

// Scopes Discord : guilds permet de vérifier la présence sur le serveur Synkrone
const DISCORD_SCOPES = "identify email guilds guilds.members.read";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: { scope: DISCORD_SCOPES },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("🔐 signIn callback", { user: user?.email, provider: account?.provider, providerAccountId: account?.providerAccountId });
      
      if (account?.provider === "discord" && account.providerAccountId) {
        try {
          // Sync le Discord ID dans la DB
          const result = await prisma.user.upsert({
            where: { email: user.email ?? "unknown@synkrone.local" },
            update: { discordId: account.providerAccountId, image: user.image },
            create: {
              email: user.email ?? "unknown@synkrone.local",
              name: user.name,
              image: user.image,
              discordId: account.providerAccountId,
              role: "USER",
            },
          });
          console.log("✅ User synced to DB", { userId: result.id, email: result.email, discordId: result.discordId });

          // Sync des rôles Discord → rôle site
          if (account.access_token) {
            try {
              await syncDiscordRoles(account.providerAccountId, account.access_token);
              console.log("✅ Discord roles synced");
            } catch (syncError) {
              console.error("⚠️ Discord role sync failed (non-blocking)", syncError);
            }
          }
        } catch (error) {
          console.error("❌ DB upsert failed", error);
          // Si l'upsert échoue on laisse quand même passer
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) ?? "USER";
        session.user.discordId = (token.discordId as string) ?? null;
        session.user.isOnSynkroneServer = (token.isOnSynkroneServer as boolean) ?? false;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Premier login : stocker les infos dans le JWT
      if (user) {
        // ⚠️ user.id est l'ID Discord OAuth, PAS l'ID Prisma.
        // On doit récupérer l'utilisateur DB par email pour avoir l'ID Prisma.
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? "unknown@synkrone.local" },
          select: { id: true, role: true, discordId: true, isOnSynkroneServer: true },
        });

        if (dbUser) {
          token.sub = dbUser.id; // ✅ ID Prisma
          token.role = dbUser.role ?? "USER";
          token.discordId = dbUser.discordId ?? null;
          token.isOnSynkroneServer = dbUser.isOnSynkroneServer ?? false;
        } else {
          // Fallback : token créé avant l'upsert (ne devrait pas arriver)
          token.sub = user.id;
        }
      }

      // Rafraîchir les infos utilisateur depuis la DB à chaque requête
      // (le rôle peut avoir été mis à jour par Discord sync après le login)
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, discordId: true, isOnSynkroneServer: true },
        });

        if (dbUser) {
          token.role = dbUser.role ?? "USER";
          token.discordId = dbUser.discordId ?? null;
          token.isOnSynkroneServer = dbUser.isOnSynkroneServer ?? false;
        }
      }

      // Stocker l'access_token Discord pour les appels API ultérieurs
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      // Resync Discord automatique : tous les ROLE_SYNC_INTERVAL_MS, on
      // re-vérifie les rôles Discord depuis l'API Discord. Permet de
      // refléter rapidement un user qui a perdu / gagné un rôle Discord
      // sans qu'il ait à se reconnecter.
      if (token.discordId && typeof token.discordId === "string") {
        const ROLE_SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1h
        const now = Date.now();
        const lastSync = (token.lastRoleSyncAt as number | undefined) ?? 0;
        if (now - lastSync > ROLE_SYNC_INTERVAL_MS) {
          try {
            const result = await syncDiscordRoles(token.discordId);
            token.role = result.role;
            token.isOnSynkroneServer = result.isOnServer;
            token.lastRoleSyncAt = now;
          } catch (err) {
            console.error("⚠️ Auto Discord resync failed (non-blocking)", err);
            // On enregistre quand même un timestamp pour ne pas spammer l'API
            // Discord en boucle si elle échoue. Retry au prochain interval.
            token.lastRoleSyncAt = now;
          }
        }
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? undefined : undefined,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Type augmentation pour inclure role et Discord info dans session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      discordId?: string | null;
      isOnSynkroneServer: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    discordId?: string | null;
    isOnSynkroneServer?: boolean;
    accessToken?: string;
    lastRoleSyncAt?: number;
  }
}
