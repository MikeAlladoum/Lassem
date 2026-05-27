# ✅ Checklist de déploiement - DAMLEGEND

## 🔐 Phase 1: Sécurité

- [ ] **Clés privées**: Aucune exposée en dur dans le code
  - [ ] `PRIVATE_KEY` seulement en `.env.local`
  - [ ] `.env.local` dans `.gitignore`
  - [ ] Vérifier avec `git log -p --all | grep -i "PRIVATE_KEY"`

- [ ] **JWT Secret**: Au moins 32 caractères
  - [ ] Générer: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - [ ] Unique par environnement (dev ≠ staging ≠ prod)

- [ ] **Sensibilité des données**: Aucune en localStorage dangereuse
  - [ ] Token JWT: OK
  - [ ] Addresses: OK
  - [ ] Clés privées: ❌ JAMAIS

- [ ] **Permissions**: Vérifiées à chaque endpoint
  - [ ] Vérifier rôle admin pour `/api/admin/*`
  - [ ] Vérifier `created_by === user.id` pour modifications
  - [ ] Vérifier `user.is_active` partout

- [ ] **Validation des inputs**: À chaque API call
  - [ ] Types vérifiés (number, string, address)
  - [ ] Longueurs vérifiées
  - [ ] Formats vérifiés (email, address Ethereum)
  - [ ] Valeurs requises présentes

---

## 📊 Phase 2: Base de données

- [ ] **Migrations Prisma**: Exécutées avec succès
  - [ ] `npx prisma migrate dev --name init_dapp_crowdfunding`
  - [ ] Toutes les tables créées
  - [ ] Tous les indexes en place

- [ ] **Soft delete**: Implémenté partout
  - [ ] ❌ Zéro `DELETE FROM` dans le code
  - [ ] ✅ Tous les deletes utilisent `UPDATE is_visible = false`
  - [ ] ✅ Tous les deletes utilisent `UPDATE is_active = false`

- [ ] **Filtrage public**: `is_visible && is_active` appliqué
  - [ ] GET /api/campaigns → WHERE is_visible AND is_active
  - [ ] GET /api/categories → WHERE is_visible AND is_active
  - [ ] GET /api/users/[id] → WHERE is_visible
  - [ ] Vérifier chaque findMany/findUnique

- [ ] **created_by**: Auto-peuplé du JWT
  - [ ] Chaque `.create()` inclut `created_by: user.id`
  - [ ] Chaque utilisateur voit ses créations dans le dashboard

- [ ] **Intégrité des données**:
  - [ ] Zéro enregistrement sans created_by
  - [ ] Zéro enregistrement sans created_at
  - [ ] Zéro enregistrement sans updated_at
  - [ ] Tous les foreign keys présents

---

## 🔗 Phase 3: Smart Contracts

- [ ] **Compilation**: Sans erreurs
  - [ ] `npx hardhat compile` ✅
  - [ ] Tous les artefacts générés
  - [ ] ABIs exportés dans `lib/abis/`

- [ ] **Tests**: Tous passent
  - [ ] `npx hardhat test` → 0 failures
  - [ ] Couverture complète:
    - [ ] ✅ Campaign creation (valid/invalid)
    - [ ] ✅ Contributions (normal, owner, zero)
    - [ ] ✅ Withdrawals (conditions, permissions)
    - [ ] ✅ Refunds (individual, batch)
    - [ ] ✅ Cancellation
    - [ ] ✅ Deadlines
    - [ ] ✅ Edge cases

- [ ] **Déploiement**: Sur Sepolia testnet
  - [ ] `npx hardhat run scripts/deploy.js --network sepolia` ✅
  - [ ] Transaction succès confirmée
  - [ ] NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS auto-updated
  - [ ] Contrat visible sur Etherscan

- [ ] **Vérification Etherscan**:
  - [ ] Contrat trouvé: https://sepolia.etherscan.io/address/0x...
  - [ ] Code source visible (ou vérifiez)
  - [ ] Événements loggés correctement

- [ ] **Événements blockchain**:
  - [ ] ContributionReceived: Indexé, paramètres corrects
  - [ ] FundsWithdrawn: Indexé, paramètres corrects
  - [ ] RefundIssued: Indexé, paramètres corrects
  - [ ] CampaignCancelled: Paramètres corrects

---

## 🌐 Phase 4: Blockchain (Frontend)

- [ ] **MetaMask**: Configuré correctement
  - [ ] Sepolia ajouté dans MetaMask
  - [ ] RPC URL correct: `https://sepolia.infura.io/v3/YOUR_KEY`
  - [ ] Chain ID: 11155111
  - [ ] Symbole: ETH

- [ ] **Connexion portefeuille**:
  - [ ] Bouton "Connecter" fonctionne
  - [ ] MetaMask popup apparaît
  - [ ] Signature demandée
  - [ ] Token JWT reçu et sauvegardé
  - [ ] Adresse affichée dans Navbar

- [ ] **Vérification chainId**:
  - [ ] ✅ Si Sepolia (11155111): Aucune alerte
  - [ ] ⚠️ Si autre réseau: Alerte affichée
  - [ ] ✅ Bouton "Basculer vers Sepolia" proposé

- [ ] **Transitions en ETH**: Acceptées via MetaMask
  - [ ] Création campagne: OK
  - [ ] Contribution: MetaMask popup → Confirmation → OK
  - [ ] Transaction visible en temps réel

- [ ] **Gestion d'erreurs**:
  - [ ] Utilisateur annule → Message clair
  - [ ] Réseau incorrect → Alerte + option switch
  - [ ] Fonds insuffisants → Message d'erreur
  - [ ] Contrat non trouvé → Erreur capturée

---

## 📡 Phase 5: API Routes

- [ ] **Authentication** (`/api/auth/*`):
  - [ ] GET /api/auth/nonce → Génère nonce + message
  - [ ] POST /api/auth/connect → Vérifie signature, retourne token
  - [ ] Vérification JWT: Valide sur routes protégées

- [ ] **Campaigns** (`/api/campaigns/*`):
  - [ ] GET /api/campaigns → Filtrés, paginés
  - [ ] POST /api/campaigns → Créé avec status=draft
  - [ ] GET /api/campaigns/[id] → Détail complet
  - [ ] PUT /api/campaigns/[id] → Modification (permission)
  - [ ] DELETE /api/campaigns/[id] → Soft delete

- [ ] **Contributions** (`/api/contributions/*`):
  - [ ] POST /api/contributions → Enregistre, met à jour montant
  - [ ] Détecte goal reached
  - [ ] Crée blockchain_transaction
  - [ ] Crée notification au créateur

- [ ] **Webhooks** (`/api/webhooks/blockchain`):
  - [ ] Reçoit événements blockchain
  - [ ] Traite ContributionReceived
  - [ ] Traite FundsWithdrawn
  - [ ] Traite RefundIssued
  - [ ] Traite CampaignCancelled

- [ ] **Users** (`/api/users/*`):
  - [ ] GET /api/users/me → Profil avec relations
  - [ ] PATCH /api/users/me/patch → Modification
  - [ ] GET /api/users/[id] → Profil public

- [ ] **Admin** (`/api/admin/*`):
  - [ ] Vérifier rôle = admin
  - [ ] PATCH /api/admin/users/[id] → Gestion utilisateurs
  - [ ] PATCH /api/admin/campaigns/[id] → Modération

- [ ] **Réponses standardisées**:
  - [ ] Tous les endpoints: `{ success, data?, error? }`
  - [ ] HTTP status codes corrects (200, 400, 401, 403, 500)
  - [ ] Messages d'erreur clairs en français

---

## 🎯 Phase 6: Frontend

- [ ] **Pages de base**:
  - [ ] `/` (Accueil) → Affiche hero + stats + campagnes
  - [ ] `/campaigns` → Liste paginée + recherche + filtres
  - [ ] `/campaigns/[id]` → Détail + contribution modal
  - [ ] `/campaigns/create` → Form 3 étapes
  - [ ] `/dashboard` → Stats + campagnes + contributions
  - [ ] `/profile` → Profil utilisateur (view/edit)
  - [ ] `/admin` → Dashboard admin
  - [ ] `/not-found` → 404 page

- [ ] **Navigation**:
  - [ ] Navbar: Logo, nav links, wallet button, profil dropdown
  - [ ] Responsive mobile/tablet/desktop
  - [ ] Active links surligné

- [ ] **États d'erreur**:
  - [ ] Erreurs API capturées et affichées
  - [ ] Loading states avec spinners
  - [ ] Empty states avec messages
  - [ ] 404 pour campagnes non trouvées

- [ ] **Responsive design**:
  - [ ] Mobile: 1 colonne
  - [ ] Tablet: 2 colonnes
  - [ ] Desktop: 3+ colonnes
  - [ ] Images responsive
  - [ ] Textes lisibles sur tous les écrans

---

## 🔄 Phase 7: Listener Blockchain

- [ ] **Initialisation**:
  - [ ] `npm run listener` démarre sans erreur
  - [ ] Logs de démarrage visibles
  - [ ] Campagnes trouvées et écoutées

- [ ] **Événements ContributionReceived**:
  - [ ] Reçoit depuis contrat
  - [ ] Met à jour contribution.status = "confirmed"
  - [ ] Met à jour campaign.current_amount
  - [ ] Détecte goal reached
  - [ ] Crée blockchain_transaction
  - [ ] Notifie créateur

- [ ] **Événements FundsWithdrawn**:
  - [ ] Reçoit depuis contrat
  - [ ] Met à jour campaign.status = "closed"
  - [ ] is_active = false
  - [ ] Crée blockchain_transaction
  - [ ] Notifie créateur

- [ ] **Événements RefundIssued**:
  - [ ] Reçoit depuis contrat
  - [ ] Met à jour contribution.status = "refunded"
  - [ ] Crée notification au contributeur

- [ ] **Événements CampaignCancelled**:
  - [ ] Reçoit depuis contrat
  - [ ] Met à jour campaign.status = "cancelled"
  - [ ] Notifie créateur et contributeurs

- [ ] **Gestion d'erreurs**:
  - [ ] Erreurs loggées avec contexte
  - [ ] Listener continue malgré erreurs
  - [ ] Retry logic si applicable

---

## ⏰ Phase 8: CRON Jobs

- [ ] **Remboursement automatique** (horaire):
  - [ ] CRON job s'exécute toutes les heures
  - [ ] Cherche campagnes non-funded avec deadline passée
  - [ ] Appelle contract.refundAll()
  - [ ] Met à jour campaigns.status = "failed"
  - [ ] Notifie créateur et contributeurs
  - [ ] Logs visibles

- [ ] **Erreurs CRON**:
  - [ ] Erreurs capturées et loggées
  - [ ] Exécution suivante continue
  - [ ] Retry si échec temporaire

---

## 🎨 Phase 9: UI/UX

- [ ] **Accessibilité**:
  - [ ] Contraste couleurs suffisant
  - [ ] Boutons avec focus visible
  - [ ] Alt text sur images

- [ ] **Performance**:
  - [ ] Temps de chargement < 3s
  - [ ] Aucun CLS (Cumulative Layout Shift)
  - [ ] Images optimisées (webp, compressed)

- [ ] **Notifications**:
  - [ ] Contributions: Notifiées au créateur
  - [ ] Goal reached: Alerté immédiatement
  - [ ] Retraits: Confirmé créateur
  - [ ] Remboursements: Notifiés contributeurs

---

## 🧪 Phase 10: Tests

- [ ] **Tests smart contracts** (100% - npx hardhat test):
  - [ ] Toutes les suites passent
  - [ ] Zéro warnings
  - [ ] Couverture complète

- [ ] **Tests manuels** (complet):
  - [ ] Inscription/Login: ✅
  - [ ] Créer campagne: ✅
  - [ ] Voir campagnes: ✅
  - [ ] Contribuer: ✅
  - [ ] Retrait (goal atteint): ✅
  - [ ] Remboursement (goal non atteint): ✅
  - [ ] Annulation: ✅
  - [ ] Dashboard: ✅
  - [ ] Profil: ✅

- [ ] **Tests edge cases**:
  - [ ] Montant zéro: Rejeté
  - [ ] Montant très grand: Accepté
  - [ ] Deadline = maintenant: OK
  - [ ] Deadline = passée: Rejeté
  - [ ] Objectif = 0: Rejeté
  - [ ] Double contribution: Acceptée (agrégée)
  - [ ] Même utilisateur 2 x refund: Rejeté

---

## 📋 Phase 11: Documentation

- [ ] **Code commenté**:
  - [ ] Fonctions complexes expliquées
  - [ ] Contrats Solidity: NatSpec
  - [ ] API routes: JSDoc

- [ ] **README**:
  - [ ] Setup instructions claires
  - [ ] Commandes de démarrage
  - [ ] Structure du projet
  - [ ] Ressources externes

- [ ] **SETUP_GUIDE.md**:
  - [ ] Étape 1-6 complètes et testées
  - [ ] Dépannage: Erreurs courantes + solutions

- [ ] **RULES.md**:
  - [ ] 18 règles absolues documentées
  - [ ] Exemples de code ✅ et ❌
  - [ ] Checklist de review

- [ ] **ARCHITECTURE.md**:
  - [ ] Diagrammes flux (authentification, contribution, etc.)
  - [ ] Schéma de données
  - [ ] Points d'intégration

---

## 🚀 Phase 12: Déploiement

### Local → Staging

- [ ] **Configuration staging**:
  - [ ] `.env.staging`: Variables staging
  - [ ] DB staging créée et migrée
  - [ ] Contrats déployés sur Sepolia testnet

- [ ] **Tests staging**:
  - [ ] Flux complet avec vrais Sepolia ETH
  - [ ] Listener fonctionne
  - [ ] CRON jobs s'exécutent

### Staging → Production (Mainnet - Future)

- [ ] **Avant production (MAINNET)**:
  - [ ] Audit de sécurité
  - [ ] Vérification contrats par expert
  - [ ] Assurance bancaire si applicable
  - [ ] Stratégie de backup/recovery

---

## ✨ Phase 13: Maintenance post-déploiement

- [ ] **Monitoring**:
  - [ ] Logs centralisés (Sentry, LogRocket)
  - [ ] Alertes erreurs critiques
  - [ ] Dashboards métriques

- [ ] **Backups**:
  - [ ] PostgreSQL: Quotidien
  - [ ] Historique git: Sécurisé
  - [ ] .env variables: Coffre-fort sécurisé

- [ ] **Mises à jour sécurité**:
  - [ ] npm audit réguler
  - [ ] Dépendances à jour
  - [ ] Patches de sécurité appliqués

---

## 🎯 Signature de déploiement

Une fois tout coché:

```
Date: _______________
Développeur: _______________
Réviseur: _______________
✅ Tous les éléments vérifiés et approuvés
✅ Application prête pour déploiement
✅ Sécurité vérifiée
✅ Tests passants
✅ Documentation complète
```

**Important**: Ne pas passer en production sans cette checklist 100% complète. 🔐

