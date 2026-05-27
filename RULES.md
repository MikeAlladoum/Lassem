# 📋 Règles absolues et patterns du projet DAMLEGEND

## 🔒 Sécurité

### 1. Gestion des clés privées
- ✅ **Toujours** dans `.env.local` (non commité)
- ❌ Jamais en dur dans le code
- ❌ Jamais dans les logs
- ⚠️ Rotationner régulièrement en production

```javascript
// ✅ BON
const privateKey = process.env.PRIVATE_KEY;

// ❌ MAUVAIS
const privateKey = "0xabc123...";
```

### 2. Vérification du réseau blockchain
- ✅ **Toujours** vérifier chainId === 11155111 (Sepolia)
- ✅ Afficher une alerte si l'utilisateur est sur un autre réseau
- ❌ Permettre les transactions sur d'autres réseaux

```typescript
// Dans useWallet.ts
const isCorrectNetwork = chainId === "11155111";

if (!isCorrectNetwork) {
  showAlert("❌ Veuillez utiliser le réseau Sepolia");
}
```

### 3. Authentification utilisateur
- ✅ Vérifier `user.is_active = true` **à chaque API call protégée**
- ✅ Refuser l'accès si `is_active = false`
- ✅ Utiliser JWT avec expiration 7 jours max
- ❌ Pas de sessions infinies

```typescript
// ✅ BON
export async function GET(request) {
  const { isValid, user } = await withAuth(request);
  
  if (!isValid || !user?.is_active) {
    return errorResponse("Unauthorized", 401);
  }
  
  // Continuer...
}
```

---

## 📊 Base de données

### 4. Soft delete - Jamais de suppression physique
- ✅ **TOUJOURS** `UPDATE is_visible = false` ou `UPDATE is_active = false`
- ❌ Jamais `DELETE * FROM ...`
- ✅ Conserver l'historique complet
- ✅ Permettre la restauration ultérieure

```typescript
// ✅ BON - Soft delete
await prisma.campaign.update({
  where: { id },
  data: { is_visible: false }
});

// ❌ MAUVAIS - Suppression physique
await prisma.campaign.delete({ where: { id } });
```

### 5. Filtrage public des données
- ✅ **TOUS** les endpoints publics: `WHERE is_visible = true AND is_active = true`
- ✅ Les données soft-deleted ne sont jamais visibles publiquement
- ✅ Admin peut voir les données supprimées (avec flag)
- ❌ Retourner les données supprimées accidentellement

```typescript
// ✅ BON
const campaigns = await prisma.campaign.findMany({
  where: {
    is_visible: true,
    is_active: true,
    status: "active"
  }
});

// ❌ MAUVAIS
const campaigns = await prisma.campaign.findMany({
  where: { status: "active" }
});
```

### 6. Remplissage automatique de created_by
- ✅ **Automatiquement** définir `created_by = userId` (du JWT)
- ✅ À **chaque création** d'enregistrement
- ❌ Permettre à l'utilisateur de spécifier `created_by`
- ✅ Utiliser pour l'audit et les permissions

```typescript
// ✅ BON
export async function POST(request) {
  const { isValid, user } = await withAuth(request);
  const { title, description } = await request.json();
  
  const campaign = await prisma.campaign.create({
    data: {
      title,
      description,
      creator_id: user.id,
      created_by: user.id // ← Auto-set du JWT
    }
  });
}

// ❌ MAUVAIS
const campaign = await prisma.campaign.create({
  data: {
    title,
    description,
    created_by: body.createdBy // ← Accès utilisateur!
  }
});
```

---

## 💰 Transactions et fonds

### 7. Les fonds ne transitent QUE par smart contracts
- ✅ **Uniquement** via contrats Solidity (contribute, withdraw, refund)
- ❌ Jamais de `ethers.Wallet.sendTransaction()` du backend
- ❌ Jamais de gestion d'ETH côté backend
- ✅ Le backend enregistre les transactions, ne les crée pas

```typescript
// ✅ BON - Frontend seulement
const tx = await contract.contribute({ value: ethers.parseEther("1") });

// ❌ MAUVAIS - Ne JAMAIS faire ceci
const tx = await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther("1")
});
```

### 8. Enregistrement des transactions
- ✅ Créer un `BlockchainTransaction` **après** la transaction on-chain
- ✅ Inclure: tx_hash (unique), type, from, to, amount, status
- ✅ Stocker le block_number pour la vérification
- ✅ État: "pending" → "confirmed" ou "failed"

```typescript
// ✅ BON
await prisma.blockchainTransaction.create({
  data: {
    tx_hash: receipt.hash,
    type: "contribution",
    from_address: userAddress,
    to_address: campaignAddress,
    amount: contributionAmount,
    status: "confirmed",
    block_number: receipt.blockNumber,
    campaign_id: campaignId,
    user_id: userId,
    created_by: userId
  }
});
```

---

## 🔐 Admin et rôles

### 9. Pas de formulaire signup admin
- ❌ Aucun endpoint POST `/signup/admin`
- ❌ Pas de lien "Devenir admin"
- ✅ **Assignation manuelle** en base de données SEULEMENT
- ✅ Via: `UPDATE users SET role = 'admin' WHERE id = X`
- ✅ Audit: logs de qui a changé les rôles

```typescript
// ✅ BON - Vérification du rôle admin
if (user.role !== "admin") {
  return errorResponse("Forbidden", 403);
}

// ❌ MAUVAIS - Création d'admin via formulaire
const admin = await prisma.user.create({
  data: {
    role: "admin", // Non sécurisé!
    ...
  }
});
```

### 10. Vérification des permissions
- ✅ Vérifier `user.role` pour actions sensibles
- ✅ Vérifier `created_by === user.id` pour modifications propres
- ✅ Admin peut modifier n'importe quoi
- ❌ Permettre aux contributeurs de modifier des campagnes

```typescript
// ✅ BON - Vérification des permissions
const campaign = await prisma.campaign.findUnique({ where: { id } });

if (campaign.created_by !== user.id && user.role !== "admin") {
  return errorResponse("Cannot modify this campaign", 403);
}

// Peut modifier...
```

---

## 🔄 Smart contracts

### 11. Immuabilité après déploiement
- ✅ **Tests exhaustifs** avant déploiement Sepolia
- ✅ Vérifier: contributions, retraits, remboursements, annulation
- ✅ Edge cases: zéro, très grands montants, deadlines
- ❌ Pas de mise à jour après déploiement (immuable!)
- ✅ Créer une V2 si changements nécessaires

```javascript
// ✅ BON - Tests complets avant déploiement
describe("CrowdfundingCampaign", function() {
  describe("Contribution", function() {
    it("should accept valid contributions");
    it("should reject zero amount");
    it("should reject after deadline");
    it("should prevent owner from contributing");
    // ... etc
  });
});

// Avant: npx hardhat test
// Avant: npx hardhat run scripts/deploy.js --network sepolia
```

### 12. Événements pour synchronisation DB
- ✅ **Émettre des événements** pour chaque action importante
- ✅ Utiliser indexed addresses pour filtrage
- ✅ Listener blockchain capture et met à jour PostgreSQL
- ✅ Events: ContributionReceived, FundsWithdrawn, RefundIssued, CampaignCancelled

```solidity
// ✅ BON
event ContributionReceived(
  address indexed contributor,
  uint256 amount,
  uint256 newTotal
);

function contribute() public payable {
  require(msg.value > 0, "Amount must be > 0");
  contributions[msg.sender] += msg.value;
  currentAmount += msg.value;
  
  emit ContributionReceived(msg.sender, msg.value, currentAmount);
}
```

---

## 📡 API

### 13. Réponses standardisées
- ✅ **TOUS** les endpoints retournent: `{ success: boolean, data?: any, error?: string }`
- ✅ HTTP status codes corrects: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Error
- ✅ Messages d'erreur clairs en français
- ❌ Retourner différents formats

```typescript
// ✅ BON - Standardisé
return NextResponse.json({
  success: true,
  data: { user, token }
}, { status: 200 });

// ❌ MAUVAIS
return NextResponse.json({ user, token }); // Pas de success!
return NextResponse.json({ error: "Error" }); // Pas de success!
```

### 14. Validation des entrées
- ✅ Valider **TOUS** les inputs utilisateur
- ✅ Vérifier types, longueurs, formats
- ✅ Refuser les valeurs vides requises
- ✅ Messages d'erreur explicites

```typescript
// ✅ BON
const { amount, campaignId } = await request.json();

if (!amount || amount <= 0) {
  return errorResponse("Amount must be > 0", 400);
}

if (!campaignId || typeof campaignId !== "number") {
  return errorResponse("Invalid campaign ID", 400);
}

const campaign = await prisma.campaign.findUnique({
  where: { id: campaignId }
});

if (!campaign) {
  return errorResponse("Campaign not found", 404);
}
```

---

## 🎯 Frontend

### 15. Vérification Sepolia côté frontend
- ✅ Afficher un avertissement si chainId ≠ 11155111
- ✅ Proposer un bouton "Basculer vers Sepolia"
- ✅ Empêcher les transactions sur d'autres réseaux

```typescript
// ✅ BON - Dans useWallet.ts
if (!isCorrectNetwork) {
  showAlert("⚠️ Veuillez utiliser le réseau Sepolia (11155111)");
  
  return (
    <button onClick={switchToSepolia}>
      Basculer vers Sepolia
    </button>
  );
}
```

### 16. Gestion des erreurs blockchain
- ✅ Capturer les rejets de transaction MetaMask
- ✅ Afficher les erreurs à l'utilisateur
- ✅ Logs des erreurs côté client
- ❌ Révéler des détails techniques

```typescript
// ✅ BON
try {
  const tx = await contract.contribute({ value });
  const receipt = await tx.wait();
} catch (error) {
  if (error.code === "ACTION_REJECTED") {
    setError("Vous avez annulé la transaction");
  } else {
    setError("Erreur lors de la transaction");
    console.error(error);
  }
}
```

---

## 🚀 Déploiement et migration

### 17. Processus de déploiement
1. ✅ Tests locaux: `npx hardhat test`
2. ✅ Compilation: `npx hardhat compile`
3. ✅ Vérification du code de sécurité
4. ✅ Déploiement testnet: `npx hardhat run scripts/deploy.js --network sepolia`
5. ✅ Vérification sur Etherscan
6. ✅ Migration DB: `npx prisma migrate deploy`

### 18. Gestion des migrations DB
- ✅ Créer une migration: `npx prisma migrate dev --name description`
- ✅ Vérifier avant commit: `git show migrations/`
- ✅ En production: `npx prisma migrate deploy`
- ✅ Rollback manuel si nécessaire (Prisma garde l'historique)

---

## 📝 Checklist de code review

Avant de commiter du code:

- [ ] ✅ Pas de clés privées en dur
- [ ] ✅ Pas de DELETE physiques (soft delete utilisé)
- [ ] ✅ `is_visible && is_active` sur requêtes publiques
- [ ] ✅ `created_by` auto-peuplé du JWT
- [ ] ✅ Vérification `is_active` utilisateur
- [ ] ✅ ChainId Sepolia vérifié
- [ ] ✅ Réponses API standardisées
- [ ] ✅ Erreurs capturées et loggées
- [ ] ✅ Permissions vérifiées
- [ ] ✅ Entrées validées
- [ ] ✅ Aucun transfer ETH du backend
- [ ] ✅ Tests ajoutés/modifiés si logique changée

---

## 📞 Support et questions

Pour des questions sur l'implémentation:
1. Relire ces règles absolues
2. Vérifier les exemples de code
3. Consulter la documentation Prisma/Ethers/Hardhat
4. Vérifier les patterns utilisés dans le code existant

**Respect strict de ces règles = Application sécurisée et maintenable!** 🔐

