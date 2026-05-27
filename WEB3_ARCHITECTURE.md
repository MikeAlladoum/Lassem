# 🏗️ DApp Crowdfunding - Web3 Professional Architecture

## 📋 Overview

This is a **hybrid Web3 DApp** combining blockchain transactions with relational PostgreSQL database architecture. It's designed for professional enterprise use with complete admin controls, user management, and transaction tracking.

## 🎯 Architecture Phases

### ✅ PHASE 1: Admin System
- **Admin Wallet Configuration** via `ADMIN_WALLET` environment variable
- **Role-Based Access Control (RBAC)** with admin/creator/contributor roles
- **Admin Dashboard** at `/api/admin/info` with platform statistics
- **Audit Logging** for all admin actions

**Files:**
- `lib/admin.ts` - Admin middleware & utilities
- `app/api/admin/info/route.ts` - Admin stats endpoint
- `components/Navbar.tsx` - Disconnect Wallet button

### ✅ PHASE 2: User Management
- **Complete User API** with pagination and filtering
- **Profile Management** with validation and security checks
- **Role Management** (admin-only operations)
- **User Status Control** (activate/deactivate accounts)
- **Detailed User Profiles** with statistics and relations

**Endpoints:**
- `GET /api/users` - List all users
- `GET /api/users/[id]` - Get user by ID
- `GET /api/users/[id]/profile` - User profile with stats
- `PATCH /api/users/[id]/role` - Change user role (admin)
- `PATCH /api/users/[id]/status` - Manage user status (admin)
- `PATCH /api/users/me` - Update own profile

### ✅ PHASE 3: Realistic Test Data
- **Seed Script** (`scripts/seed.ts`) with complete test data
- **User Hierarchy**: 1 Admin + 3 Creators + 3 Contributors
- **Campaign Data**: 4 campaigns with realistic amounts and timelines
- **Contribution Chain**: 11 contributions across campaigns
- **Category System**: Tech, Energy, Robotics, Blockchain

**Run Seed:**
```bash
npx ts-node scripts/seed.ts
# or
npm run seed
```

### ✅ PHASE 4: Web3 UX & Transaction States
- **Transaction Hook** (`useTransaction`) for state management
- **Transaction Modal** with professional UI feedback
- **Transaction States**: pending → confirming → success/error
- **Progress Tracking** during blockchain confirmation
- **Explorer Links** for verified transactions

**Components:**
- `hooks/useTransaction.ts` - Transaction state management
- `components/TransactionModal.tsx` - Transaction feedback UI
- `lib/contribution-service.ts` - Contribution flow handler

---

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id              Int       @id @default(autoincrement())
  wallet_address  String    @unique
  username        String
  email           String?   @unique
  avatar_url      String?
  bio             String?
  role            Role      @default(contributor)
  is_active       Boolean   @default(true)
  is_visible      Boolean   @default(true)
  last_login_at   DateTime?
  
  // Relations
  campaigns_created    Campaign[]
  contributions_made   Contribution[]
  notifications        Notification[]
}

enum Role {
  visitor
  contributor
  creator
  admin
}
```

### Campaign Model
```prisma
model Campaign {
  id              Int       @id @default(autoincrement())
  title           String
  description     String
  goal_amount     Decimal
  current_amount  Decimal   @default(0)
  deadline        DateTime
  status          CampaignStatus
  creator_id      Int       // FK to User
  category_id     Int?
  contract_address String?  // Blockchain smart contract
  
  // Relations
  creator         User
  category        Category?
  contributions   Contribution[]
}

enum CampaignStatus {
  draft
  active
  succeeded
  failed
  cancelled
  closed
}
```

### Contribution Model
```prisma
model Contribution {
  id              Int       @id @default(autoincrement())
  campaign_id     Int       // FK to Campaign
  contributor_id  Int       // FK to User
  amount          Decimal
  tx_hash         String    @unique  // Blockchain transaction hash
  status          ContributionStatus
  block_number    BigInt?
  
  // Relations
  campaign        Campaign
  contributor     User
}

enum ContributionStatus {
  pending
  confirmed
  refunded
  failed
}
```

---

## 🔐 Authentication & Security

### MetaMask Authentication Flow

```
1. User connects wallet
   ↓
2. Backend generates nonce (GET /api/auth/nonce)
   ↓
3. User signs message with MetaMask
   ↓
4. User sends signature to backend (POST /api/auth/connect)
   ↓
5. Backend verifies signature & creates/retrieves user
   ↓
6. Backend issues JWT token (7 days expiration)
   ↓
7. User stores token in localStorage
```

**Key Files:**
- `lib/auth.ts` - Authentication logic
- `hooks/useWallet.ts` - Wallet connection hook
- `app/api/auth/nonce/route.ts` - Nonce generation
- `app/api/auth/connect/route.ts` - Login endpoint

### JWT Protection

All protected routes require `Authorization: Bearer <token>` header.

```typescript
// Example
const auth = await withAuth(request);
if (!auth.isValid) {
  return errorResponse("Unauthorized", 401);
}
// auth.user contains: { userId, walletAddress, role }
```

---

## 💰 Transaction Flow

### Contribution Process

```typescript
// 1. User initiates contribution
const { status, startTransaction, confirmTransaction, completeTransaction, errorTransaction } = useTransaction();

// 2. Show confirmation modal
startTransaction("Confirming contribution of 5 ETH");

// 3. User confirms in MetaMask
confirmTransaction();
// setProgress(30) → Waiting for blockchain

// 4. Monitor blockchain
// (After X blocks confirmed)
completeTransaction(txHash, "Transaction confirmed!");

// 5. Save to database
// (DB update happens with tx_hash)
```

### Database Synchronization

```
Blockchain ←→ Database
    ↓
TX Hash (immutable) → Contribution record
    ↓
Block confirmation → Status update: "confirmed"
    ↓
Failed TX → Status update: "failed"
```

---

## 🚀 Environment Configuration

### `.env.local` Setup

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/Finance"

# Blockchain
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS="0x..."
PRIVATE_KEY="0x..."

# Authentication
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_WALLET="0x5b0E4eCEfd39e3c491728Aa8af5b49a83caD94B4"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Test Wallets (After Seed)

```
Admin:       0x5b0e4ecefd39e3c491728aa8af5b49a83cad94b4
Creator 1:   0x1234567890123456789012345678901234567890
Creator 2:   0x2345678901234567890123456789012345678901
Creator 3:   0x3456789012345678901234567890123456789012
Contributor: 0x4567890123456789012345678901234567890123
```

---

## 📡 API Endpoints

### Authentication
- `GET /api/auth/nonce` - Generate signing nonce
- `POST /api/auth/connect` - Login with signature

### User Management
- `GET /api/users` - List users (paginated)
- `GET /api/users/[id]` - Get user profile
- `GET /api/users/[id]/profile` - User profile + stats
- `GET /api/users/me` - Current user info
- `PATCH /api/users/me` - Update own profile
- `PATCH /api/users/[id]/role` - Change role (admin)
- `PATCH /api/users/[id]/status` - Toggle active/visible (admin)

### Admin
- `GET /api/admin/info` - Platform dashboard

### Campaigns
- `GET /api/campaigns` - List campaigns
- `GET /api/campaigns/[id]` - Campaign details
- `POST /api/campaigns` - Create campaign (creator/admin)

### Contributions
- `GET /api/contributions` - User's contributions
- `POST /api/contributions` - Contribute to campaign
- `PATCH /api/contributions/[id]` - Update contribution status

---

## 🎨 UI Components

### TransactionModal
```typescript
import { TransactionModal } from "@/components/TransactionModal";

<TransactionModal
  isOpen={isOpen}
  status={transactionStatus}
  onClose={handleClose}
  explorerUrl={getExplorerUrl(txHash)}
/>
```

### useTransaction Hook
```typescript
import { useTransaction } from "@/hooks/useTransaction";

const { status, startTransaction, confirmTransaction, completeTransaction, errorTransaction } = useTransaction();

// Usage
startTransaction("Processing your contribution...");
confirmTransaction();
completeTransaction(txHash);
errorTransaction("Transaction failed");
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Manual Testing Checklist
- [ ] Connect wallet (MetaMask)
- [ ] View campaigns
- [ ] Create campaign (as creator)
- [ ] Make contribution
- [ ] Check transaction states
- [ ] View user profile
- [ ] Admin: Check platform stats
- [ ] Admin: Change user role
- [ ] Disconnect wallet

---

## 📊 Current Status

### Build Information
- **Routes**: 26 (8 static, 18 dynamic)
- **Size**: ~190 KB first load JS
- **Build Time**: ~60 seconds
- **TypeScript**: Strict mode ✓
- **Linting**: ESLint passing ✓

### Commits
- `ee5f161` - PHASE 1: Admin Architecture
- `3222abf` - PHASE 2 & 3: User Routes + Seed Data
- [Current] - PHASE 4: Transaction UX

---

## 🔄 Data Flow Diagram

```
User Interface
    ↓
MetaMask (Sign)
    ↓
JWT Auth
    ↓
Protected API Route
    ↓
Admin Check (if needed)
    ↓
Database (Prisma)
    ↓
Blockchain (Smart Contract)
    ↓
Block Explorer (Verification)
```

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server on :3000

# Build & Deploy
npm run build            # Production build
npm run start            # Run production build

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run seed             # Populate test data

# Code Quality
npm run lint             # ESLint check
npm run typecheck        # TypeScript check

# Blockchain
npm run hardhat:deploy   # Deploy contracts
npm run hardhat:test     # Run contract tests
```

---

## 📝 Notes for Deployment

1. **Environment Variables**: Update all `.env` values for production
2. **Database**: Migrate to production PostgreSQL
3. **Smart Contracts**: Deploy to Ethereum mainnet
4. **Admin Wallet**: Set to production admin address
5. **JWT Secret**: Generate strong random secret (32+ chars)
6. **API Keys**: Get real Infura/Alchemy keys

---

## 🚀 Next Steps

### PHASE 5: Dashboard Admin (TBD)
- Admin analytics dashboard
- User management interface
- Campaign moderation panel
- Transaction monitoring
- Platform statistics

---

**Architecture by:** Senior Web3 Engineer  
**Last Updated:** May 27, 2026  
**Version:** 1.0.0-alpha
