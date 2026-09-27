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
