# 📸 MY_SNAPCHAT

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)


**Une application de partage de photos inspirée de Snapchat**

*Développée par Anouar  et Arnaud *

[Demo](#-demo) • [Installation](#-installation) • [Fonctionnalités](#-fonctionnalités) • [Architecture](#-architecture)

</div>

---

## 🎯 **À Propos**

MY_SNAPCHAT est une application mobile moderne qui permet aux utilisateurs d'envoyer des photos  à leurs amis. Développée avec React Native et TypeScript, elle offre une expérience utilisateur fluide et intuitive similaire à Snapchat.

### ✨ **Fonctionnalités Principales**

- 📱 **Interface Native** - Expérience utilisateur optimisée iOS/Android
- 📸 **Capture Photo** - Caméra intégrée avec flash et mode selfie
- ⏱️ **Messages Éphémères** - Photos avec timer de 1 à 10 secondes
- 👥 **Système d'Amis** - Gestion des contacts et envoi de snaps
- 🔒 **Authentification** - Inscription et connexion sécurisées
- 📊 **Profil Utilisateur** - Gestion complète du profil
- 🎨 **Stories** - Partage de moments avec timeline

---

## 🚀 **Demo**

### 📱 **Captures d'Écran**

<div align="center">

| Accueil | Caméra | Messages | Profil |
|---------|--------|----------|--------|
| ![Home](https://via.placeholder.com/200x400/667eea/ffffff?text=Home) | ![Camera](https://via.placeholder.com/200x400/764ba2/ffffff?text=Camera) | ![Messages](https://via.placeholder.com/200x400/4CAF50/ffffff?text=Messages) | ![Profile](https://via.placeholder.com/200x400/FF6B6B/ffffff?text=Profile) |

</div>

### 🎬 **Démo Vidéo**

> 📹 *GIFF*

```
[Insérer GIF démontrant le flux complet]
```

---

## 🛠️ **Installation**

### **Prérequis**

- Node.js (≥ 16.0.0)
- npm ou yarn
- Expo CLI
- Xcode (pour iOS) / Android Studio (pour Android)

### **Configuration**

```bash
# Cloner le repository
git clone  git clone git@github.com:EpitechWebAcademiePromo2026/W-JSC-502-MLN-2-1-snapchat-arnaud.mazoire.git


cd my_snapchat

# Installer les dépendances
npm install
# ou
yarn install

# Lancer l'application
npx expo start

# Pour iOS
npx expo start --ios

# Pour Android
npx expo start --android
```

### **Variables d'Environnement**

```bash
# Créer un fichier .env
API_BASE_URL=https://snapchat.epihub.eu
API_KEY=REDACTED_API_KEY
```

---

## 🏗️ **Architecture**

### **Structure du Projet**

```
src/
├── 📁 assets/              # Ressources (images, fonts)
├── 📁 components/          # Composants réutilisables
│   ├── OptimizedInput.tsx
│   └── VideoBackground.tsx
├── 📁 constants/           # Constantes et configuration
│   ├── Colors.ts
│   └── Config.ts
├── 📁 contexts/            # Contextes React (Auth, etc.)
│   └── AuthContext.tsx
├── 📁 screens/             # Écrans de l'application
│   ├── 📁 Home/
│   │   ├── index.tsx
│   │   └── 📁 components/
│   │       ├── ChatPageComponent.tsx
│   │       ├── CameraPageComponent.tsx
│   │       ├── StoriesPageComponent.tsx
│   │       └── BottomNavComponent.tsx
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── ProfileScreen.tsx
│   └── EditProfileScreen.tsx
├── 📁 services/            # Services API
│   └── ApiService.ts
└── 📁 types/               # Types TypeScript
    └── index.ts
```

### **Technologies Utilisées**

| Technologie | Version | Description |
|-------------|---------|-------------|
| React Native | 0.79.3 | Framework mobile |
| TypeScript | 5.1.3 | Langage typé |
| Expo | 53.0.11 | Plateforme de développement |
| React Navigation | 6.1.7 | Navigation |
| Expo Camera | 16.1.7 | Caméra native |
| Axios | 1.5.0 | Client HTTP |
| AsyncStorage | 2.1.2 | Stockage local |

---

## 📋 **Fonctionnalités Détaillées**

### ✅ **Authentification**
- [x] Inscription avec email, username, mot de passe et date de naissance
- [x] Connexion sécurisée
- [x] Gestion des sessions
- [x] Déconnexion

### ✅ **Capture et Envoi**
- [x] Caméra native avec flash
- [x] Mode selfie/caméra arrière
- [x] Sélection depuis la galerie
- [x] Choix de la durée d'affichage (1-10s)
- [x] Envoi à des amis sélectionnés

### ✅ **Réception et Visualisation**
- [x] Liste des snaps reçus
- [x] Visualisation avec timer
- [x] Marquage automatique comme "vu"
- [x] Suppression après visualisation

### ✅ **Gestion de Profil**
- [x] Modification des informations
- [x] Changement de mot de passe
- [x] Suppression de compte
- [x] Photo de profil

---

## 🔧 **API & Backend**

### **Endpoints Utilisés**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/user` | Inscription |
| `PUT` | `/user` | Connexion |
| `PATCH` | `/user` | Modifier profil |
| `DELETE` | `/user` | Supprimer compte |
| `GET` | `/snap` | Récupérer snaps |
| `POST` | `/snap` | Envoyer snap |
| `PUT` | `/snap/seen/{id}` | Marquer comme vu |

### **Format des Données**

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  date?: string;
}

interface Snap {
  id: string;
  from: string;
  to: string;
  image: string;
  duration: number;
  createdAt: string;
  seen: boolean;
}
```

---

## 🧪 **Tests & Qualité**

### **Statut des Tests**

- [ ] Tests unitaires (Jest)
- [ ] Tests d'intégration (Detox)
- [ ] Tests E2E
- [x] Validation TypeScript
- [x] Linting ESLint

### **Performance**

- ✅ **Optimisation Images** - Compression automatique
- ✅ **Lazy Loading** - Chargement progressif
- ✅ **Cache API** - Mise en cache des requêtes
- ✅ **Bundle Size** - Optimisé pour production

---

## 🎨 **Design System**

### **Palette de Couleurs**

```css
--primary: #667eea
--secondary: #764ba2
--success: #4CAF50
--error: #FF6B6B
--background: #000000
--surface: #1c1c1e
--text: #FFFFFF
--text-secondary: #8E8E93
```

### **Typographie**

- **Titres**: SF Pro Display (iOS) / Roboto (Android)
- **Corps**: SF Pro Text (iOS) / Roboto (Android)
- **Tailles**: 12px, 14px, 16px, 18px, 20px, 24px

---

## 👥 **Équipe**

<div align="center">

| Développeur | Rôle | GitHub |
|-------------|------|--------|
| **Anouar Khali** | Lead Developer | [@AnouarKhali](https://github.com/username) |
| **Arnaud Mazoire** | Frontend Developer | [@ArnaudMazoire](https://github.com/username) |

</div>

---


---

## 📞 **Contact**

**Anouar Khali** - anouar.khali-bouriz@epitech.eu

**Lien du Projet**: https://github.com/anouar.khali/my_snapchat

---

<div align="center">

**⭐ Star ce repo si il t'a aidé ! ⭐**


</div>

