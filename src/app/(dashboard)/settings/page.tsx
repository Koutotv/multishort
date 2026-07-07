"use client";

import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useApp();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="mt-1 text-slate-500">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Profil</h2>
            <p className="text-sm text-slate-500">Informations personnelles</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            id="settings-name"
            label="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            id="settings-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            {saved ? "Enregistré !" : "Enregistrer"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">Alertes et emails</p>
          </div>
        </div>
        <div className="space-y-4">
          <Toggle label="Publication réussie" defaultChecked />
          <Toggle label="Erreur de publication" defaultChecked />
          <Toggle label="Rapport hebdomadaire analytics" />
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
            <p className="text-sm text-slate-500">Mot de passe et sessions</p>
          </div>
        </div>
        <Button variant="outline">Changer le mot de passe</Button>
      </Card>
    </div>
  );
}

function Toggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-violet-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
