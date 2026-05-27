# 📚 Guide de Déploiement et Configuration

## 🚀 Étapes de Mise en Route

### Phase 1: Setup Initial

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env.local
cp .env.example .env.local

# 3. Configurer les variables d'environnement (voir section ci-dessous)
```

### Phase 2: Smart Contracts

```bash
# 1. Compiler les contrats
npm run hardhat:compile

# 2. Exécuter les tests (optionnel mais recommandé)
npm run test

# 3. Déployer sur Sepolia
npm run hardhat:deploy

# 4. Vérifier les contrats sur Etherscan Sepolia (optionnel)
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Phase 3: Base de Données

```bash
# 1. Créer les tables dans PostgreSQL
npx prisma migrate dev --name init_dapp_crowdfunding

# 2. Visualiser la base avec Prisma Studio (optionnel)
npx prisma studio

# 3. Seeder les catégories initiales (optionnel)
node scripts/seed-categories.js
```

### Phase 4: Démarrage de l'Application

**Terminal 1 - Application Next.js:**
```bash
npm run dev
# L'app est accessible sur http://localhost:3000
```

**Terminal 2 - Blockchain Event Listener:**
```bash
npm run listener
# Écoute les événements blockchain et met à jour la DB
```

**CRON Job - Remboursements Automatiques:**
Le job s'exécute automatiquement toutes les heures via `node-cron` (intégré à l'app Next.js).

---

## 🔧 Variables d'Environnement (.env.local)

```env
# === PostgreSQL ===
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/Finance"

# === Blockchain (Sepolia) ===
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS="0x..." # Address du CrowdfundingFactory après déploiement

# === Wallet Privée (Déploiement) ===
PRIVATE_KEY="0x..." # Clé privée du compte de déploiement

# === JWT ===
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# === Application ===
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comment Récupérer les Valeurs?

**NEXT_PUBLIC_SEPOLIA_RPC_URL:**
1. Aller sur [Infura.io](https://infura.io)
2. Créer un compte et un projet
3. Copier la clé RPC pour Sepolia

**PRIVATE_KEY:**
- Ouvrir MetaMask
- Menu → Paramètres → Compte → Exporter la clé privée
- ⚠️ Ne jamais committer cette clé!

**NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS:**
- Après le déploiement, le script met à jour automatiquement le .env.local
- Sinon, voir l'output du `npm run hardhat:deploy`

---

## 🧪 Tests

### Exécuter les Tests Smart Contracts

```bash
# Exécuter tous les tests
npm run test

# Exécuter un test spécifique
npx hardhat test test/crowdfunding.test.js

# Mode watch (re-exécution automatique)
npm run test:watch
```

### Structure des Tests

Les tests couvrent:
- ✅ Création de campagne (paramètres valides/invalides)
- ✅ Contributions (montants normaux, edge cases, propriétaire)
- ✅ Retrait de fonds (conditions requises)
- ✅ Remboursements (individuels et collectifs)
- ✅ Annulation de campagne
- ✅ Factory de création de contrats

---

## 📡 Architecture Blockchain

### Flow de Contribution

```
1. Frontend: L'utilisateur clique "Contribuer"
   ↓
2. Smart Contract: Appel à campaign.contribute() via ethers.js
   ↓
3. MetaMask: Demande de signature et confirmation
   ↓
4. Blockchain: Émission de l'événement ContributionReceived
   ↓
5. Listener: Reçoit l'événement via ethers.js
   ↓
6. Database: Met à jour contributions, campaigns, notifications
   ↓
7. Frontend: Actualise l'UI (nouveau montant, notification)
```

### Events Écoutés par le Listener

| Événement | Action |
|-----------|--------|
| **ContributionReceived** | Mise à jour contribution + campagne + notification créateur |
| **FundsWithdrawn** | Marquer campagne comme fermée + notifier créateur |
| **RefundIssued** | Marquer contribution comme remboursée + notifier contributeur |
| **CampaignCancelled** | Marquer campagne comme annulée + notifier créateur |

### CRON Job: Remboursements Automatiques

**Timing:** Toutes les heures (00:00 UTC)

**Logique:**
```sql
SELECT * FROM campaigns 
WHERE status = 'active' 
AND deadline < NOW() 
AND current_amount < goal_amount
AND is_active = true
```

Pour chaque campagne trouvée: appel à `contract.refundAll()`

---

## 🔐 Authentification

### Flow MetaMask

```
1. Utilisateur clique "Connecter Wallet"
   ↓
2. Frontend: Demande un nonce à /api/auth/nonce
   ↓
3. MetaMask: Pop-up de signature avec message
   ↓
4. Frontend: Envoie signature à /api/auth/connect
   ↓
5. Backend: Vérifie signature avec ethers.verifyMessage()
   ↓
6. Database: Crée/met à jour l'utilisateur
   ↓
7. Response: JWT token
   ↓
8. Frontend: Stocke JWT en localStorage
   ↓
9. Requêtes futures: JWT en header Authorization
```

---

## 🛠️ Dépannage

### Erreur: "The datasource.url property is required"

**Solution:** Vérifier que DATABASE_URL est correctement défini dans .env.local

```bash
# Tester la connexion PostgreSQL
npx prisma db push --skip-generate
```

### Erreur: "RPC URL not configured"

**Solution:** Ajouter NEXT_PUBLIC_SEPOLIA_RPC_URL au .env.local

```env
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
```

### Listener ne reçoit pas les événements

**Causes possibles:**
1. Contrats pas déployés (vérifier NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS)
2. RPC URL invalide
3. Campagnes sans contract_address en DB

**Solution:**
```bash
# Vérifier les contrats déployés
npx hardhat run scripts/verify-contracts.js --network sepolia

# Redémarrer le listener
npm run listener
```

### MetaMask: "User rejected the request"

L'utilisateur a cliqué "Annuler" sur le pop-up de signature. C'est normal, laisser l'utilisateur réessayer.

---

## 📊 Prisma Studio

Pour visualiser et modifier les données en BD:

```bash
npx prisma studio
# Ouvre http://localhost:5555
```

---

## 🚢 Déploiement en Production

### Vercel (Next.js)

```bash
# 1. Push le code sur GitHub
git push origin main

# 2. Connecter le repo sur Vercel
# vercel.com → Import Project → Sélectionner le repo

# 3. Configurer les variables d'environnement
# Vercel Dashboard → Settings → Environment Variables
# Ajouter: DATABASE_URL, NEXT_PUBLIC_SEPOLIA_RPC_URL, JWT_SECRET, etc.

# 4. Déployer
# Vercel auto-déploie au push sur main
```

### Smart Contracts

```bash
# Déployer sur Sepolia
npm run hardhat:deploy

# Vérifier sur Etherscan (optionnel mais recommandé)
npx hardhat verify --network sepolia 0xYourContractAddress

# Mainnet (Production) - ⚠️ À faire avec prudence
npx hardhat run scripts/deploy.js --network mainnet
```

### Listener en Production

Pour maintenir le listener actif en production, utiliser:
- **Railway.app** - Héberger le listener
- **Heroku** - Alternative à Railway
- **AWS Lambda** + **EventBridge** - Sans serveur

**Exemple avec Railway:**
```bash
# 1. Créer un service Railway pour le listener
# 2. Configurer les variables d'environnement
# 3. Deploy: railway up
```

---

## 📈 Monitoring

### Logs du Listener

```bash
# Voir les logs en temps réel
npm run listener

# Format des logs:
# [Listener] Starting listener for campaign 1
# [Event] ContributionReceived: 0x123... contributed
# [Success] Campaign 1 goal reached!
```

### Monitoring Blockchain

```bash
# Suivre les transactions sur Etherscan Sepolia
# https://sepolia.etherscan.io/tx/<TX_HASH>

# Voir les événements d'un contrat
# https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>#events
```

---

## 📚 Ressources Utiles

- **Ethers.js:** https://docs.ethers.org/v6/
- **Hardhat:** https://hardhat.org/
- **Prisma:** https://www.prisma.io/docs/
- **Next.js:** https://nextjs.org/docs
- **Sepolia Testnet:** https://sepolia.dev/
- **Infura:** https://infura.io/

---

## ✅ Checklist de Vérification

- [ ] Base de données PostgreSQL créée et accessible
- [ ] Variables d'environnement configurées
- [ ] Smart contracts compilés (`npm run hardhat:compile`)
- [ ] Tests réussis (`npm run test`)
- [ ] Contrats déployés sur Sepolia (`npm run hardhat:deploy`)
- [ ] Application démarre correctement (`npm run dev`)
- [ ] Listener démarre correctement (`npm run listener`)
- [ ] MetaMask connecté avec Sepolia testnet
- [ ] Faucet Sepolia utilisé pour avoir du ETH de test
- [ ] Campagne créée et vérifiée sur blockchain

---

## 🎉 Vous Êtes Prêt!

Si tous les points de la checklist sont verts, l'application est prête à l'utilisation. Félicitations! 🚀
