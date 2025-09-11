# 📦 Modules Natifs Pré-compilés

## 🎯 Objectif

Ce dossier contient les modules natifs pré-compilés pour éviter les problèmes de compilation sur GitHub Actions.

## 🔧 Génération des Modules

### Prérequis
- macOS (Intel ou Apple Silicon)
- Node.js 18.x
- Xcode Command Line Tools

### Commandes
```bash
cd projet-gestion-maitre
node generate-precompiled-modules.js
```

## 📁 Structure

```
precompiled-modules/
└── darwin-x64/
    ├── better-sqlite3/
    │   ├── build/
    │   └── package.json
    └── bcrypt/
        ├── build/
        ├── lib/
        └── package.json
```

## 🚀 Utilisation dans GitHub Actions

Le workflow copie automatiquement ces modules dans `node_modules/` :

```yaml
- name: Use pre-compiled native modules
  run: |
    npm ci --ignore-scripts
    cp -r precompiled-modules/darwin-x64/* node_modules/
```

## ✅ Avantages

- ✅ **Builds ultra-rapides** (pas de compilation)
- ✅ **Pas de dépendance** aux outils de compilation
- ✅ **Reproductibilité garantie**
- ✅ **Contourne tous les problèmes** de GitHub Actions

## 🔄 Mise à Jour

Régénérez les modules après chaque mise à jour de dépendances :

```bash
npm update
node generate-precompiled-modules.js
git add precompiled-modules/
git commit -m "update: Regenerate precompiled native modules"
```
