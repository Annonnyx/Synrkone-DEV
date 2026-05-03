"use client";

import { useEffect, useState, Suspense } from "react";
import { signIn, getProviders, getCsrfToken } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  useEffect(() => {
    const loadProviders = async () => {
      const providersData = await getProviders();
      const token = await getCsrfToken();
      setProviders(providersData);
      setCsrfToken(token || "");
    };
    loadProviders();
  }, []);

  const getErrorMessage = (errorCode: string) => {
    const errors: Record<string, string> = {
      Signin: "Une erreur est survenue lors de la connexion.",
      OAuthSignin: "Erreur lors de la connexion avec OAuth.",
      OAuthCallback: "Erreur lors du callback OAuth.",
      OAuthCreateAccount: "Erreur lors de la création du compte.",
      EmailCreateAccount: "Erreur lors de la création du compte email.",
      Callback: "Erreur lors du callback.",
      OAuthAccountNotLinked: "Ce compte est déjà lié à un autre utilisateur.",
      EmailSignin: "Vérifiez votre email pour le lien de connexion.",
      CredentialsSignin: "Identifiants incorrects.",
      default: "Une erreur est survenue.",
    };
    return errors[errorCode] || errors.default;
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Back to home */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[#a79eb5] hover:text-white transition-colors text-sm z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-cyan-500/20 to-violet-600/30 rounded-3xl blur-xl opacity-50" />
        
        <div className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Synkrone
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Connexion
            </h1>
            <p className="text-[#a79eb5] text-sm">
              Connectez-vous pour accéder à votre dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {getErrorMessage(error)}
            </div>
          )}

          {/* Providers */}
          <div className="space-y-3">
            {providers && Object.values(providers).map((provider) => {
              if (provider.id === "discord") {
                return (
                  <button
                    key={provider.id}
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    className="w-full group relative overflow-hidden rounded-xl bg-[#5865F2] p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#5865F2]/25"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="font-semibold text-white">Continuer avec Discord</span>
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>
                );
              }
              return (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-white font-medium transition-all hover:bg-white/10 hover:border-white/20"
                >
                  Continuer avec {provider.name}
                </button>
              );
            })}
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-6 text-xs text-[#6b6b80]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>IA intégrée</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 animate-pulse bg-violet-600/30 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-12 bg-[#5865F2]/30 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
