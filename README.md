# Télésport — Jeux Olympiques

Application Angular qui présente les performances des pays aux Jeux olympiques : un dashboard avec le nombre de médailles par pays et une page de détail par pays.

## Prérequis

- Node.js 18 ou plus récent
- Angular CLI 18 (`npm install -g @angular/cli`)

## Installation et lancement

```bash
npm install
ng serve
```

Ouvrir ensuite `http://localhost:4200/`.

| Commande | Rôle |
|---|---|
| `ng serve` | serveur de développement |
| `ng build` | build de production dans `dist/` |
| `ng lint` | vérification du code (ESLint) |

## Fonctionnalités

- `/` : dashboard — nombre de pays, nombre de JO, camembert des médailles par pays, liste des pays.
- `/country/:id` : détail d'un pays — participations, total des médailles et des athlètes, courbe par édition, tableau des participations.
- Un id inconnu redirige vers `/not-found`.
- États de chargement, vide et erreur ; affichage responsive (desktop, tablette, mobile).

## Structure

```
src/app/
├── components/   composants réutilisables (header, graphiques)
├── pages/        pages reliées aux routes (dashboard, country-detail, not-found)
├── services/     DataService : accès aux données et calculs
└── models/       interfaces TypeScript
```

Les données sont simulées dans `src/assets/mock/olympic.json`.

## Documentation

- `ARCHITECTURE.md` : architecture, flux des données, patterns et décisions.
- `notes-architecture.md` : audit du starter, plan d'architecture et refactor réalisé.
