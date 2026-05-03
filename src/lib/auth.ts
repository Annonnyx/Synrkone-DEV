import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account.providerAccountId) {
        try {
          // Sync le Discord ID dans la DB
          await prisma.user.upsert({
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
        } catch {
          // Si l'upsert échoue on laisse quand même passer
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Récupérer le rôle depuis la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        session.user.id = token.sub;
        session.user.role = dbUser?.role ?? "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Type augmentation pour inclure role dans session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}
