"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Upload,
  BarChart3,
  Link2,
  ArrowRight,
  Check,
  Play,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Un seul upload",
    description:
      "Uploadez votre vidéo une fois. MultiShort s'occupe du reste sur toutes vos plateformes.",
  },
  {
    icon: Link2,
    title: "Toutes vos plateformes",
    description:
      "YouTube Shorts, TikTok, Instagram Reels, Spotify, Facebook et X — tout en un.",
  },
  {
    icon: BarChart3,
    title: "Analytics unifiés",
    description:
      "Comparez les performances de chaque vidéo sur toutes les plateformes en un coup d'œil.",
  },
];

const platforms = [
  "YouTube Shorts",
  "TikTok",
  "Instagram Reels",
  "Spotify",
  "Facebook",
  "X / Twitter",
];

const steps = [
  "Connectez vos comptes",
  "Uploadez votre vidéo",
  "Choisissez les plateformes",
  "Publiez partout",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">MultiShort</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-violet-100/50 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-600/20">
              <Zap className="h-4 w-4" />
              Le SaaS pour content creators
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
              Publiez votre vidéo{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                partout
              </span>{" "}
              en un clic
            </h1>
            <p className="mt-6 text-lg text-slate-600 sm:text-xl">
              Uploadez une fois, publiez sur YouTube Shorts, TikTok, Instagram
              Reels, Spotify et plus. Gagnez des heures chaque semaine.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="h-4 w-4" />
                  Voir la démo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-200/50">
              <div className="rounded-xl bg-slate-50 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {features.map((f, i) => (
                    <div
                      key={f.title}
                      className="animate-fade-in-up rounded-xl bg-white p-5 shadow-sm"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 font-semibold text-slate-900">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {f.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Quatre étapes simples pour publier partout
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-600/30">
                  {i + 1}
                </div>
                <p className="mt-4 font-medium text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Plateformes supportées
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-900 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">
            Prêt à gagner du temps ?
          </h2>
          <p className="mt-4 text-slate-400">
            Rejoignez les créateurs qui publient plus intelligemment avec
            MultiShort.
          </p>
          <ul className="mt-8 space-y-3 text-left sm:mx-auto sm:max-w-sm">
            {[
              "Publication multi-plateformes",
              "Analytics comparatifs",
              "Interface simple et moderne",
              "Gratuit pour commencer",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <Check className="h-5 w-5 shrink-0 text-violet-400" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/register" className="mt-10 inline-block">
            <Button size="lg">
              Créer mon compte
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            <span className="font-semibold text-slate-900">MultiShort</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 MultiShort. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
