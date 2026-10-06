# Site Frezz AI (frezzai.app)

Site statique, sans build, publié par Vercel depuis le dépôt `gtd0542-source/Freeze-AI-site` (adresse principale :
https://www.frezzai.app). Publication : `git subtree split --prefix=site` depuis le dépôt de l’app, puis push sur `main`.
Il sert aussi à la vérification de marque Google (page de connexion) et servira aux fiches App Store et Play Store.

## Pages
| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : présentation, « 0 achat », FAQ (le texte de la FAQ est aussi dans les données structurées JSON-LD) |
| `mentions-legales.html` | Éditeur, hébergeurs, représentant UE, médiateur, crédits |
| `confidentialite.html` | Politique de confidentialité (site + app), construite à partir des traitements réels du code |
| `cookies.html` | Liste des traceurs, gestion du consentement |
| `conditions.html` | Conditions générales d’utilisation (adresse donnée à Google pour la page de connexion) |
| `cgv.html` | Conditions générales de vente de Frezz Premium, formulaire de rétractation en annexe |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Robots, plan du site, description du site pour les assistants IA |

Les champs à remplir par l’éditeur sont surlignés en jaune : `<mark class="todo">[À COMPLÉTER …]</mark>`. Chercher
`class="todo"` pour les retrouver tous.

## Traceurs et services tiers
- **Vercel Web Analytics + Speed Insights** (`/_vercel/*`, même domaine) : statistiques anonymes, sans cookie, pas de
  consentement nécessaire. À activer dans Vercel → Analytique et Informations sur la vitesse.
- **Pixel Whop** : traceur publicitaire (cookies `_wuid`, empreinte du navigateur). Le code Whop est dans
  `<script type="text/plain" data-consent="ads">` : il ne s’exécute qu’après « Tout accepter ».
- **`consent.js`** : bandeau de choix (« Tout refuser » / « Tout accepter » au même niveau, « Personnaliser »), choix
  gardé 6 mois dans `localStorage["frezz-consent"]`, lien « Gérer mes cookies » dans le pied de page, retrait = effacement
  des cookies et du stockage Whop.
- Polices (`fonts/`, licence SIL OFL) et animations GSAP 3.15 + Lenis 1.3 (`vendor/`) hébergées sur le site : aucun appel
  à Google Fonts ni à un CDN. Si les animations ne se chargent pas ou si « réduire les animations » est activé, la page
  s’affiche entière, sans animation.

## Accessibilité
Lien « Aller au contenu », focus clavier visible partout (anneau blanc + encre), un seul `h1` par page sans saut de
niveau, maquettes de téléphone décrites par un texte unique (`role="img"`), langue `fr` déclarée.
