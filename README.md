# Site Frezz AI (accueil + confidentialité + conditions)

Site statique, sans build : `index.html`, `confidentialite.html`, `conditions.html`, `style.css`, `script.js`, `logo.png`.
Design : structure Cal AI (téléphones + étiquettes flottantes, arguments, FAQ) × ambiance x.ai (fond nuit, titre animé, grille de cartes, chiffres), aux couleurs de l’app (encre, crème, ocre, Jost + Fraunces).
Il sert à la **vérification de marque Google** (pour afficher « Frezz AI » au lieu de `zfzxqczbxunhggvowwlb.supabase.co` sur la page de connexion Google). Il sera aussi réutilisé pour l'App Store et le Play Store, qui demandent une politique de confidentialité en ligne.

## À compléter avant publication
- `conditions.html` → section *Mentions légales* : nom ou société de l’éditeur, adresse, hébergeur du site.
- Adresse `contact@frezzai.app` (dans les 3 pages) : remplace-la si ton domaine est différent.

## Publier (gratuit)
1. Achète le domaine (ex. `frezzai.app`, environ 10 à 15 €/an chez Cloudflare, OVH ou Namecheap).
2. Publie le dossier `site/` sur **Netlify** (glisser-déposer du dossier sur app.netlify.com/drop) ou **Vercel** (dossier racine `site`), puis branche le domaine.

## Vérification Google (affiche « Frezz AI »)
1. [Google Search Console](https://search.google.com/search-console) → ajoute le domaine → vérifie-le (enregistrement DNS TXT).
2. Google Cloud → *Google Auth Platform* → **Branding** :
   - Nom de l’application : `Frezz AI` ; logo : `logo.png` (120×120 minimum, carré)
   - Page d’accueil : `https://frezzai.app`
   - Règles de confidentialité : `https://frezzai.app/confidentialite.html`
   - Conditions d’utilisation : `https://frezzai.app/conditions.html`
   - Domaines autorisés : `frezzai.app` **et** `supabase.co`
3. *Google Auth Platform* → **Vérification** → soumettre. Délai habituel : 2 à 3 jours ouvrés (les scopes `openid`, `email`, `profile` ne demandent pas d’audit de sécurité).

## Motion design
GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3, chargés depuis cdn.jsdelivr.net (versions figées). Tout le code d'animation est dans `script.js`.
- Si le CDN ne répond pas, ou si l'utilisateur a activé « réduire les animations », la page s'affiche entière, sans animation (garde-fou dans le `<head>` d'`index.html`).
- Section « 0 achat » : épinglée au défilement sur ordinateur (plus de 900 px de large), animée sans épinglage sur téléphone.

## Liste d’attente (« Être prévenu du lancement »)
- Les inscriptions arrivent dans la table Supabase `public.waitlist` (e-mail, plateforme ios/android/both, date). Migration : `supabase/migrations/20260927170000_launch_waitlist.sql` du dépôt de l’app.
- Le site n’écrit que via la fonction `join_waitlist` (clé publiable). Personne ne peut lire la liste depuis le navigateur.
- Exporter la liste le jour du lancement : Supabase → Table Editor → `waitlist` → Export CSV. Ou en SQL : `select email, platform from public.waitlist where notified_at is null;`
- Après l’envoi : `update public.waitlist set notified_at = now();` puis supprimer les lignes (promesse faite dans la politique de confidentialité).
