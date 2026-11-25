# Architecture — Télésport (pages « Jeux Olympiques »)

Application Angular 18 (NgModule) qui affiche les performances des pays aux Jeux olympiques : un dashboard (camembert des médailles par pays) et une page de détail par pays (indicateurs + courbe d'évolution).

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
│   └── not-found/         Route `/not-found` et toute URL inconnue
├── services/
│   └── data.service.ts    Seul point d'accès aux données + calculs métier
├── models/                Interfaces TypeScript (Olympic, Participation, Indicator, CountrySummary)
├── app-routing.module.ts
└── app.module.ts
```

## Flux des données

```
assets/mock/olympic.json   (demain : API REST)
        │
        ▼
DataService                getOlympics(), getOlympicById(id), calculs (totaux, nombre de JO)
        │  Observable<Olympic[]> typé
        ▼
Pages (smart)              s'abonnent, gèrent loading / empty / error, préparent les données
        │  input()                         ▲ output()
        ▼                                  │
Composants (dumb)          affichent ce qu'ils reçoivent, signalent les clics
```

Les données descendent des pages vers les composants (`input()`), les événements remontent des composants vers les pages (`output()`).

## Patterns utilisés

| Pattern | Où | Bénéfice |
|---|---|---|
| Singleton | `DataService` (`providedIn: 'root'`) | une seule instance, une seule source de données |
| Séparation composant / service | pages ↔ `DataService` | les pages ne connaissent ni l'URL ni `HttpClient` |
| Smart / dumb (conteneur / présentation) | `pages/` ↔ `components/` | composants réutilisables et faciles à tester |
| Injection de dépendances | constructeurs | les dépendances sont fournies par Angular, remplaçables en test |

## Décisions

- **Signals pour les composants** (`input()`, `output()`, `viewChild.required()`) : API recommandée depuis Angular 17, validée par le mentor ; `viewChild.required` remplace l'assertion `!`.
- **Route `/country/:id`** plutôt que par nom : URL stables (pas d'espaces ni de casse) ; un id inconnu ou non numérique redirige vers `/not-found`.
- **Graphiques créés dans un `@if`** : ils ne sont construits qu'une fois les données arrivées, et détruits dans `ngOnDestroy`.
- **États** : chargement (« Loading data… »), vide (« No data available. »), erreur (message clair + « Try again » ou « Back to dashboard »).
- **Responsive** : grille CSS 12 colonnes (≥ 1200px, contenus côte à côte), 8 colonnes (768–1199px, graphique pleine largeur), 4 colonnes (≤ 767px, pile verticale).
- **Accessibilité** : un `<h1>` par page, `role="img"` et `aria-label` décrivant les données des graphiques, liste de pays et tableau des participations utilisables au clavier, focus visible, contrastes AA.

## Intégrer un vrai back-end

Remplacer l'URL `olympicUrl` dans `DataService` par l'endpoint de l'API (idéalement via `environment.ts`). Les pages et les composants ne changent pas : ils ne dépendent que des interfaces de `models/`, qui servent de contrat avec l'API.
