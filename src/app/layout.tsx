import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/app-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MultiShort — Publiez partout en un clic",
  description:
    "Uploadez une vidéo courte et publiez-la automatiquement sur YouTube, TikTok, Instagram, Spotify et plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-slate-900 antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
