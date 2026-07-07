# MultiShort

SaaS pour content creators — publiez une vidéo courte sur toutes vos plateformes en un clic.

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Supabase** (auth, database, storage — structure prête)
- **TypeScript**

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Mode démo

Le MVP fonctionne sans configuration Supabase. Utilisez n'importe quel email valide pour vous connecter. Les données sont persistées en localStorage.

### Configuration Supabase (optionnel)

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.example` vers `.env.local`
3. Remplissez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Pages

| Page | Route |
|------|-------|
| Landing | `/` |
| Connexion | `/login` |
| Inscription | `/register` |
| Dashboard | `/dashboard` |
| Mes plateformes | `/platforms` |
| Publier une vidéo | `/publish` |
| Mes vidéos | `/videos` |
| Analytics vidéo | `/videos/[id]` |
| Paramètres | `/settings` |

## Architecture

```
src/
├── app/                    # Pages Next.js
├── components/
│   ├── ui/                 # Composants réutilisables
│   ├── layout/             # Sidebar, DashboardLayout
│   ├── platforms/          # Cartes plateformes
│   └── videos/             # Cartes vidéos, analytics
├── contexts/               # État global (AppProvider)
├── data/                   # Données mockées
├── lib/
│   ├── supabase/           # Clients Supabase (client, server, middleware)
│   └── utils.ts
├── services/
│   └── platforms/          # Connecteurs plateformes (mock → vraies API)
└── types/                  # Types TypeScript
```

## Intégration des vraies API

Chaque plateforme a un connecteur dans `src/services/platforms/`. Le MVP utilise `mock-connector.ts`. Pour intégrer une vraie API :

1. Créez `youtube.ts` (ou autre) implémentant `PlatformConnector`
2. Remplacez l'entrée dans `src/services/platforms/index.ts`
3. Ajoutez le flow OAuth dans la page plateformes

## Déploiement sur Netlify

MultiShort est compatible Netlify (Next.js 16, SSR, middleware). Le fichier `netlify.toml` est déjà configuré.

### Méthode recommandée : Git + Netlify

1. **Poussez le code sur GitHub** (ou GitLab / Bitbucket)
   ```bash
   git add .
   git commit -m "Initial commit MultiShort"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USER/multishort.git
   git push -u origin main
   ```

2. **Connectez Netlify**
   - Allez sur [app.netlify.com](https://app.netlify.com)
   - **Add new site** → **Import an existing project**
   - Choisissez votre dépôt Git

3. **Vérifiez les paramètres de build** (normalement auto-détectés) :
   - Build command : `npm run build`
   - Publish directory : `.next`
   - Plugin : `@netlify/plugin-nextjs`

4. **Variables d'environnement** (optionnel, si vous utilisez Supabase) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Cliquez sur **Deploy site**. En 1 à 3 minutes, vous obtenez une URL du type `https://votre-site.netlify.app`.

### Déploiement rapide sans Git (CLI)

```bash
npx netlify-cli login
npx netlify-cli init
npx netlify-cli deploy --prod
```

### Notes

- Le MVP fonctionne **sans Supabase** en mode démo (données en localStorage côté navigateur).
- Chaque visiteur a ses propres données locales ; ce n’est pas encore une vraie base partagée en production.
- Pour un domaine personnalisé : **Site settings** → **Domain management** dans Netlify.

## Licence

MIT
