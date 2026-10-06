# Site Frezz AI (frezzai.app)

Site statique, sans build, publié par Vercel depuis le dépôt `gtd0542-source/Freeze-AI-site` (adresse principale :
https://www.frezzai.app). Publication : `git subtree split --prefix=site` depuis le dépôt de l’app, puis push sur `main`.
Il sert aussi à la vérification de marque Google (page de connexion) et servira aux fiches App Store et Play Store.

## Langues
Anglais par défaut à la racine (`/`), français sous `/fr/`. Chaque page a son équivalent dans l’autre langue (sélecteur
FR / EN dans le menu et le pied de page, liens `hreflang`).
- `middleware.ts` (Vercel Routing Middleware, uniquement sur `/`) : les visiteurs des pays francophones (France, Belgique,
  Suisse, Luxembourg, Monaco, Québec, outre-mer, Afrique francophone, Haïti) sont envoyés vers `/fr/`. Un choix fait avec
  le sélecteur (cookie `frezz-lang`, posé par `lang.js`) passe toujours avant le pays. Les robots ne sont jamais redirigés.
- `vercel.json` : les anciennes adresses françaises à la racine (`/conditions.html`, `/confidentialite.html`, `/cgv.html`,
  `/mentions-legales.html`) redirigent vers `/fr/…`.

## Pages
| Anglais | Français | Contenu |
|---|---|---|
| `index.html` | `fr/index.html` | Accueil (FAQ aussi en JSON-LD) |
| `legal-notice.html` | `fr/mentions-legales.html` | Éditeur, hébergeurs, représentant UE, médiateur, crédits |
| `privacy.html` | `fr/confidentialite.html` | Politique de confidentialité (site + app) |
| `cookies.html` | `fr/cookies.html` | Traceurs et consentement |
| `terms.html` | `fr/conditions.html` | Conditions d’utilisation |
| `terms-of-sale.html` | `fr/cgv.html` | Conditions de vente de Frezz Premium, formulaire de rétractation |
| `robots.txt`, `sitemap.xml`, `llms.txt` | | Robots, plan du site bilingue, description pour les assistants IA |

Les champs à remplir par l’éditeur sont surlignés en jaune : `<mark class="todo">[À COMPLÉTER …]</mark>` en français,
`[TO COMPLETE …]` en anglais. Chercher `class="todo"` pour les retrouver tous.

## Traceurs et services tiers
- **Vercel Web Analytics + Speed Insights** (`/_vercel/*`, même domaine) : statistiques anonymes, sans cookie, pas de
  consentement nécessaire.
- **Pixel Whop** : traceur publicitaire (cookies `_wuid`, empreinte du navigateur). Le code Whop est dans
  `<script type="text/plain" data-consent="ads">` : il ne s’exécute qu’après « Accept all » / « Tout accepter ».
- **`consent.js`** : bandeau de choix dans la langue de la page (« Reject all » / « Accept all » au même niveau,
  « Customize »), choix gardé 6 mois dans `localStorage["frezz-consent"]` (commun aux deux langues), lien « Manage
  cookies » / « Gérer mes cookies » dans le pied de page, retrait = effacement des cookies et du stockage Whop.
- Polices (`fonts/`, licence SIL OFL) et animations GSAP 3.15 + Lenis 1.3 (`vendor/`) hébergées sur le site : aucun appel
  à Google Fonts ni à un CDN. Si les animations ne se chargent pas ou si « réduire les animations » est activé, la page
  s’affiche entière, sans animation. `script.js` prend les mots du titre animé dans `data-words` et affiche les montants
  en dollars (anglais) ou en euros (français).

## Accessibilité
Lien « Skip to content » / « Aller au contenu », focus clavier visible partout (anneau blanc + encre), un seul `h1` par
page sans saut de niveau, maquettes de téléphone décrites par un texte unique (`role="img"`), langue `en` ou `fr`
déclarée sur chaque page.
