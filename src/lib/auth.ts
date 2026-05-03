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
        } catch (error) {
          console.error("❌ DB upsert failed", error);
          // Si l'upsert échoue on laisse quand même passer
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log("🔐 session callback", { sessionUser: session.user?.email, tokenSub: token.sub });
      
      if (session.user && token.sub) {
        // Récupérer le rôle depuis la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        session.user.id = token.sub;
        session.user.role = dbUser?.role ?? "USER";
        console.log("✅ Session created", { userId: token.sub, role: dbUser?.role ?? "USER" });
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("🔐 jwt callback", { userEmail: user?.email, currentTokenSub: token.sub });
      
      if (user) {
        token.sub = user.id;
        console.log("✅ JWT token updated", { userId: user.id });
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
