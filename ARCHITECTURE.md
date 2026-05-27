# 🏗️ Architecture système - DAMLEGEND DApp

## Vue d'ensemble globale

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR (MetaMask)                   │
└────────────────────────────────────────────────────────────┘
                            ↓↑
            ┌───────────────────────────────────┐
            │   FRONTEND (Next.js + React)      │
            │  - Pages: Campaigns, Dashboard    │
            │  - Hooks: useWallet, useCampaign  │
            │  - Components: Navbar, Cards      │
            └──────────────┬──────────────────┘
                    ↓↑              ↓↑
        ┌───────────────────┐  ┌────────────────┐
        │  API Routes       │  │ MetaMask/       │
        │  (/api/...)       │  │ Ethereum        │
        │  - Auth           │  │ (Sepolia)       │
        │  - Campaigns      │  │ ChainId: 11155111
        │  - Contributions  │  │                │
        │  - Webhooks       │  └────────────────┘
        │  - Admin          │        ↑↓
        └──────────┬────────┘  ┌─────────────────┐
                   ↓↑          │ Smart Contracts │
        ┌──────────────────┐   │ - Factory       │
        │  PostgreSQL DB   │   │ - Campaign (x N)│
        │  (Finance)       │   └─────────────────┘
        │  - users         │        ↑↓
        │  - campaigns     │  ┌──────────────────┐
        │  - contributions │  │ Blockchain       │
        │  - transactions  │  │ Events Listener  │
        │  - notifications │  │ (lib/blockchain- │
        └──────────────────┘  │  listener.ts)    │
                   ↑          └──────────────────┘
                   │                  ↑
                   └──────────────────┘
                (Event Sync)
        
        ┌──────────────────────────────────┐
        │   CRON Jobs                      │
        │   - Remboursements auto (horaire)│
        │   - Nettoyage données (optionnel)│
        └──────────────────────────────────┘
```

---

## 1️⃣ Flux d'authentification

```
┌─ Utilisateur (MetaMask) ─────────────────┐
│                                          │
│  1. Clique "Connecter" (Navbar)          │
│                                          │
├─→ GET /api/auth/nonce                    │
│   Reçoit: { nonce, message }             │
│                                          │
│  2. MetaMask demande signature           │
│   Message: "DAMLEGEND: sign to connect..." │
│                                          │
│  3. Utilisateur signe le message         │
│                                          │
├─→ POST /api/auth/connect                 │
│   Envoie: { walletAddress, signature }   │
│   - Vérification avec ethers.verifyMsg()  │
│   - Création/Update user en DB            │
│   - Génération JWT                        │
│   Reçoit: { user, token }                │
│                                          │
│  4. Token stocké en localStorage          │
│   ("token", "address")                    │
│                                          │
│  5. Redirection Dashboard                │
│                                          │
└──────────────────────────────────────────┘
```

---

## 2️⃣ Flux de création de campagne

```
┌─ Dashboard / Créer ─────────────────────┐
│                                         │
│  1. Formulaire 3 étapes                 │
│     Étape 1: Infos (titre, description) │
│     Étape 2: Finances (objectif, date)  │
│     Étape 3: Review                     │
│                                         │
├─→ POST /api/campaigns                   │
│   Données:                              │
│   {                                     │
│     title, description, category_id,    │
│     goal_amount, deadline, image_url    │
│   }                                     │
│                                         │
│   Backend (lib/auth.ts + Prisma):       │
│   1. Vérifier authentification (JWT)     │
│   2. Vérifier user.is_active = true      │
│   3. Vérifier role = creator ou admin    │
│   4. Valider inputs                      │
│   5. Créer campaign avec status = draft  │
│   6. created_by = userId du JWT          │
│                                         │
│   Retour: { success, campaign }         │
│                                         │
│  2. Redirection vers page campagne       │
│                                         │
│  3. Admin publie campagne (optionnel)    │
│     PATCH /api/campaigns/[id]            │
│     { status: "active" }                 │
│                                         │
│     ⚠️ À ce stade:                      │
│     - Il faut appeler Factory.create()   │
│     - Déployer CrowdfundingCampaign      │
│     - Stocker contract_address en DB     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3️⃣ Flux de contribution

```
┌─ Campagne Details ─────────────────────┐
│                                        │
│  1. Utilisateur clique "Contribuer"    │
│                                        │
│  2. Modal d'entrée                     │
│     Input: montant en ETH               │
│     Total: affichage du montant         │
│                                        │
│  3. Clique "Confirmer"                 │
│                                        │
├─→ useCampaign.contribute(amountETH)    │
│   Hook frontend:                       │
│   1. Obtenir contract instance          │
│   2. Appeler contract.contribute()      │
│      { value: ethers.parseEther() }     │
│   3. Attendre receipt                   │
│   4. Retourner tx.hash                  │
│                                        │
│   ↓ MetaMask popup ↓                  │
│   Utilisateur signe et envoie ETH      │
│                                        │
│  4. Une fois confirmée (on-chain):     │
│                                        │
├─→ POST /api/contributions               │
│   Données: {                           │
│     campaign_id,                       │
│     amount,                            │
│     tx_hash,                           │
│     block_number                       │
│   }                                    │
│                                        │
│   Backend:                             │
│   1. Vérifier authentification          │
│   2. Créer contribution record          │
│   3. UPDATE campaign.current_amount     │
│   4. Vérifier goal reached → update     │
│     status si atteint                   │
│   5. Créer notification au créateur     │
│   6. Créer blockchain_transaction       │
│                                        │
│  5. Attendre Blockchain Listener...    │
│                                        │
│  ⚡ Alternative (Webhook):             │
│     Contract peut appeler webhook       │
│     pour notifier backend instantanément│
│                                        │
└────────────────────────────────────────┘
```

---

## 4️⃣ Flux de synchronisation blockchain-DB

```
┌─ Smart Contract ────────────────────────┐
│                                         │
│  Event: ContributionReceived            │
│  ├─ address contributor                 │
│  ├─ uint256 amount                      │
│  └─ uint256 newTotal                    │
│                                         │
│ (Émis après chaque contribute())        │
│                                         │
└────────────────────────────────────────┘
              ↓ (blockchain)
┌─ Blockchain Listener ──────────────────┐
│ (lib/blockchain-listener.ts)            │
│                                         │
│  1. Écoute les événements via ethers    │
│  2. Pour chaque event reçu:             │
│     ├─ Vérifier les données             │
│     ├─ Mettre à jour DB en consequence  │
│     └─ Créer notifications              │
│                                         │
│  Events gérés:                          │
│  • ContributionReceived                 │
│    → UPDATE contributions status        │
│    → UPDATE campaigns current_amount    │
│    → Vérifier goal reached              │
│                                         │
│  • FundsWithdrawn                       │
│    → UPDATE campaigns status = "closed" │
│    → Créer blockchain_transaction       │
│                                         │
│  • RefundIssued                         │
│    → UPDATE contributions status =      │
│      "refunded"                         │
│    → Créer notification utilisateur     │
│                                         │
│  • CampaignCancelled                    │
│    → UPDATE campaigns status =          │
│      "cancelled"                        │
│    → Notifier tous les contributeurs    │
│                                         │
└────────────────────────────────────────┘
         ↓ (PostgreSQL update)
┌─ PostgreSQL Database ──────────────────┐
│                                        │
│  contributions → status = "confirmed"  │
│  campaigns → current_amount = X ETH    │
│  campaigns → status = "succeeded"      │
│  notifications → (nouvelle notif)      │
│  blockchain_transactions → (record)    │
│                                        │
└────────────────────────────────────────┘
```

---

## 5️⃣ Flux de retrait (withdrawal)

```
┌─ Campaign détail (Owner) ──────────────┐
│                                        │
│  Conditions pour retrait:               │
│  1. deadline passée ✓                   │
│  2. current_amount >= goal_amount ✓     │
│  3. NOT already withdrawn ✓             │
│                                        │
├─→ useCampaign.withdrawFunds()           │
│   Frontend:                            │
│   1. Obtenir contract instance          │
│   2. Appeler contract.withdrawFunds()   │
│   3. Attendre receipt                   │
│                                        │
│   ↓ MetaMask popup ↓                  │
│   Owner signe la transaction            │
│                                        │
│   Contract:                            │
│   1. Vérifier conditions                │
│   2. Transférer totalAmount → owner     │
│   3. Émettre FundsWithdrawn event       │
│                                        │
└────────────────────────────────────────┘
         ↓ (blockchain event)
┌─ Listener capture FundsWithdrawn ─────┐
│                                        │
│  1. UPDATE campaigns status = "closed" │
│  2. is_active = false                  │
│  3. Créer blockchain_transaction       │
│  4. Notifier le créateur               │
│                                        │
└────────────────────────────────────────┘
```

---

## 6️⃣ Flux de remboursement (refund)

### A. Remboursement individuel (avant deadline)

```
┌─ Contributor view ─────────────────────┐
│                                        │
│  Conditions:                           │
│  1. deadline NOT passed                │
│  2. current_amount < goal_amount       │
│  3. contributor a contribution         │
│                                        │
├─→ useCampaign.refund()                │
│   Appel: contract.refund()             │
│                                        │
│   Contract:                            │
│   1. Vérifier conditions                │
│   2. contribution[msg.sender] = 0       │
│   3. Transférer amount → msg.sender     │
│   4. Émettre RefundIssued event        │
│                                        │
└────────────────────────────────────────┘
         ↓ (blockchain event)
┌─ Listener ─────────────────────────────┐
│  1. UPDATE contribution status =        │
│     "refunded"                         │
│  2. Notifier le contributeur            │
│                                        │
└────────────────────────────────────────┘
```

### B. Remboursement batch via CRON (automatique)

```
┌─ CRON Job (toutes les heures) ────────┐
│ (lib/refund-cron.ts)                  │
│                                        │
│  Cherche:                              │
│  Campagnes WHERE:                      │
│  • status = "active"                   │
│  • deadline < NOW()                    │
│  • current_amount < goal_amount        │
│  • is_active = true                    │
│  • contract_address NOT NULL           │
│                                        │
├─→ Pour chaque campagne:                │
│   1. contract.refundAll()              │
│   2. Attend receipt                    │
│                                        │
│   Contract:                            │
│   • Boucle sur tous les contributors   │
│   • contribution[addr] = 0 pour chaque │
│   • Envoie ETH à chaque                │
│   • Émet RefundIssued pour chaque      │
│                                        │
│  3. UPDATE campaign status = "failed"  │
│  4. is_active = false                  │
│  5. Notifier créateur                  │
│                                        │
└────────────────────────────────────────┘
         ↓
┌─ Listener capture multiple RefundIssued
│  1. UPDATE contributions status        │
│  2. Notifier tous les contributeurs    │
│                                        │
└────────────────────────────────────────┘
```

---

## 7️⃣ Annulation de campagne

```
┌─ Owner Dashboard ──────────────────────┐
│                                        │
│  Conditions:                           │
│  1. Owner is creator                   │
│  2. deadline NOT passed                │
│  3. NOT already withdrawn              │
│                                        │
├─→ useCampaign.cancel()                │
│   Appel: contract.cancel()             │
│                                        │
│   Contract:                            │
│   1. Vérifier conditions                │
│   2. cancelled = true                  │
│   3. Appeler refundAll() (auto)         │
│   4. Émettre CampaignCancelled         │
│                                        │
└────────────────────────────────────────┘
         ↓
┌─ Listener capture CampaignCancelled ──┐
│  1. UPDATE campaigns status =          │
│     "cancelled"                        │
│  2. is_active = false                  │
│  3. Notifier créateur                  │
│  4. Notifier tous les contributeurs    │
│                                        │
└────────────────────────────────────────┘
```

---

## 8️⃣ Vérification des données

```
┌─ Frontend (useWallet) ──────────────────┐
│  1. Vérifier chainId = 11155111         │
│     Si non → Alerte + Bouton switch     │
│  2. Récupérer adresse MetaMask          │
│  3. Vérifier token JWT en localStorage  │
│                                         │
└─────────────────────────────────────────┘

┌─ Backend (API Route) ───────────────────┐
│  1. Extraire Bearer token              │
│  2. Vérifier signature JWT              │
│  3. Récupérer user de la DB             │
│  4. Vérifier user.is_active = true      │
│  5. Continuer si tout OK                │
│                                         │
└─────────────────────────────────────────┘

┌─ Requête DB (Public) ───────────────────┐
│  WHERE is_visible = true               │
│  AND   is_active = true                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9️⃣ Modèle de données

```
┌─── User ───────────────────┐
│ id                         │
│ wallet_address (unique)    │
│ username                   │
│ email                      │
│ role: enum(visitor|        │
│   contributor|creator|admin)
│ avatar_url                 │
│ bio                        │
│ is_active                  │
│ is_visible                 │
│ last_login_at              │
│ created_by, created_at,    │
│ updated_at                 │
└────────────────────────────┘
              ↓
      ┌───────────────┐
      │ Campaign ✕ N  │
      └───────────────┘
              ↓
   ┌──────────────────┐
   │ Contribution ✕ N │
   └──────────────────┘

┌─── Campaign ──────────────┐
│ id                        │
│ title                     │
│ description               │
│ category_id → Category    │
│ creator_id → User         │
│ goal_amount (Decimal)     │
│ current_amount            │
│ deadline                  │
│ status: enum(draft|       │
│   active|succeeded|       │
│   failed|cancelled|closed)│
│ contract_address          │
│ image_url                 │
│ is_active, is_visible     │
│ created_by, created_at,   │
│ updated_at                │
└───────────────────────────┘

┌─── Contribution ─────────┐
│ id                       │
│ campaign_id → Campaign   │
│ contributor_id → User    │
│ amount (Decimal)         │
│ tx_hash (unique)         │
│ status: enum(pending|    │
│   confirmed|refunded|    │
│   failed)                │
│ block_number             │
│ is_active, is_visible    │
│ created_by, created_at   │
│ updated_at               │
└──────────────────────────┘

┌─ BlockchainTransaction ──┐
│ id                       │
│ tx_hash (unique)         │
│ type: enum(contribution| │
│   withdrawal|refund|     │
│   deploy)                │
│ from_address             │
│ to_address               │
│ amount (Decimal)         │
│ gas_used                 │
│ block_number             │
│ status: enum(pending|    │
│   confirmed|failed)      │
│ campaign_id (opt)        │
│ user_id (opt)            │
│ created_by, created_at   │
│ updated_at               │
└──────────────────────────┘

┌──── Notification ────────┐
│ id                       │
│ user_id → User           │
│ type: enum(contribution| │
│   goal_reached|refund|   │
│   campaign_end|system)   │
│ title                    │
│ message                  │
│ is_read                  │
│ link (optionnel)         │
│ created_by, created_at   │
│ updated_at               │
└──────────────────────────┘

┌─────── Category ────────┐
│ id                      │
│ name (unique)           │
│ slug (unique)           │
│ description             │
│ icon_url                │
│ is_active, is_visible   │
│ created_by, created_at  │
│ updated_at              │
└─────────────────────────┘
```

---

## 🔟 Points d'intégration clés

### Smart Contracts ↔ Frontend
- **useCampaign.ts**: Interaction via ethers.js
- **ABIs**: importés de lib/abis/
- **Event listening**: (optionnel, via provider)

### Smart Contracts ↔ Backend
- **Blockchain Listener**: écoute les événements
- **POST /api/webhooks/blockchain**: webhook pour événements
- **Enregistrement** des transactions dans blockchain_transactions

### Frontend ↔ Backend
- **JWT en localStorage** pour authentification
- **Bearer token** en Authorization header
- **API standardisées**: { success, data, error }

### Backend ↔ Base de données
- **Prisma ORM**: accès à PostgreSQL
- **Migrations**: gestion schéma via `npx prisma migrate`
- **Singleton pattern**: lib/prisma.ts

---

## 🔑 Concepts importants

1. **Immuabilité**: Contrats ne changent pas après déploiement
2. **Événements**: Synchronisent blockchain ↔ DB
3. **CRON**: Automatise les remboursements
4. **JWT**: Authentifie les utilisateurs
5. **Soft delete**: Aucune suppression physique
6. **created_by**: Audit trail complet
7. **Chainid 11155111**: Seulement Sepolia
8. **Contrats = Source de vérité**: Backend enregistre seulement

