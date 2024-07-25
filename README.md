# SneakPeak

![SneakPeak](./docs/home.png)

SneakPeak est un site de e-commerce fictif proposant des baskets de marques réputées, vendues et expédiées en France métropolitaine.  

Ce projet a été réalisé en 4e année d'Ingénierie du Web à l'ESGI Paris, dans le cadre du second challenge semestriel de l'année 2023 - 2024. Il concerne les modules suivants :
- Vue.js avec TypeScript
- Node.js, MongoDB
- Droit de l'informatique & RGPD

Ce projet contient également des tests unitaires et d'intégration pour l'API.

## Membres du groupe n°10

- LANIKPEKOUN Cheick
- LOPEZ Frédéric
- MALONZO Ryan
- MECHMECHE Fayssal

## Environnement technique

- PostgreSQL pour les opérations d'écriture de données
- MongoDB pour les opérations de lecture et de recherche de données
- Vue.js pour l'application web, en utilisant TypeScript
- Express pour l'API, en utilisant Sequelize, Mongoose et TypeScript
  - Tests unitaires réalisés avec Chai (assertion library) et Sinon.JS (stubs, mocks)
  - Tests d'intégration réalisés avec Chai et Supertest

## Services utilisés par l'application

- Postmark pour l'envoi de mails transactionnels
- Stripe pour la simulation et la gestion des paiements sur la boutique
- Geoapify pour la complétion automatique des adresses postales de livraison et de facturation

## Outils utilisés pour la réalisation du projet

- Docker Compose
- GitHub Actions
- Heroku
- Bruno
- Jira Software
- Figma
- Notion

## Pages et fonctionnalités réalisées

- Accueil
  - Apparence générale : Fayssal
  - Récupération et affichage des données : Ryan 
- Authentification
  - Inscription avec confirmation par mail : Cheick, Ryan
  - Connexion : Cheick, Ryan
  - Réinitialisation du mot de passe : Cheick, Ryan
  - Recommandations de la CNIL
    - Vérification de la robustesse du mot de passe : Cheick
    - Temporisation d'accès au compte après trois tentatives infructueuses et notification par mail : Ryan
    - Demande de renouvellement du mot de passe tous les 60 jours : Fayssal
    - Hachage des mots de passe : Ryan
- Recherche de produits
  - Apparence générale : Cheick (design), Ryan (intégration)
  - Recherche via saisie utilisateur (nom d'un produit, description et partage d'URL) : Ryan
  - Recherche à facettes (filtrage par nom, catégorie, marque, prix minimum et maximum...) : Ryan
- Vue produit
  - Apparence générale : Frédéric
  - Affichage des différentes couleurs d'une basket : Frédéric
  - Affichage des tailles disponibles par couleur : Frédéric
- Profil
  - Apparence générale : Fayssal (design), Ryan (intégration)
  - Modification des informations personnelles : Ryan
  - Modification des adresses : Fayssal, Ryan
  - Téléchargement des données personnelles : Ryan
  - "Suppression" du compte (anonymisation) : Ryan
- Panier avec système de réservation : Fayssal
- Paiement
  - Intégration de Stripe : Fayssal
  - Création de liens de paiement uniques : Fayssal
  - Remboursement avec facture d'avoir : Fayssal
- Suivi de livraison : Fayssal
- Historique des commandes
  - Demande de facturation : Fayssal
  - Demande de retour produit : Fayssal
  - Recherche : Fayssal
  - Commander à nouveau : Fayssal
- Panel d'administration (Back office)
  - Apparence générale : Cheick
  - Gestion des commandes : Fayssal
  - Gestion des baskets : Frédéric, Ryan
  - Gestion des catégories : Ryan
  - Gestion des marques : Ryan
  - Gestion des couleurs : Ryan
  - Gestion des variantes de baskets : Frédéric
  - Gestion du stock : Fayssal
- Alerte par mail au gestionnaire de stocks en fin de stock d'un produit : Fayssal
- Conditions générales d'utilisation : Ryan
- Conditions générales de vente : Ryan
- Politique de confidentialité : Fayssal
- Politique de cookies : Cheick

## Contraintes respectées

- Vue.js avec TypeScript
  - Composant bouton pour l'affichage d'une invite de confirmation avec suppression d'une donnée : Cheick
  - Composable de gestion de formulaire : Ryan
  - Composant de tableau de données : Ryan
- Node.js, MongoDB
  - Processus de dénormalisation SQL vers MongoDB : Fayssal, Frédéric
  - Authentification JWT : Frédéric, Ryan
  - Système de migration SQL : Ryan
- Droit de l'informatique & RGPD
  - Pop-up d'information sur les cookies : Fayssal

## Autres (aspects techniques)

- Endpoints CRUD pour les différentes ressources de l'API : Fayssal, Frédéric, Ryan
- Middleware de vérification des schémas de corps de requête (payload) : Ryan
- Middleware de vérification d'authentification : Ryan
- Middlewares de vérifications de permissions : Fayssal, Ryan
- Middleware de pagination : Ryan
- Génération de fixtures avec Faker : Fayssal

## Installation

### Prérequis

Pour démarrer ce projet, il est recommandé d'utiliser [Docker Compose](https://docs.docker.com/compose/).

Les variables d'environnement suivantes sont également nécessaires (à ajouter dans un fichier `.env` à la racine du projet en cas d'utilisation de Docker Compose) :

| Variable d'environnement | Description | Valeur (Docker Compose) |
| -------------- | --------------- | -------------- |
| DATABASE_URL | La chaîne de connexion à la base de données PostgreSQL | postgres://robin:batman@postgres:5432/sneakpeak |
| API_URL | L'adresse URL vers l'API Express de ce projet | http://localhost:3000 |
| VITE_API_URL | L'adresse URL vers l'API Express de ce projet | http://localhost:3000 |
| WEBAPP_URL | L'adresse URL vers l'application web de ce projet | http://localhost:5173 |
| MONGODB_URI | La chaîne de connexion à la base de données MongoDB | mongodb://robin:batman@mongo:27017 |
| JWT_SECRET | La chaîne de caractères secrète servant à signer les jetons JWT pour l'authentification | <votre_secret> |
| POSTMARK_SERVER_API_TOKEN | La clé API Postmark pour l'envoi de mails | <votre_cle_api_postmark> |
| STRIPE_SECRET_KEY | La clé API Stripe pour la simulation et la gestion des paiements | <votre_cle_api_stripe> |
| STRIPE_WEBHOOK_SECRET | La chaîne secrète pour authentifier les appels webhook de Stripe | (Affichée dans la console lors du démarrage de l'application) |
| VITE_GEOAPIFY_API_KEY | La clé API Geoapify pour l'autocomplétion des adresses postales | <votre_cle_api_geoapify> |

### Démarrage de l'application

Pour démarrer l'application avec Docker Compose, il suffit d'exécuter la commande suivante depuis le répertoire du projet :

```sh
docker compose up -d
```
