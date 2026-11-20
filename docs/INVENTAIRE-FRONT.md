# Inventaire du front

Liste des éléments que ce front doit contenir, déduite du site précédent
(Novius OS, analysé module par module) et de l'arborescence réellement servie en
production.

Ce document répond à une seule question : **qu'est-ce qui doit exister, où, et
est-ce fait ?** Le détail des règles métier et des pièges du legacy n'est pas
repris ici — il est dans `C:\xampp\htdocs\rolain-bainson\SPEC-FONCTIONNELLE.md`,
référencé par section (`SPEC §3.2`, etc.). En cas de contradiction, c'est la
spécification qui tranche.

Légende : **fait** · **partiel** (existe mais incomplet) · **à faire**

---

## 1. Coquille globale

Présente sur toutes les pages, montée dans `app/layout.tsx`.

| Élément | Legacy | Cible | État |
|---|---|---|---|
| Barre de services | 5 liens en tableau HTML | `layout/TopBar` | fait |
| En-tête + navigation | menu 2 niveaux, collant | `layout/SiteHeader` | fait |
| Tiroir mobile | off-canvas mmenu, menu + agences | dans `SiteHeader` | fait |
| Pied de page | 2 menus + bloc agences + logo UNIS | `layout/SiteFooter` | partiel — logo UNIS absent |
| Logo | PNG de 2015 | `layout/Logo` | partiel — marque typographique provisoire |
| Lien d'évitement | absent | `layout.tsx` | fait |
| Fil d'Ariane | `lib_ariane`, sur toutes les pages internes | `ui/Breadcrumb` | fait — avec données structurées `BreadcrumbList`, absentes du legacy |
| Partage social | AddThis + Google+ | partage natif ou rien | à arbitrer |
| Bouton « Imprimer » | feuille `print.css` + `window.print()` | styles `@media print` | à faire |
| Bouton flottant « Nous contacter » | mobile seulement | — | à arbitrer |

L'**accès client** est un lien sortant vers l'extranet H2I (`site.clientAreaUrl`),
pas une page de ce site. Il figure dans la barre de services et dans la carte
« Accès client » de l'accueil.

Le legacy avait quatre gabarits (accueil, classique, classique + sidebar, brut).
Le découpage App Router les remplace : une racine commune et des mises en page
par segment là où c'est nécessaire.

## 2. Accueil — `/`

Structure du legacy conservée dans son principe (`SPEC §3.10`), avec la carte
reportée au lot cartographie.

| Bloc | Composant | État |
|---|---|---|
| Héros + formulaire de recherche | `home/Hero`, `home/SearchForm` | fait |
| Diaporama | — | à faire (remplace `noviusos_slideshow`) |
| 3 appels à l'action : accès client, dépôt de dossier, recrutement | `home/ServiceCards` | fait |
| Les 4 métiers | `home/Activities` | fait |
| Aperçu des agences | `home/AgenciesTeaser` | fait — tient la place de la carte |
| Carte à épingles (vente / location / agences + compteurs) | — | à faire |
| Dernières actualités | `home/NewsSlider` | fait — lit encore `config/home.ts` ; à basculer sur `lib/news.ts` |
| Bande d'appel à l'action | `home/CtaBand` | fait |

## 3. Annonces

### 3.1 Recherche et résultats — `/offres`

Critères : transaction, localisation, type de bien, pièces (minimum), surface
minimum, budget min/max, chambres, référence. Voir `SPEC §3.2` pour le
comportement attendu et les deux corrections déjà actées
(`piecesMin`, budget indépendant de la transaction).

| Élément | État |
|---|---|
| Formulaire de recherche complet avec « plus de critères » | fait — `home/SearchForm` sur l'accueil, `offers/ResultsFilters` pré-rempli sur les résultats |
| Autocomplétion ville / code postal (référentiel communes) | à faire |
| Barre de tri : prix, surface, nombre par page | fait — `offers/SortBar` |
| Carte d'annonce : photo, badge exclusivité, titre calculé, secteur, prix + mention F.A.I. / C.C., description tronquée, surface, pictos d'équipement | fait — `offers/PropertyCard` ; photo en substitut tant que la médiathèque n'est pas triée |
| Pagination | fait — `offers/Pagination` |
| Carte à épingles, collante, synchronisée avec les résultats | à faire |
| Alerte e-mail : bouton + formulaire | à faire |
| État vide explicite | fait |

Le titre d'une annonce est **calculé** (`nature + pièces + surface`), il n'est pas
saisi. Le prix s'affiche `X XXX €` en vente et `X XXX € / mois` en location —
`lib/utils.ts` fournit déjà `formatPrice`, `formatRent` et `formatArea`.

En attendant l'API, le catalogue d'exemple est dans `data/properties.ts` et tout
le front y accède par `lib/properties.ts` : c'est le seul fichier à remplacer au
branchement. Les critères d'URL sont lus et réécrits par `lib/searchParams.ts`.

### 3.2 Fiche d'une annonce — `/offres/[reference]/[slug]`

`reference` est l'identifiant ConvertImmo, jamais un auto-incrément local : c'est
ce qui rend l'URL stable d'un import à l'autre.

| Élément | État |
|---|---|
| Titre, rue et ville, secteur | fait |
| Galerie photo (triée par ordre d'import) | fait — mosaïque, substitut tant que la médiathèque n'est pas triée |
| Visite virtuelle (lien) | fait |
| Descriptif | fait |
| Équipements : ascenseur, balcon, terrasse, cave, garage, parking, eau froide / chaude, chauffage, date de disponibilité | partiel — pictos et date de disponibilité ; eau et chauffage absents du type `Property` |
| **Numéro de rue masqué en location** | fait — `lib/properties.ts`, affichage ET données structurées |
| Encart prix *location* : loyer CC, loyer HC, charges, honoraires TTC, dépôt de garantie, mandat | fait — `offers/PriceSummary` |
| Encart prix *vente* : prix F.A.I., charges prévisionnelles annuelles, taxes foncières, mandat | partiel — prix F.A.I., honoraires et net vendeur ; charges et taxes absentes du type `Property` |
| **Encadrement des loyers** : loyer de base, loyer de référence majoré, complément | fait — `offers/LegalNotices` |
| **DPE et GES** : lettre + valeur, échelle réglementaire | fait — `offers/EnergyPerformance` |
| **Mention Géorisques** + lien vers georisques.gouv.fr | fait — `offers/LegalNotices` |
| Négociateur rattaché : nom, téléphone, e-mail | fait — `offers/NegotiatorCard`, données d'exemple |
| Appel à l'action « Déposer votre dossier » (location) | fait — bouton de l'encart prix |
| Simulateur d'assurance habitation (location) | à faire |
| Annonces similaires | fait — même transaction, même commune, surface proche |
| Carte de localisation + bascule « garages aux alentours » | à faire |
| Navigation précédent / suivant dans les résultats | à faire |
| Métadonnées : titre, description, image Open Graph | fait — `generateMetadata` + `RealEstateListing` |

Les mentions **DPE, GES, encadrement des loyers, honoraires et Géorisques** sont
des obligations d'affichage. Elles ne sont pas négociables et doivent être
traitées comme des composants à part entière, pas comme du texte d'habillage.

### 3.3 Alertes e-mail

Enregistrement d'une recherche avec un libellé et une adresse, puis envoi des
nouveautés. Le front n'a besoin que du formulaire, de la confirmation et du lien
de désinscription ; l'envoi est côté back-end — et le legacy ne l'envoyait pas
réellement (`SPEC §3.5`).

## 4. Agences

| Route | Contenu | État |
|---|---|---|
| `/agences` | cartes (photo, nom, adresse, téléphone, e-mail, description), carte à épingles | partiel — cartes et `RealEstateAgent` faits ; photo et carte à épingles au lot cartographie |
| `/agences/[slug]` | descriptif, contact, horaires, carte, lien vers le formulaire de contact **pré-rempli avec l'agence** | partiel — tout est fait sauf la carte ; le contact passe `?agence=<slug>` |

Données réelles déjà en dur dans `config/site.ts` : **3 agences** (la table legacy
en contenait 4, dont un doublon de Charpennes). Coordonnées GPS manquantes pour
Confluence, à géocoder.

## 5. Actualités

| Route | Contenu | État |
|---|---|---|
| `/actualites` | liste paginée, vignette, date, résumé | fait — vignettes reprises de `config/home.ts`, donc identiques au carrousel de l'accueil |
| `/actualites/[slug]` | article, retour au listing | fait — + `NewsArticle` et articles proches |
| `/actualites/rss` | flux RSS — **existait en production, à ne pas perdre** | fait — `app/actualites/rss/route.ts` ; l'ancienne URL `/actualité/rss` est à rediriger en 301 |

Les commentaires existaient (module Novius). À arbitrer : un site institutionnel
d'agence immobilière n'en a pas besoin, et ils coûtent une modération.

## 6. Formulaires

Trois formulaires, ~5 400 soumissions sur le legacy. Case de consentement
explicite sur les trois, à conserver (`SPEC §3.7`).

| Formulaire | Route | Champs | État |
|---|---|---|---|
| Contact / être rappelé | `/contact`, `/nous-ecrire`, `/etre-rappele` | prénom, nom, e-mail, téléphone, adresse de l'immeuble, objet (8 choix), message, « être rappelé(e) », consentement | partiel — formulaire et validation faits, acheminement à brancher |
| Projet immobilier | `/etre-rappele/projet-immobilier` | civilité, nom et prénom, e-mail, téléphone, nature du projet, type de bien, nombre de pièces, code postal, ville, message, « être rappelé(e) », consentement | partiel — formulaire et validation faits, acheminement à brancher |
| Candidature | `/recrutement` | prénom, nom, e-mail, **CV en pièce jointe**, consentement | partiel — formulaire et validation faits, stockage du CV à brancher |

Deux règles héritées : les fichiers déposés **ne sont pas servis directement par
le serveur web**, et aucune donnée personnelle ne transite par l'URL — le legacy
écrivait des leads depuis des paramètres GET, ce qui ne sera pas reproduit. Tout
passe ici par une Server Action en POST, et toute la validation est serveur.

**Rien n'est encore transmis.** Il n'y a ni transport e-mail ni stockage : les
actions de `app/actions.ts` valident la saisie et s'arrêtent sur un `TODO`. Les
trois pages l'affichent en clair ; ce bandeau doit disparaître en même temps que
les `TODO`, pas avant. Reste à faire côté back-end : acheminement vers l'agence,
limitation de débit par IP, stockage des pièces jointes hors racine web, et
journalisation horodatée du consentement.

## 7. Simulateur d'assurance habitation

Formulaire (type de bien, valeur du mobilier, nom, e-mail) et page de résultat
`/resultat-simulation` : trois tarifs — formule, pack, protection juridique —
chacun avec son explication dépliable, et un message de repli quand aucun palier
ne correspond. C'est un outil de captation de leads : chaque simulation est
enregistrée côté back-end. **à faire**

## 8. Dépôt de dossier locataire

Parcours multi-étapes avec pièces justificatives, sauvegarde et reprise par
e-mail. **Le code de ce module est absent de la livraison legacy** : il n'y a
rien à porter, tout est à spécifier (`SPEC §3.8`). En attendant, `/deposer-votre-dossier`
**est faite** : elle liste les pièces que le décret autorise à demander, dit ce
que nous en faisons, et renvoie vers le formulaire de contact. Le parcours
multi-étapes reste à arbitrer — il porte des données sensibles.

## 9. Pages éditoriales

Les quatre métiers, puis l'institutionnel et le légal.

| Route | Legacy | État |
|---|---|---|
| `/nos-services` | — (nouvelle page de rubrique) | fait |
| `/transaction` | `transaction.html` | fait |
| `/gestion-immobiliere` | `gestion-immobilière.html` | fait |
| `/syndic-de-copropriete` | `syndic-de-copropriété.html` | fait |
| `/courtage-d-assurances` | `courtage-d'assurances.html` | fait |
| `/presentation` | entrée de menu « Présentation » | fait |
| `/immobilier-vert` | entrée de menu « Imobilier Vert » (coquille corrigée) | fait |
| `/recrutement` | `candidature.html` | fait — voir §6 |
| `/tarifs` | `tarifs.html` — barème d'honoraires, affichage obligatoire | fait — montants fictifs, avertissement en tête de page |
| `/coordonnees-et-acces` | `coordonnées-et-accès.html` | fait |
| `/mentions-legales` | `mentions-légales.html` | partiel — trame complète, champs juridiques en « À COMPLÉTER » |
| `/politique-de-cookies` | `politique-de-cookies.html` | fait |
| `/cgu` | `cookies.html` (mal nommé dans le legacy) | fait |
| `/credits` | `crédits.html` | partiel — crédits de conception à compléter |
| `/liens` | `liens.html` | fait |
| `/plan-du-site` | entrée de menu, page jamais créée | fait — construit depuis `navigation.ts` et les données |
| politique de confidentialité | lien sortant vers declarations-juridiques.fr | à arbitrer — rédiger une page propre plutôt qu'un lien sortant |

Les textes sont du CONTENU DE REMPLISSAGE, isolés dans `data/editorial.ts`,
`data/services.ts` et `data/fees.ts`, et à faire relire par la maison. Les
champs qui ne peuvent pas être inventés — carte professionnelle, garant
financier, RCS, ORIAS, hébergeur — portent la mention « À COMPLÉTER » plutôt
qu'une valeur plausible, pour qu'on ne puisse pas les publier par mégarde.

## 10. Transverse

| Sujet | Décision |
|---|---|
| Cartographie | MapLibre + tuiles IGN, pas Google Maps (la clé du legacy était vide et la facturation à la charge est un piège). Trois usages : accueil, résultats, fiche. |
| Redirections 301 | Indispensable : les anciennes URLs contiennent accents, apostrophes et `m²` encodé `%C2%B2`. Principal risque SEO de la refonte. |
| Données structurées | `RealEstateListing` sur les fiches, `RealEstateAgent` sur les agences — absentes du legacy. |
| Images | Médiathèque legacy : 9 237 JPEG, certains de 6 à 7 Mo. Tri et recompression avant reprise. |
| Accessibilité | Audit RGAA. Le legacy construisait son en-tête en `<table>`. |
| Indexation | Bloquée dans `layout.tsx` jusqu'à la bascule. |

## 11. Écarté volontairement

Google+ et AddThis (services fermés), widgets Facebook et Twitter inertes,
Foundation 5 / jQuery / chosen / flexslider, site mobile distinct (`lib_mobile`)
remplacé par du responsive, carte en `<iframe>` vers `gmap.html`, page
`/tombola.html` (opération ponctuelle de 2021), pages de test
(`test02`, `test-03`, `test-maps`) et endpoints `ajax.html` exposés comme pages.
