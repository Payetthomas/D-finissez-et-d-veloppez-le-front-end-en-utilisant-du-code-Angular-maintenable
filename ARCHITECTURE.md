# Architecture — Télésport (pages « Jeux Olympiques »)

Application Angular 18 (NgModule) qui affiche les performances des pays aux Jeux olympiques : un dashboard (camembert des médailles par pays) et une page de détail par pays (indicateurs + courbe d'évolution).

## Sommaire

1. [Arborescence](#arborescence)
2. [Composants et rôles](#composants-et-rôles)
3. [Le service `DataService`](#le-service-dataservice)
4. [Flux des données](#flux-des-données)
5. [Patterns utilisés](#patterns-utilisés)
6. [Décisions](#décisions)
7. [Intégrer un vrai back-end](#intégrer-un-vrai-back-end)

## Arborescence

```
src/app/
├── components/            Composants réutilisables (présentation, « dumb »)
│   ├── header/            Titre de page + liste d'indicateurs
│   ├── medals-pie-chart/  Camembert des médailles par pays (Chart.js)
│   └── medals-line-chart/ Courbe des médailles par édition (Chart.js)
├── pages/                 Pages reliées à une route (conteneurs, « smart »)
│   ├── dashboard/         Route `/`
│   ├── country-detail/    Route `/country/:id`
│   └── not-found/         Route `/not-found` et toute URL inconnue (`**`)
├── services/
│   └── data.service.ts    Seul point d'accès aux données + calculs métier
├── models/                Interfaces TypeScript (aucun `any`)
│   ├── olympic.model.ts          Pays + participations (forme du JSON)
│   ├── participation.model.ts    Une édition des JO pour un pays
│   ├── indicator.model.ts        Un indicateur du header (libellé + valeur)
│   └── country-summary.model.ts  Un pays et son total de médailles
├── app-routing.module.ts
└── app.module.ts
```

## Composants et rôles

### Pages (smart)

| Page | Route | Rôle |
|---|---|---|
| `DashboardComponent` | `/` | Charge tous les pays via le service, calcule les indicateurs (nombre de pays, nombre de JO), affiche le camembert et la liste des pays, navigue vers `/country/:id` au clic |
| `CountryDetailComponent` | `/country/:id` | Lit l'id avec `ActivatedRoute`, charge le pays via le service, affiche 3 indicateurs, la courbe et le tableau des participations ; redirige vers `/not-found` si le pays n'existe pas |
| `NotFoundComponent` | `/not-found`, `**` | Message clair et bouton de retour au dashboard |

Chaque page gère trois états : chargement, données vides et erreur (message compréhensible, jamais technique).

### Composants réutilisables (dumb)

| Composant | Entrées (`input()`) | Sortie (`output()`) | Rôle |
|---|---|---|---|
| `HeaderComponent` | `title`, `indicators` | — | Affiche le titre (`<h1>`) et itère sur les indicateurs |
| `MedalsPieChartComponent` | `labels`, `values` | `countrySelected` (index) | Dessine le camembert, signale le pays cliqué |
| `MedalsLineChartComponent` | `years`, `medals` | — | Dessine la courbe d'évolution |

Ces composants n'injectent aucun service : ils affichent ce qu'on leur donne. Les graphiques sont détruits dans `ngOnDestroy` et décrivent leurs données aux lecteurs d'écran (`aria-label` calculé avec `computed()`).

## Le service `DataService`

`DataService` (`providedIn: 'root'`) est le **seul** endroit qui connaît la source des données (`assets/mock/olympic.json`).

| Méthode | Retour | Rôle |
|---|---|---|
| `getOlympics()` | `Observable<Olympic[]>` | Tous les pays |
| `getOlympicById(id)` | `Observable<Olympic \| undefined>` | Un pays, ou `undefined` s'il n'existe pas |
| `getTotalMedals(olympic)` | `number` | Total des médailles d'un pays |
| `getTotalAthletes(olympic)` | `number` | Total des athlètes d'un pays |
| `getNumberOfJOs(olympics)` | `number` | Nombre d'éditions distinctes |

Les pages s'abonnent avec `.pipe(takeUntilDestroyed(this.destroyRef))` : l'abonnement est coupé automatiquement quand la page est détruite.

## Flux des données

```
assets/mock/olympic.json   (demain : API REST)
        │
        ▼
DataService                getOlympics(), getOlympicById(id), calculs
        │  Observable typé
        ▼
Pages (smart)              s'abonnent, gèrent loading / empty / error
        │  input()                         ▲ output()
        ▼                                  │
Composants (dumb)          affichent, signalent les clics
```

Les données descendent des pages vers les composants (`input()`), les événements remontent des composants vers les pages (`output()`).

## Patterns utilisés

| Pattern | Où | Bénéfice |
|---|---|---|
| Singleton | `DataService` (`providedIn: 'root'`) | une seule instance, une seule source de données |
| Observer | `Observable` RxJS + `subscribe` | les pages réagissent à l'arrivée des données, sans savoir d'où elles viennent |
| Séparation composant / service | pages ↔ `DataService` | les pages ne connaissent ni l'URL ni `HttpClient` |
| Smart / dumb (conteneur / présentation) | `pages/` ↔ `components/` | composants réutilisables et faciles à tester |
| Injection de dépendances | constructeurs | dépendances fournies par Angular, remplaçables dans les tests |

## Décisions

- **Signals pour les composants** (`input()`, `output()`, `viewChild.required()`) : API recommandée depuis Angular 17 ; `viewChild.required` remplace l'assertion `!`.
- **Route `/country/:id`** plutôt que par nom : URL stables ; un id inconnu ou non numérique redirige vers `/not-found`.
- **Graphiques créés une fois les données arrivées** (`@if` / `@else`), et détruits dans `ngOnDestroy`.
- **Responsive** : grille CSS 12 colonnes (≥ 1200px, contenus côte à côte), 8 colonnes (768–1199px, graphique pleine largeur), 4 colonnes (≤ 767px, pile verticale).
- **Accessibilité** : un `<h1>` par page, `aria-label` sur les graphiques, liste de pays et tableau utilisables au clavier, focus visible, contrastes AA.

## Intégrer un vrai back-end

Remplacer `olympicUrl` dans `DataService` par l'endpoint de l'API (idéalement via `environment.ts`). Si l'API renvoie la même forme que les interfaces de `models/`, **aucune page ni aucun composant ne change** : les interfaces servent de contrat entre le front-end et l'API. Si la forme diffère, l'adaptation se fait dans le service (avec un `map` RxJS), jamais dans les composants.
