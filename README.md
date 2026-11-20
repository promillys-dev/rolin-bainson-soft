# Rolin Bainson — front-end

Refonte du site de Rolin Bainson (groupe immobilier lyonnais). C'est le quatrième
front du projet : il vit dans `web/` sur la branche `front-4` du dépôt
[promillys-dev/rolain-bainson](https://github.com/promillys-dev/rolain-bainson), à
côté du back-office Laravel (`api/`). L'audit du site précédent et le périmètre
fonctionnel sont à la racine de ce dépôt (`ETAT-DES-LIEUX.md`,
`SPEC-FONCTIONNELLE.md`, `ROADMAP.md`).

L'inventaire des éléments que ce front doit contenir — routes, composants, état
d'avancement — est dans [`docs/INVENTAIRE-FRONT.md`](docs/INVENTAIRE-FRONT.md).

## Démarrer

```bash
npm install
npm run dev
```

Le serveur écoute sur **http://localhost:3100** (port fixé pour ne pas entrer en
conflit avec XAMPP et les autres projets).

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sans émission |

## Back-office

Toutes les données viennent de l'API du back-office (`/api/v1`) : annonces et
référentiel de recherche, agences, actualités, menus, définitions de formulaire.
Les formulaires y sont envoyés. Le branchement reprend **le contrat du front 3**
(branche `nouveau-front-3`), mêmes variables comprises :

| Variable | Rôle |
|---|---|
| `API_URL` | Origine de l'API, sans `/api/v1` (local : `http://127.0.0.1:8100`) |
| `FRONT_INTERNAL_TOKEN` | Jeton partagé avec l'API, envoyé en `X-Front-Token` |
| `REVALIDATE_SECRET` | Secret de `POST /api/revalidate`, appelé par l'API après une modification |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site |
| `API_CA_CERT` | Transitoire : certificat du serveur de test, épinglé pour Node |

Copier `.env.example` en `.env.local`. Le back-office local se lance avec
`php artisan serve --port=8100` dans `api/`.

- **Lectures** (`src/lib/api/client.ts`) : côté serveur uniquement, mises en
  cache cinq minutes et étiquetées `listings`, `posts`, `pages`, `site`,
  `forms` — `/api/revalidate` les invalide sans attendre.
- **Formulaires** : dessinés d'après leur définition en back-office
  (`components/forms/BackofficeForm.tsx`), envoyés par une action serveur qui
  relaie vers l'API avec `X-Front-Token` et l'adresse du visiteur en
  `X-Client-Ip` : le middleware `TrustFrontRelay` applique ainsi la limite
  d'envoi visiteur par visiteur.
- **Fichiers** : les images de l'API sont servies par les routes `/storage` et
  `/media` du site ; l'origine de l'API n'apparaît jamais dans les pages.
- **Sans `API_URL`**, le site tourne sur ses données d'exemple (`src/data`) et
  le signale dans la console. Défini mais injoignable, il lève une erreur : pas
  de vieilles données affichées en silence.

## Stack

Next.js (App Router) · React · TypeScript strict · Tailwind CSS v4.

Rendu côté serveur par défaut. Une agence immobilière vit de son référencement :
chaque page doit être servie en HTML complet, et les composants client sont
l'exception, pas la règle : l'en-tête (menus et tiroir mobile), la bannière
animée, le sommaire de l'accueil, la colonne d'actualités et les formulaires.
Tout ce qu'ils affichent est lu côté serveur et leur est transmis.

## Arborescence

```
src/
├── app/                      routes (App Router)
│   ├── layout.tsx            coquille : barre de services, en-tête, pied de page
│   ├── page.tsx              accueil
│   ├── not-found.tsx         404
│   └── globals.css           jetons de design + base Tailwind
├── components/
│   ├── layout/               TopBar, SiteHeader, SiteFooter, Logo
│   ├── home/                 sections de la page d'accueil
│   └── ui/                   primitives (Container, Button, SectionHeading)
├── config/
│   ├── navigation.ts         SOURCE UNIQUE de tous les menus
│   └── site.ts               identité, agences, URL de l'extranet
├── lib/utils.ts              cn(), formatage prix / surface
└── types/property.ts         contrat de données d'un bien
```

## Décisions à connaître

**La barre de navigation est codée, le pied de page vient du back-office.** Pour
l'instant, la barre affiche le menu de `src/config/navigation.ts` (`mainNav`) : ses
entrées mènent toutes à une page du front, ce que le menu `principal` du
back-office ne garantit pas encore. Pour le rebrancher, `app/layout.tsx` passe
`nav={await getMainNav()}` à `SiteHeader` (`lib/menus.ts`). Les menus `footer` et
`liens-utiles` alimentent le pied de page. `navigation.ts` garde aussi la barre de
services, qui n'a pas d'équivalent en back-office, et sert de repli sans `API_URL`.
Les libellés viennent du menu réel de l'ancien site, coquilles corrigées
(« Coodronnées » → « Coordonnées », « Imobilier Vert » → « Immobilier Vert »).

**Un loader marque chaque changement de page.** `components/layout/PageLoader.tsx`
montre un voile blanc et le monogramme du logo qui se remplit, au moins 1 s
(`PAGE_LOADER_MIN`, `lib/pageTransition.ts`), plus longtemps si la page tarde. Le
départ des navigations vient de `src/instrumentation-client.ts`
(`onRouterTransitionStart`) ; les formulaires de recherche, qui rechargent la
page, l'affichent à l'envoi.

**L'architecture d'information a été resserrée.** Le legacy affichait 10 entrées à
plat. Les quatre métiers sont regroupés sous « Nos services » et les pages
institutionnelles sous « Le groupe », ce qui ramène la barre à 5 entrées. Décision
réversible : tout est dans `navigation.ts`.

**Les données d'agences sont réelles**, extraites de la table `rb_agences` du site
précédent. Attention : cette table contenait 4 lignes dont **deux doublons** de
l'agence Charpennes (une saisie à la main en 2015, une créée par l'import en 2025,
même adresse et même téléphone). Il y a bien **3 agences**. À dédoublonner côté
back-end.

**La recherche est un `<form method="get">` sans JavaScript.** Elle fonctionne
script désactivé et produit une URL partageable et indexable. Deux corrections par
rapport au legacy, documentées dans `SearchForm.tsx` :
- le nombre de pièces est un **minimum** (le legacy faisait une égalité stricte,
  donc « 3 pièces » excluait un 4 pièces) ;
- le budget s'applique quel que soit le type de transaction (le legacy l'ignorait
  silencieusement si vente/location n'était pas choisi).

**`reference` est l'identifiant ConvertImmo**, jamais un auto-incrément local
(`types/property.ts`). C'est lui qui rend les URLs d'annonces stables d'un import
à l'autre, donc tout le référencement des biens. Contrainte non négociable.

**Pas de mode sombre.** Site public institutionnel. Les jetons sont sémantiques,
donc en ajouter un plus tard ne touchera que `globals.css`.

**L'indexation est bloquée** (`robots` dans `layout.tsx`) tant que le site n'est pas
public, pour ne pas concurrencer l'ancien domaine. À retirer à la bascule.

## Identité visuelle

La direction artistique est une synthèse de trois sources, demandée par le client :
le design du site précédent, celui de [cloudacc.com](https://cloudacc.com/fr/), et
une maquette d'agence immobilière fournie en image. Leur dénominateur commun est
aussi celui du logo de la maison : **noir profond + orange, bas-de-casse
géométrique, formes arrondies, beaucoup d'air**.

Ce que chaque source apporte :

| Source | Ce qui en est repris |
|---|---|
| Site précédent | L'orange `#e5703a` (147 occurrences dans `standard.css`), la bichromie du logo, les trois colonnes d'appel à l'action, la carte à compteurs, le carrousel d'actualités, les onglets Location / Achat |
| cloudacc.com | Le fond crème chaud au lieu du blanc froid, les cartes teintées à grand rayon avec badge, les titres larges et serrés, les boutons pilule noirs à chevron |
| Maquette fournie | L'accent orange sur une partie du titre, la carte de recherche flottante, la mosaïque à masques arrondis, les cercles décoratifs, le dégradé orange du bouton de recherche |

**Typographie.** Titres en Outfit — géométrique, construit comme le bas-de-casse du
logo. Texte courant en Inter. Le serif (Source Serif 4) est conservé mais réservé
aux accents d'héritage : « depuis 1957 », repères de confiance, citations.

**Photographies.** Les deux fonds de bannière (`public/brand/hero-1.jpg` et
`hero-2.jpg`) sont fournis par le client, redimensionnés à 2200 px et
recompressés — 160 et 248 Ko, contre 2 et 17 Mo à l'origine. Pour en changer,
il n'y a que la constante `BACKDROPS` dans `HeroExperience.tsx` à modifier ;
pensez à repasser par la même réduction, un JPEG d'agence brut pèse dix fois
trop lourd.

Reste provisoire : **le logo**, `public/brand/rolin-bainson.png`, le PNG de 2015
récupéré dans la livraison legacy. À remplacer par le SVG officiel — seul
`components/layout/Logo.tsx` est à changer.

## La bannière

Trois plans : une photographie de fond, un dégradé dans la couleur du site
par-dessus, et le contenu. Le fond fait partie du diaporama — les deux images se
croisent en même temps que le visuel bascule.

Le visuel de droite est une **transformation**, pas un fondu entre deux images :
les cinq blocs de la mosaïque se déforment pour devenir cinq pièces qui
s'assemblent en carte de France, chacune gardant la place qu'elle occupait dans
la mosaïque. Le bloc du bas à droite devient le Sud-Est, celui qui porte Lyon.
Le cercle décoratif du coin bas droit est la sixième forme : il devient la Corse.

En état « blocs », chaque forme porte **une photographie cadrée sur elle**, sans
voile coloré : c'est le **liseré orange** qui tient la composition et la détache
du fond, qui est de la même matière. Les six images disent chacune un morceau du
métier — toits du Vieux Lyon, copropriété, séjour, remise des clés, façade,
chambre. Elles sont recadrées à la source au format exact de leur bloc plutôt que
laissées au rognage du navigateur (620 × 1134 pour la tuile haute, 760 × 655 pour
les quatre autres, 520 × 520 pour le cercle ; 384 Ko au total).

Ce sont des photos Unsplash, libres y compris pour un usage commercial, en place
jusqu'aux photos de la maison. Pour les remplacer : `PHOTOS` dans
`HeroStage.tsx`, une entrée par forme.

En état « carte », la couleur seule : une carte ne se lit pas à travers une photo.

Chaque bascule se joue en quatre temps, et c'est ce qui fait le récit :

1. un **filet doré parcourt le contour** de chaque forme — la transformation
   s'annonce avant de commencer ;
2. la **signature « Rolin Bainson »**, posée derrière les blocs, se contracte et
   vient se poser sur Lyon, où elle devient le point ;
3. les formes se déforment, décalées les unes par rapport aux autres ;
4. **trois traits sortent du point** et vont chercher le nom de chaque agence,
   au bout de la ligne.

Hors transition, la signature descend plus lentement que la page — elle paraît
presque immobile et se laisse recouvrir par la composition.

La recherche n'est **pas** dans la bannière : elle vient juste après les repères
chiffrés, sur le fond du site, pour se lire comme un outil et non comme une
illustration.

Comment c'est fait (`lib/heroMorph.ts`) :

- la France part d'un **vrai contour géographique** (`config/map.ts`, une
  cinquantaine de points en longitude/latitude), projeté dans le repère de la
  scène ;
- il est découpé en cinq par intersection exacte (Sutherland-Hodgman) avec les
  rectangles de la mosaïque. Les pièces voisines partagent alors exactement la
  même arête : la carte réassemblée n'a aucune couture — ce qu'une grille de
  cellules ne permettait pas ;
- les formes de départ sont celles du visuel, échancrures comprises : trois des
  cinq blocs portent une grande découpe en quart de cercle, d'où des rayons
  définis coin par coin et non un rayon unique ;
- chaque pièce et chaque bloc sont rééchantillonnés au même nombre de points,
  dans le même sens, avec des points de départ alignés : sans cela, la forme se
  vrille en chemin au lieu de se déformer ;
- les teintes sont des dégradés, et un `fill` ne s'interpole pas d'un dégradé à
  l'autre : deux calques superposés portent le même tracé et se croisent en
  opacité ;
- l'interpolation est pilotée image par image en JavaScript. La propriété `d`
  d'un tracé ne s'anime pas de façon fiable d'un navigateur à l'autre, et on veut
  de toute façon décaler les blocs entre eux et faire monter la surbrillance à
  mi-parcours.

La transformation **part des bords** : un liseré fait le tour du cadre, puis le
contour de chaque pièce s'allume pendant qu'elle se déforme et s'éteint une fois
la forme posée.

Sur le choix France plutôt qu'Europe : les trois agences sont à Lyon et
Villeurbanne, à deux kilomètres l'une de l'autre. À l'échelle du continent elles
se confondraient en un point, et la carte laisserait entendre une implantation
qui n'existe pas. Pour passer à l'Europe, il suffit de remplacer le tracé dans
`config/map.ts`.

## Le reste de la page

Un vocabulaire commun, défini dans `globals.css`, tient les sections ensemble :

- **`.gilt-edge`** — un liseré dégradé d'un pixel révélé au survol, écho statique
  du filet doré de la bannière. Il est peint dans un pseudo-élément masqué en
  anneau : une bordure ordinaire ne peut pas porter de dégradé ;
- **`.grain`** — un grain photographique sur les aplats sombres. Sans lui, un
  grand rectangle de couleur posé à côté de vraies photos sonne plastique ;
- **`.media-zoom`** — l'image s'approche doucement au survol de sa carte.

Les photographies sont placées là où elles portent du sens : estompées en pied
des trois cartes de service, en vignette sur les actualités, en bandeau sur les
agences, sous l'aplat du panneau de couverture et en fusion sous l'orange du
bandeau final. Les quatre métiers, eux, n'ont pas d'image — un rang en filigrane
(01 à 04) leur donne de la profondeur et rend la série lisible d'un coup d'œil.

Toutes ces images passent par `next/image`, donc en chargement différé : elles
sont sous la ligne de flottaison et ne coûtent rien au premier rendu.

## Animations

Trois autres mécanismes, tous coupés par `prefers-reduced-motion` :

- **entrée du héros** (`animate-rise`, CSS pur) — le `<h1>` en est volontairement
  exclu : c'est l'élément LCP, l'animer depuis `opacity: 0` repousserait la mesure ;
- **révélation au défilement** (`components/ui/Reveal.tsx`) — l'état caché n'est posé
  qu'après hydratation, donc sans JavaScript le contenu reste visible ;
- **compteurs** (`components/ui/Counter.tsx`) — la valeur finale est dans le HTML
  rendu côté serveur, l'animation ne fait que la remplacer temporairement.

Règle appliquée partout : **aucune animation n'est une condition d'affichage.**

## Reste à faire

La page d'accueil et les pages intérieures sont en place, branchées sur le
back-office. Le détail route par route est dans
[`docs/INVENTAIRE-FRONT.md`](docs/INVENTAIRE-FRONT.md).

Les mentions légales portent des « À COMPLÉTER » là où seul le client peut
répondre : carte professionnelle, garant financier, RCS, ORIAS, hébergeur. Le
barème de `/tarifs` porte des montants d'exemple.

Côté front :

- [ ] Pages éditoriales (métiers, présentation, mentions, tarifs) branchées sur
      les pages du back-office, dont le contenu est encore vide
- [ ] Diaporama de l'accueil piloté par le back-office (module à créer côté API)
- [ ] Alertes e-mail : création, et pages `/alertes/confirmation/{token}` et
      `/alertes/desinscription/{token}` vers lesquelles pointent les e-mails
- [ ] Simulateur d'assurance (`/insurance/*`, déjà prêt côté API)
- [ ] Plan de redirections 301 depuis les anciennes URLs (accents, apostrophes,
      `m²` encodé `%C2%B2`) — voir `SPEC-FONCTIONNELLE.md` §3.1
- [ ] Audit RGAA et budget de performance

Côté back-office, ce que le front attend :

- [ ] Appeler `POST /api/revalidate` après chaque modification de contenu
- [ ] Publier le siège (1 rue d'Alsace) : seules deux agences le sont
- [ ] Corriger trois liens du menu (`/courtage-dassurances`,
      `/etre-rappele/nous-ecrire`, `/cookies`), redirigés en attendant dans
      `next.config.ts`
- [ ] Coordonnées des agences (géocodées en attendant sur la Base Adresse
      Nationale), photos d'agence, images d'actualité
