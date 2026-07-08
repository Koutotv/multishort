# Configuration des plateformes

## URLs de callback

Local :
- `http://localhost:3000/api/platforms/youtube/callback`
- `http://localhost:3000/api/platforms/tiktok/callback`
- `http://localhost:3000/api/platforms/instagram/callback`
- `http://localhost:3000/api/platforms/facebook/callback`

Production Netlify :
- `https://votre-site.netlify.app/api/platforms/youtube/callback`
- `https://votre-site.netlify.app/api/platforms/tiktok/callback`
- `https://votre-site.netlify.app/api/platforms/instagram/callback`
- `https://votre-site.netlify.app/api/platforms/facebook/callback`

## YouTube / Google

- Console : Google Cloud Console
- APIs a activer : YouTube Data API v3
- Scopes utilises :
  - `https://www.googleapis.com/auth/youtube.upload`
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `https://www.googleapis.com/auth/yt-analytics.readonly`
- Variables :
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

## TikTok

- Console : TikTok for Developers
- Produit : Login Kit + Content Posting API selon vos droits
- Scopes indicatifs :
  - `user.info.basic`
  - `video.publish`
  - `video.list`
- Variables :
  - `TIKTOK_CLIENT_KEY`
  - `TIKTOK_CLIENT_SECRET`

## Meta / Instagram / Facebook

- Console : Meta for Developers
- Produits : Facebook Login, Instagram Graph API, Pages API
- Prerequis :
  - compte Instagram Business ou Creator
  - page Facebook liee
- Scopes indicatifs :
  - `pages_show_list`
  - `pages_read_engagement`
  - `pages_manage_posts`
  - `instagram_basic`
  - `instagram_content_publish`
  - `instagram_manage_insights`
- Variables :
  - `META_CLIENT_ID`
  - `META_CLIENT_SECRET`

## Supabase

- Executez la migration SQL dans `supabase/migrations/001_platform_integrations.sql`
- Ajoutez les variables :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ENCRYPTION_SECRET`

## Notes importantes

- Les secrets OAuth ne doivent jamais etre exposes dans le navigateur.
- Les tokens sont stockes cote serveur dans Supabase.
- Certaines plateformes peuvent exiger une app review avant d'autoriser la publication ou les analytics en production.
