# 🎯 DAMLEGEND - Guide Complet de Développement

DApp Crowdfunding sur Ethereum Sepolia testnet avec intégration PostgreSQL.

## 📋 Table des matières

1. [Étape 1: Configuration de l'environnement](#étape-1--configuration-de-lenvironnement)
2. [Étape 2: Configuration de la base de données](#étape-2--configuration-de-la-base-de-données)
3. [Étape 3: Déploiement des smart contracts](#étape-3--déploiement-des-smart-contracts)
4. [Étape 4: Lancement du backend](#étape-4--lancement-du-backend)
5. [Étape 5: Lancement du frontend](#étape-5--lancement-du-frontend)
6. [Étape 6: Tests et validation](#étape-6--tests-et-validation)

---

## Étape 1: 🔧 Configuration de l'environnement

### Prérequis
- Node.js 18+ installé
- PostgreSQL 13+ installé localement ou accessible en réseau
- MetaMask ou un autre portefeuille Ethereum
- Compte Infura pour les RPC URLs

### Installation des dépendances

```bash
npm install
```

### Configuration des variables d'environnement

Créer le fichier `.env.local` à la racine du projet avec:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/Finance"

# Blockchain RPC
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"

# Smart Contracts (à remplir après déploiement)
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS="0x..."

# Wallet de déploiement
PRIVATE_KEY="your_private_key_here"

# JWT Secret
JWT_SECRET="your_jwt_secret_key_at_least_32_characters"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CHAIN_ID="11155111"
```

⚠️ **SÉCURITÉ**: Ne jamais commiter le `.env.local` contenant des clés privées.

---

## Étape 2: 📊 Configuration de la base de données

### Créer la base de données PostgreSQL

```bash
# Accédez à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE "Finance" OWNER postgres;

# Quittez
\q
```

### Initialiser le schéma Prisma

```bash
# Créer et exécuter la migration
npx prisma migrate dev --name init_dapp_crowdfunding
```

Cela va:
- Créer toutes les tables dans PostgreSQL
- Générer le client Prisma

### Vérifier la base de données

```bash
# Accédez à la base
psql -U postgres -d Finance

# Lister les tables
\dt

# Quittez
\q
```

---

## Étape 3: 🚀 Déploiement des smart contracts

### Compiler les contrats

```bash
npx hardhat compile
```

Cela génère les ABIs dans `artifacts/contracts/`.

### Tester les contrats (Recommandé)

```bash
npx hardhat test
```

Exécute tous les tests Hardhat avec Chai (environ 1-2 minutes).

### Déployer sur Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Le script va:
1. Compiler les contrats
2. Déployer le Factory contract sur Sepolia
3. **Mettre à jour automatiquement** `.env.local` avec `NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS`

**Exemple de sortie attendue:**
```
✅ CrowdfundingFactory deployed to: 0xabc123...
✅ .env.local updated with NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS
```

### Vérifier le déploiement

Visitez https://sepolia.etherscan.io et cherchez votre adresse de contrat.

---

## Étape 4: 🔌 Lancement du backend

### Démarrer le listener blockchain (optionnel - fond)

Le listener écoute les événements blockchain et met à jour la DB:

```bash
npm run listener
```

Sortie attendue:
```
[Listener] Initializing blockchain event listeners...
[Listener] Found X active campaigns with contracts
[Listener] All blockchain listeners initialized
```

### Démarrer le serveur Next.js (backend API + frontend)

```bash
npm run dev
```

Cela démarre:
- **Backend API** sur `http://localhost:3000/api`
- **Frontend** sur `http://localhost:3000`

Vérifiez que l'API répond:
```bash
curl http://localhost:3000/api/categories
```

---

## Étape 5: 🎨 Lancement du frontend

Le frontend est servi par le même serveur Next.js que le backend API.

### Accéder à l'application

Ouvrez `http://localhost:3000` dans votre navigateur.

### Configuration MetaMask

1. Installez l'extension MetaMask
2. Créez ou importez un portefeuille
3. **Ajouter réseau Sepolia:**
   - Network Name: `Sepolia`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
   - Chain ID: `11155111`
   - Symbol: `ETH`
4. Obtenez des faucet SEP ETH:
   - https://sepolia-faucet.pk910.de/
   - https://www.infura.io/faucet/sepolia

### Flux d'utilisation

1. Connectez votre portefeuille (bouton "Connecter" en haut)
2. Signez le message (vérification MetaMask)
3. **Créer une campagne** (rôle créateur)
4. **Contribuer** à d'autres campagnes
5. **Voir le tableau de bord** avec vos statistiques

---

## Étape 6: ✅ Tests et validation

### Tests des smart contracts

```bash
npx hardhat test
```

Couverture complète:
- ✅ Création de campagnes
- ✅ Contributions (valides, invalides, edge cases)
- ✅ Retraits (conditions, permissions)
- ✅ Remboursements (individuels, batch)
- ✅ Annulation
- ✅ Factory

### Tests de l'API (optionnel)

```bash
# À implémenter avec Jest + Supertest
npm test
```

### Test manuel complet

1. **Inscription et profil:**
   - Connectez-vous
   - Vérifiez votre profil
   - Modifier les informations

2. **Créer une campagne:**
   - Titre, description, catégorie
   - Objectif ETH
   - Deadline
   - Vérifiez dans la DB

3. **Contribuer:**
   - Allez à une campagne
   - Contribuez depuis MetaMask
   - Vérifiez la transaction sur Etherscan
   - Vérifiez la DB mise à jour

4. **Remboursement (si deadline passée et objectif non atteint):**
   - Le CRON job (exécuté toutes les heures) appelle `refundAll()`
   - Les contributions sont marquées `refunded` en DB
   - Les notifications sont créées

5. **Retrait (si objectif atteint):**
   - Dépassez la deadline
   - Appelez `withdrawFunds()` depuis le contrat
   - Recevez les fonds sur votre portefeuille
   - Vérifiez la transaction sur Etherscan

---

## 🔒 Sécurité et règles absolues

### ❌ À NE PAS FAIRE

- ❌ Jamais de DELETE physique → toujours `UPDATE is_visible = false`
- ❌ Ne pas exposer `PRIVATE_KEY` → uniquement en `.env.local`
- ❌ Ne pas transférer ETH depuis le backend → uniquement contrats
- ❌ Ne pas créer d'endpoint signup admin → assignation manuelle en DB

### ✅ À TOUJOURS FAIRE

- ✅ Filtrer `WHERE is_visible = true AND is_active = true` publiquement
- ✅ Vérifier `is_active = true` à chaque connexion utilisateur
- ✅ Vérifier chainId Sepolia (11155111) et afficher alerte sinon
- ✅ Peupler `created_by` automatiquement du JWT userId
- ✅ Standardiser API: `{ success: boolean, data?, error? }`
- ✅ Tester exhaustivement avant le déploiement Sepolia

---

## 📁 Structure du projet

```
dapp-crowdfunding/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # Authentification MetaMask
│   │   ├── campaigns/        # CRUD campagnes
│   │   ├── contributions/    # Enregistrement contributions
│   │   ├── webhooks/         # Sync blockchain
│   │   ├── admin/            # Admin routes
│   │   └── ...
│   ├── campaigns/            # Pages campagnes
│   ├── dashboard/            # Dashboard utilisateur
│   ├── profile/              # Profil utilisateur
│   ├── admin/                # Admin dashboard
│   └── ...
├── components/               # Composants React
│   ├── Navbar.tsx            # Barre de navigation
│   └── ui/                   # Composants UI réutilisables
├── contracts/                # Smart contracts Solidity
│   ├── CrowdfundingCampaign.sol
│   ├── CrowdfundingFactory.sol
│   └── ...
├── hooks/                    # React hooks
│   ├── useWallet.ts          # Gestion MetaMask
│   └── useCampaign.ts        # Interaction contrats
├── lib/
│   ├── auth.ts               # Logique authentification
│   ├── prisma.ts             # Client Prisma singleton
│   ├── blockchain-listener.ts # Écoute événements
│   ├── refund-cron.ts        # CRON remboursements
│   ├── cron-scheduler.ts     # Gestionnaire CRON
│   ├── middleware.ts         # Helpers API
│   ├── abis/                 # ABIs smart contracts
│   │   ├── CrowdfundingFactory.json
│   │   └── CrowdfundingCampaign.json
│   └── ...
├── prisma/
│   ├── schema.prisma         # Schéma base de données
│   └── ...
├── scripts/
│   ├── deploy.js             # Déploiement Factory
│   └── ...
├── test/
│   └── crowdfunding.test.js  # Tests Hardhat
├── .env.local                # Variables d'environnement (NON commiter)
├── hardhat.config.js         # Configuration Hardhat
├── next.config.ts            # Configuration Next.js
├── tsconfig.json             # Configuration TypeScript
└── package.json              # Dépendances
```

---

## 🐛 Dépannage

### Erreur: "NEXT_PUBLIC_SEPOLIA_RPC_URL not configured"
→ Remplissez `.env.local` avec votre RPC URL Infura

### Erreur: "Connect ECONNREFUSED 127.0.0.1:5432"
→ PostgreSQL n'est pas en cours d'exécution. Démarrez-le:
```bash
# macOS/Linux avec Homebrew
brew services start postgresql

# Windows
net start PostgreSQL
```

### Erreur Prisma: "The datasource property `url` is no longer supported"
→ Assurez-vous que `DATABASE_URL` est présent dans `.env.local`

### MetaMask: "Chainide incorrect"
→ Ajoutez Sepolia dans MetaMask (voir Étape 5)

### Contrat non trouvé sur Etherscan
→ Attendez 20-30 secondes après le déploiement avant de chercher

---

## 📚 Ressources additionnelles

- **Ethereum Sepolia Testnet**: https://sepolia.etherscan.io
- **Infura**: https://infura.io (obtenir RPC URL)
- **MetaMask**: https://metamask.io
- **Solidity Docs**: https://docs.soliditylang.org
- **Ethers.js**: https://docs.ethers.org
- **Hardhat**: https://hardhat.org/docs
- **Prisma**: https://www.prisma.io/docs

---

## ✨ Prochaines étapes (Optionnel)

- 🧪 Ajouter tests API complets (Jest + Supertest)
- 📈 Implémenter dashboard admin avancé
- 🔐 Ajouter 2FA pour les admins
- 🎨 Améliorer l'interface utilisateur
- 📱 Optimiser pour mobile
- 🚀 Déployer sur Vercel/Netlify
- 🔗 Connecter à d'autres blockchains
- 💾 Archiver campagnes anciennes

---

**Créé pour DAMLEGEND - Crowdfunding DApp** 🎯
