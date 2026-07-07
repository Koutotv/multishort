"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/app-context";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

export default function RegisterPage() {
  const { register, signInWithProvider } = useApp();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(email, password, fullName);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/platforms");
    }
  };

  const handleProviderSignup = async (provider: "google" | "discord") => {
    setError("");
    const result = await signInWithProvider(provider);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/platforms");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-violet-600 to-indigo-700 p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">MultiShort</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Rejoignez des milliers
            <br />
            de créateurs.
          </h2>
          <p className="mt-4 text-violet-200">
            Créez votre compte et commencez à publier en quelques minutes.
          </p>
        </div>
        <p className="text-sm text-violet-300">Gratuit pour commencer</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-violet-600" />
              <span className="text-lg font-bold">MultiShort</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-500">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-violet-600 hover:text-violet-700">
              Se connecter
            </Link>
          </p>

          <div className="mt-8 space-y-4">
            <SocialAuthButtons onProviderClick={handleProviderSignup} />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              id="fullName"
              label="Nom complet"
              placeholder="Jean Dupont"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Créer mon compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
