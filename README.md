# WheelsOn66 Front & Backend

## Présentation

**WheelsOn66** est une application mobile complète de gestion et planification de road trips, développée en **React Native** avec **Expo** pour le front-end, et un backend **Node.js/Express** avec **MongoDB** pour la gestion des données et l’authentification sécurisée via **JWT**.

L’application permet à chaque utilisateur de créer un compte, planifier ses voyages, gérer son matériel, personnaliser ses étapes sur carte, raconter ses histoires de voyage, et bien plus, le tout avec une interface moderne, multilingue (français/anglais) et un mode sombre/clair.

---

## Fonctionnalités principales

### Côté mobile (React Native + Expo)

- **Authentification sécurisée (JWT)**
  - Inscription, connexion, déconnexion.
  - Stockage du token JWT dans AsyncStorage pour sécuriser les requêtes API.
  - Redirection automatique selon l’état de connexion grâce à un hook personnalisé.
- **Gestion du profil**
  - Modification des informations personnelles et du mot de passe.
- **Planification de voyage**
  - Choix de la destination, nombre de jours, personnes, location de voiture.
  - Sélection ou personnalisation d’un road trip.
- **Gestion du matériel**
  - Ajout, modification, suppression de matériel à emporter.
  - Calcul automatique du budget.
- **Gestion des étapes**
  - Visualisation et personnalisation des étapes sur une carte interactive.
  - Ajout, renommage, suppression d’étapes.
- **Histoires de voyage**
  - Ajout, modification, suppression d’une histoire pour chaque voyage.
- **Multilingue**
  - Application traduite en français et anglais, toggle de langue global.
- **Mode sombre/clair**
  - Toggle pour passer du mode sombre au mode clair, mémorisé dans AsyncStorage.
- **UI moderne et responsive**
  - Boutons pills, design épuré, transitions douces, gestion du clavier, etc.

### Côté backend (Node.js/Express + MongoDB)

- **API REST sécurisée**
  - Toutes les routes protégées nécessitent un token JWT valide.
- **Gestion des utilisateurs**
  - Création de compte, connexion, modification du profil, changement de mot de passe.
- **Gestion des voyages**
  - Création, récupération, mise à jour, suppression de voyages.
  - Association d’un road trip prédéfini ou personnalisé.
  - Gestion du matériel, du budget, des étapes et des histoires de voyage.
- **Gestion des destinations et road trips**
  - Liste des destinations, suggestions de matériel, road trips prédéfinis avec étapes.
- **Sécurité**
  - Mot de passe hashé (bcrypt), vérification du token JWT sur chaque route protégée.

---

## Pourquoi des hooks personnalisés côté mobile ?

### 1. **useDarkMode**
- **Centralisation** : Permet d’avoir un état global du mode sombre, accessible et modifiable depuis n’importe quel composant.
- **Persistance** : Le choix de l’utilisateur est sauvegardé dans **AsyncStorage** pour être conservé même après fermeture de l’app.
- **API simple** : Retourne `darkMode`, `toggleDarkMode` et `setDark` pour une intégration facile dans tous les écrans.

### 2. **useAuthRedirect**
- **Sécurité** : Vérifie la présence d’un token JWT dans AsyncStorage à chaque chargement d’écran.
- **UX** : Redirige l’utilisateur vers la page de connexion s’il n’est pas authentifié, ou vers la page d’accueil s’il l’est déjà.
- **Centralisation** : Évite de dupliquer la logique de vérification dans chaque composant.

---

## Pourquoi l’authentification JWT ?

- **Sécurité** : Le JWT permet de s’assurer que chaque requête API est bien authentifiée, sans stocker de mot de passe côté client.
- **Stateless** : Le backend n’a pas besoin de stocker de session, tout est contenu dans le token.
- **Simplicité** : Le token est stocké dans AsyncStorage et envoyé dans les headers `Authorization` de chaque requête.
- **Déconnexion facile** : Il suffit de supprimer le token pour déconnecter l’utilisateur.

---

## Outils et technologies utilisés

### Frontend (Expo/React Native)
- **React Native** & **Expo** : Développement mobile multiplateforme rapide et moderne.
- **TypeScript** : Typage statique pour plus de robustesse.
- **i18n-js** & **expo-localization** : Gestion de la traduction et de la langue de l’appareil.
- **AsyncStorage** : Stockage local sécurisé (token JWT, préférences utilisateur).
- **React Navigation / Expo Router** : Navigation entre les écrans.
- **react-native-maps** : Affichage de la carte et gestion des étapes.
- **Custom Hooks** : Pour la gestion du thème et de l’authentification.
- **Composants personnalisés** : Pour une UI cohérente et réutilisable.

### Backend (Node.js/Express/MongoDB)
- **Express.js** : Framework web pour créer l’API REST.
- **MongoDB** & **Mongoose** : Base de données NoSQL et ORM.
- **jsonwebtoken** : Génération et vérification des tokens JWT.
- **bcryptjs** : Hashage sécurisé des mots de passe.
- **dotenv** : Gestion des variables d’environnement.
- **cors** : Autorisation des requêtes cross-origin.
- **Architecture MVC** : Séparation des routes, contrôleurs et modèles.

---

## Structure du projet

### Frontend
- `/app` : Tous les écrans principaux (`home.tsx`, `login.tsx`, `register.tsx`, etc.)
- `/app/component` : Composants réutilisables (`CustomButton.tsx`, `ToggleDarkMode.tsx`, etc.)
- `/hooks` : Hooks personnalisés (`useDarkMode.ts`, `useAuthRedirect.ts`)
- `/app/i18n.ts` : Fichier de configuration des traductions.
- `/assets` : Images de fond et autres ressources graphiques.

### Backend
- `/models` : Schémas Mongoose (`User.js`, `Trip.js`, `RoadTrip.js`, etc.)
- `/routes` : Routes Express pour chaque ressource (`userRoutes.js`, `tripRoutes.js`, etc.)
- `/controllers` : Logique métier (ex : `authController.js`, `tripController.js`)
- `/middleware` : Middlewares (authentification JWT, etc.)
- `/config` : Configuration de la base de données (`db.js`)
- `server.js` : Point d’entrée du serveur Express.

---

## Installation & Lancement

### Backend

1. **Installer les dépendances**
   ```sh
   npm install
   ```

2. **Configurer les variables d’environnement**
   - Crée un fichier `.env` à la racine du backend avec :
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

3. **Démarrer le serveur**
   ```sh
   node server.js
   ```
   Le serveur écoute sur `0.0.0.0:5001` par défaut.

### Frontend

1. **Installer les dépendances**
   ```sh
   npm install
   # ou
   yarn install
   ```

2. **Démarrer Expo**
   ```sh
   expo start
   ```

3. **Configurer l’API**
   - Vérifiez que l’adresse IP dans les fichiers (`home.tsx`, etc.) pointe bien vers votre backend.

4. **Tester sur un appareil ou un émulateur**
   - Scanner le QR code avec l’appli Expo Go ou lancer sur un simulateur.

---

## Personnalisation

- **Traductions** : Ajoutez vos propres clés dans `/app/i18n.ts` et utilisez `i18n.t('clé')` partout dans l’app.
- **Thème** : Modifiez les palettes dans les fichiers de styles ou dans les hooks.
- **API** : Adaptez les routes et le format des données selon votre backend.

---

## Sécurité

- **Le token JWT** est stocké uniquement côté client, jamais dans le code source.
- **Toutes les requêtes sensibles** passent par le header `Authorization: Bearer <token>`.
- **Mots de passe** hashés côté serveur avec bcrypt.
- **Vérification du token** sur chaque route protégée côté backend.

---

## Auteurs

- Projet développé par [Votre Nom ou Pseudo]

---

## Licence

Ce projet est open-source, sous licence MIT.

---

**Bon road trip avec WheelsOn66Front ! 🚗🌎**
