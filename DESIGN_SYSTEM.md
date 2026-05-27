# 🎨 DESIGN SYSTEM - DAMLEGEND CROWDFUNDING DAPP

**Version:** 1.0  
**Status:** Active  
**Last Updated:** Avril 2026

---

## 📋 TABLE OF CONTENTS

1. [Design Philosophy](#-design-philosophy)
2. [Visual Identity](#-visual-identity)
3. [Color System](#-color-system)
4. [Typography](#-typography)
5. [Spacing & Layout](#-spacing--layout)
6. [Component Library](#-component-library)
7. [Page Templates](#-page-templates)
8. [Web3 Specific UX](#-web3-specific-ux)
9. [User Flows](#-user-flows)
10. [Implementation Roadmap](#-implementation-roadmap)

---

## 🎯 DESIGN PHILOSOPHY

### Core Principles

**1. Modern & Trustworthy** (Confiance + Innovation)
- Design épuré et professionnel, pas "crypto bro" 
- Transparence des informations (blockchain = honneur)
- Inspiré de Coinbase, Stripe, Compound (crédibilité fintech)

**2. Clarity Over Decoration** (Clarté d'abord)
- Hiérarchie visuelle forte
- Actions principales évidentes
- Pas de surcharge cognitive
- Onboarding progressif

**3. Web3 Native** (Pensée blockchain)
- Wallet-centric (MetaMask visible partout)
- Transaction flow transparent
- États de confirmation visibles
- Exploitabilité blockchain

**4. Accessible & Inclusive** (Pour tous)
- WCAG 2.1 AA minimum
- Contraste suffisant
- Responsive mobile-first
- Navigation au clavier

**5. Performance-Focused** (Rapide)
- Animations fluides (60fps)
- Chargement progressif
- Skeleton screens
- Zero layout shift

---

## 🎨 VISUAL IDENTITY

### Inspiration & Influences

| Plateforme | Ce qu'on prend | Raison |
|-----------|---|---|
| **Coinbase** | Minimalisme, confiance, clarté | Leader du Web3 UX |
| **Kickstarter** | Stratégie de campagne, visuels engageants | Expert crowdfunding |
| **Stripe** | Typographie, espacements, micro-interactions | Polish & attention to detail |
| **Aave/Compound** | Dashboard financier, data viz | DeFi UX best practices |

### Style Visual

```
Style:        Minimaliste + Moderne
Inspiration:  Tech fintech premium, pas gamer/crypto
Émotion:      Confiance, transparence, efficacité
Vibe:         "Investir dans l'avenir facilement"
```

---

## 🎨 COLOR SYSTEM

### Primary Palette (Core Brand)

```css
/* Primaire: Bleu technologique + Accent vibrant */
--color-primary-50:    #f0f9ff    /* Bleu très clair */
--color-primary-100:   #e0f2fe
--color-primary-200:   #bae6fd
--color-primary-300:   #7dd3fc
--color-primary-400:   #38bdf8    /* Cyan - Accent principal */
--color-primary-500:   #0ea5e9    /* Bleu actif (buttons) */
--color-primary-600:   #0284c7    /* Bleu fort (hover) */
--color-primary-700:   #0369a1    /* Bleu sombre (pressed) */
--color-primary-900:   #082f49

/* Secondaire: Accent doré (réussite, richesse) */
--color-accent-400:    #fbbf24    /* Ambre/Or */
--color-accent-500:    #f59e0b    /* Gold actif */
--color-accent-600:    #d97706    /* Darker */
```

### Semantic Colors

```css
/* SUCCESS - Confirmations, gains, transactions réussies */
--color-success-50:    #f0fdf4
--color-success-500:   #22c55e    /* Vert brillant */
--color-success-600:   #16a34a    /* Vert foncé */

/* WARNING - Attention, risques, délais */
--color-warning-50:    #fffbeb
--color-warning-500:   #f59e0b    /* Orange vif */
--color-warning-600:   #d97706    /* Orange sombre */

/* DANGER - Erreurs, rejets, risques élevés */
--color-danger-50:     #fef2f2
--color-danger-500:    #ef4444    /* Rouge clair */
--color-danger-600:    #dc2626    /* Rouge foncé */

/* NEUTRAL - Texte, backgrounds, dividers */
--color-neutral-50:    #f9fafb
--color-neutral-100:   #f3f4f6
--color-neutral-200:   #e5e7eb
--color-neutral-300:   #d1d5db
--color-neutral-400:   #9ca3af
--color-neutral-500:   #6b7280
--color-neutral-600:   #4b5563
--color-neutral-700:   #374151
--color-neutral-800:   #1f2937
--color-neutral-900:   #111827
--color-neutral-950:   #030712
```

### Background Strategy

```
Light Mode:
  - Background: #ffffff (blanc pur)
  - Surface: #f9fafb (gris très clair)
  - Border: #e5e7eb (gris léger)
  - Text: #111827 (noir quasi)

Dark Mode (RECOMMANDÉ pour Web3):
  - Background: #0a0e27 (bleu-noir très sombre)
  - Surface: #1a2043 (bleu-noir)
  - Surface Alt: #252f50 (gris-bleu)
  - Border: #3f4a6f (gris-bleu moyen)
  - Text: #f3f4f6 (gris très clair)
```

### Gradients (Accents Premium)

```css
/* Primary Gradient - Boutons, CTAs */
background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);

/* Accent Gradient - Highlights, sections premium */
background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);

/* Success Gradient - Confirmations */
background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);

/* Warning Gradient - Alertes */
background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
```

### Usage

| Usage | Color | Why |
|-------|-------|-----|
| **Primary buttons** | #0ea5e9 | Trust + Tech |
| **Links** | #06b6d4 | Readable + distinct |
| **Success feedback** | #22c55e | Universal recognition |
| **Danger/Error** | #ef4444 | Stop action signal |
| **Neutral text** | #f3f4f6 (dark mode) | Accessibility |
| **Hover effects** | Darken -10% | Feedback |

---

## 📝 TYPOGRAPHY

### Font Stack

```css
/* Inter: Modern, readable, tech-friendly */
/* Replace current Geist with Inter family */
font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
```

### Type Scale

```
Display/H1:    52px / 64px | 700 bold    | +1.25 spacing | Hero sections
Heading H2:    36px / 48px | 700 bold    | +0.5 spacing  | Section titles
Heading H3:    28px / 36px | 600 bold    | +0.25 spacing | Subsections
Heading H4:    22px / 32px | 600 semibold| 0 spacing     | Card titles

Body Large:    18px / 28px | 400 regular | 0 spacing     | Large text
Body:          16px / 24px | 400 regular | 0 spacing     | Main content
Body Small:    14px / 20px | 400 regular | 0 spacing     | Secondary
Body Tiny:     12px / 16px | 400 regular | +0.5 spacing  | Labels, meta

Mono (Code):   13px / 20px | 500 medium  | 0 spacing     | Wallets, hashes
```

### Usage Examples

```html
<!-- H1 - Page title -->
<h1 class="text-5xl font-bold leading-tight">Financez vos rêves</h1>

<!-- H2 - Section title -->
<h2 class="text-3xl font-bold">Campagnes actives</h2>

<!-- H3 - Card title -->
<h3 class="text-xl font-semibold">Mon projet tech</h3>

<!-- Body - Paragraphs -->
<p class="text-base text-neutral-600">Description de la campagne...</p>

<!-- Label - Metadata -->
<span class="text-sm text-neutral-500">Créé il y a 3 jours</span>

<!-- Wallet address (Mono) -->
<code class="text-xs font-mono">0x742d...8C42</code>
```

---

## 📐 SPACING & LAYOUT

### Spacing Scale (Multiples of 4px)

```css
--spacing-0:    0px
--spacing-1:    4px     (borders, minimal gaps)
--spacing-2:    8px     (tight spacing)
--spacing-3:    12px    (compact)
--spacing-4:    16px    (default)
--spacing-5:    20px    (comfortable)
--spacing-6:    24px    (section spacing)
--spacing-8:    32px    (significant gap)
--spacing-10:   40px    (major sections)
--spacing-12:   48px    (hero sections)
--spacing-16:   64px    (full section)
--spacing-20:   80px    (large gaps)
```

### Grid System

```
Container:     max-w-7xl (1280px)
Gutters:       px-4 sm:px-6 lg:px-8 (responsive)
Columns:       12-column grid (Tailwind default)

Breakpoints:
  - Mobile:    < 640px (sm)
  - Tablet:    640px - 1024px (md, lg)
  - Desktop:   > 1024px (xl)
```

### Layout Patterns

```html
<!-- Hero Section -->
<section class="py-12 sm:py-16 lg:py-20 px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Content -->
  </div>
</section>

<!-- Card Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Two Column Layout -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2"><!-- Main content --></div>
  <aside class="lg:col-span-1"><!-- Sidebar --></aside>
</div>
```

---

## 🧩 COMPONENT LIBRARY

### 1. BUTTONS

#### Primary Button (Main CTAs)

```tsx
<button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 
                   text-white font-semibold rounded-lg 
                   hover:shadow-lg hover:from-cyan-600 hover:to-blue-700
                   transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed">
  Connect Wallet
</button>
```

**States:**
- Default: Gradient cyan→blue
- Hover: Gradient darker + shadow
- Active: Pressed down (-1px)
- Disabled: 50% opacity
- Loading: Spinner animation

#### Secondary Button (Alternative actions)

```tsx
<button className="px-6 py-3 bg-neutral-800 border border-neutral-700
                   text-neutral-100 font-semibold rounded-lg
                   hover:bg-neutral-700 hover:border-neutral-600
                   transition-colors duration-150">
  Learn More
</button>
```

#### Danger Button (Delete, Cancel, Risky)

```tsx
<button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg
                   hover:bg-red-700 transition-colors
                   active:scale-95">
  Cancel Campaign
</button>
```

#### Icon Button (Compact, toolbar)

```tsx
<button className="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
  <Icon className="w-5 h-5 text-neutral-300" />
</button>
```

---

### 2. CARDS

#### Campaign Card (Primary component)

```tsx
<div className="group bg-neutral-900 border border-neutral-800 rounded-xl
                overflow-hidden hover:border-neutral-700 transition-all
                hover:shadow-lg hover:shadow-cyan-500/10">
  
  {/* Image */}
  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
    <img src={imageUrl} className="w-full h-full object-cover 
                                  group-hover:scale-105 transition-transform" />
    <div className="absolute top-4 right-4">
      <span className="px-3 py-1 bg-blue-600/90 backdrop-blur text-white 
                       text-xs font-semibold rounded-full">
        65% funded
      </span>
    </div>
  </div>

  {/* Content */}
  <div className="p-6">
    {/* Category */}
    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
      Technology
    </span>
    
    {/* Title */}
    <h3 className="mt-2 text-xl font-bold text-white line-clamp-2">
      {title}
    </h3>
    
    {/* Creator */}
    <div className="mt-4 flex items-center gap-2">
      <img src={avatar} className="w-6 h-6 rounded-full" />
      <span className="text-sm text-neutral-400">{creator}</span>
    </div>

    {/* Progress bar */}
    <div className="mt-4 bg-neutral-800 rounded-full h-2 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full" 
           style={{width: `${progress}%`}} />
    </div>

    {/* Stats */}
    <div className="mt-4 flex justify-between text-sm">
      <div>
        <p className="text-neutral-400">Raised</p>
        <p className="font-semibold text-white">{raised} ETH</p>
      </div>
      <div>
        <p className="text-neutral-400">Backers</p>
        <p className="font-semibold text-white">{backers}</p>
      </div>
      <div>
        <p className="text-neutral-400">Days left</p>
        <p className="font-semibold text-white">{daysLeft}</p>
      </div>
    </div>

    {/* CTA */}
    <button className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600
                       text-white font-semibold rounded-lg
                       hover:shadow-lg hover:shadow-cyan-500/20
                       transition-all">
      Support this project
    </button>
  </div>
</div>
```

#### Stat Card (Dashboard)

```tsx
<div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-neutral-500">Total Raised</p>
      <p className="mt-2 text-3xl font-bold text-white">245.5 ETH</p>
      <p className="mt-2 text-sm text-green-400">+12% vs last month</p>
    </div>
    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
      <TrendingUp className="w-6 h-6 text-cyan-400" />
    </div>
  </div>
</div>
```

---

### 3. FORM COMPONENTS

#### Input Field

```tsx
<div className="mb-6">
  <label className="block text-sm font-semibold text-neutral-200 mb-2">
    Campaign Title
  </label>
  <input 
    type="text"
    placeholder="Enter campaign title..."
    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700
               text-white placeholder-neutral-500
               focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
               transition-all rounded-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
  />
  <p className="mt-1 text-xs text-neutral-500">Max 100 characters</p>
</div>
```

#### Select/Dropdown

```tsx
<div className="mb-6">
  <label className="block text-sm font-semibold text-neutral-200 mb-2">
    Category
  </label>
  <select className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700
                     text-white focus:border-cyan-500 focus:ring-cyan-500/20
                     rounded-lg transition-all">
    <option value="">Select category...</option>
    <option value="tech">Technology</option>
    <option value="art">Art & Design</option>
  </select>
</div>
```

#### Textarea

```tsx
<div className="mb-6">
  <label className="block text-sm font-semibold text-neutral-200 mb-2">
    Description
  </label>
  <textarea 
    placeholder="Describe your project..."
    rows={6}
    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700
               text-white placeholder-neutral-500
               focus:border-cyan-500 focus:ring-cyan-500/20
               rounded-lg transition-all resize-none"
  />
</div>
```

---

### 4. PROGRESS & STATUS

#### Progress Bar (Funding)

```tsx
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <span className="text-sm text-neutral-400">Funding progress</span>
    <span className="text-sm font-semibold text-white">65%</span>
  </div>
  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
         style={{width: '65%'}}
         className="transition-all duration-500" />
  </div>
</div>
```

#### Status Badge

```tsx
{/* Active */}
<span className="inline-flex items-center px-3 py-1 rounded-full 
                 text-sm font-semibold
                 bg-green-500/20 text-green-300 border border-green-500/50">
  ✓ Active
</span>

{/* Pending */}
<span className="inline-flex items-center px-3 py-1 rounded-full 
                 text-sm font-semibold
                 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
  ⏳ Pending
</span>

{/* Failed */}
<span className="inline-flex items-center px-3 py-1 rounded-full 
                 text-sm font-semibold
                 bg-red-500/20 text-red-300 border border-red-500/50">
  ✗ Failed
</span>

{/* Succeeded */}
<span className="inline-flex items-center px-3 py-1 rounded-full 
                 text-sm font-semibold
                 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
  ★ Succeeded
</span>
```

---

### 5. MODALS & DIALOGS

#### Confirmation Modal (Transaction)

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl 
                  w-full max-w-md shadow-2xl p-6">
    
    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Confirm Contribution</h2>
      <button onClick={close} className="text-neutral-500 hover:text-white">
        ✕
      </button>
    </div>

    {/* Content */}
    <div className="space-y-4 mb-6">
      <div className="flex justify-between py-3 border-b border-neutral-800">
        <span className="text-neutral-400">Project</span>
        <span className="font-semibold text-white">AI Innovation Hub</span>
      </div>
      <div className="flex justify-between py-3 border-b border-neutral-800">
        <span className="text-neutral-400">Amount</span>
        <span className="font-semibold text-cyan-400">2.5 ETH</span>
      </div>
      <div className="flex justify-between py-3 border-b border-neutral-800">
        <span className="text-neutral-400">Gas fee</span>
        <span className="font-semibold text-white">0.015 ETH</span>
      </div>
      <div className="flex justify-between py-3 bg-neutral-800/50 px-4 rounded-lg">
        <span className="text-neutral-300 font-semibold">Total</span>
        <span className="font-bold text-white">2.515 ETH</span>
      </div>
    </div>

    {/* Warning */}
    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
      <p className="text-sm text-yellow-300">
        ⚠️ This transaction cannot be undone once confirmed on the blockchain.
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <button onClick={close} className="flex-1 px-4 py-3 bg-neutral-800 
                                        text-white font-semibold rounded-lg
                                        hover:bg-neutral-700 transition-colors">
        Cancel
      </button>
      <button onClick={confirm} className="flex-1 px-4 py-3 bg-gradient-to-r 
                                         from-cyan-500 to-blue-600
                                         text-white font-semibold rounded-lg
                                         hover:shadow-lg hover:shadow-cyan-500/20
                                         transition-all">
        {loading ? 'Processing...' : 'Confirm'}
      </button>
    </div>
  </div>
</div>
```

---

### 6. NOTIFICATIONS

#### Toast Notification (Bottom right)

```tsx
{/* Success */}
<div className="fixed bottom-4 right-4 flex items-start gap-3 
                bg-green-500/10 border border-green-500/50 
                rounded-lg p-4 max-w-sm shadow-lg z-50">
  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold text-white">Success!</p>
    <p className="text-sm text-green-300">Your contribution has been recorded.</p>
  </div>
</div>

{/* Error */}
<div className="fixed bottom-4 right-4 flex items-start gap-3 
                bg-red-500/10 border border-red-500/50 
                rounded-lg p-4 max-w-sm shadow-lg z-50">
  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold text-white">Transaction Failed</p>
    <p className="text-sm text-red-300">Insufficient balance. Please check your wallet.</p>
  </div>
</div>

{/* Info */}
<div className="fixed bottom-4 right-4 flex items-start gap-3 
                bg-blue-500/10 border border-blue-500/50 
                rounded-lg p-4 max-w-sm shadow-lg z-50">
  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold text-white">Transaction Pending</p>
    <p className="text-sm text-blue-300">Waiting for confirmation...</p>
  </div>
</div>
```

---

### 7. LOADING STATES

#### Skeleton Screen (Campaign Cards)

```tsx
<div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
  {/* Image skeleton */}
  <div className="h-48 bg-neutral-800 animate-pulse" />
  
  {/* Content skeleton */}
  <div className="p-6 space-y-4">
    <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
    <div className="h-5 w-3/4 bg-neutral-800 rounded animate-pulse" />
    <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
    <div className="h-8 w-full bg-neutral-800 rounded animate-pulse" />
  </div>
</div>
```

#### Spinner (Transaction pending)

```tsx
<div className="inline-flex items-center gap-2">
  <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 
                  rounded-full animate-spin" />
  <span className="text-sm text-neutral-300">Processing...</span>
</div>
```

---

## 📄 PAGE TEMPLATES

### 1. LANDING PAGE (Home)

**Goal:** Convert visitors → contributors + creators

**Structure:**
```
┌─────────────────────────────────────────┐
│  NAVIGATION BAR                         │
│  - Logo | Links | Wallet Connect       │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │
│  - Headline: "Fund Your Ideas On-Chain"│
│  - Subheading: Clear value prop        │
│  - CTA: "Get Started" + "View Campaigns"│
│  - Hero Image: Modern, inspiring       │
│                                         │
├─────────────────────────────────────────┤
│  STATS SECTION                          │
│  - Total ETH raised                    │
│  - Active campaigns                    │
│  - Contributors                        │
│  - Animated counters                   │
│                                         │
├─────────────────────────────────────────┤
│  FEATURED CAMPAIGNS (3-6 cards)        │
│  - Campaign cards with images          │
│  - Progress bars                       │
│  - CTA: "Support this project"         │
│                                         │
├─────────────────────────────────────────┤
│  HOW IT WORKS                           │
│  Step 1: Connect wallet                │
│  Step 2: Browse campaigns              │
│  Step 3: Contribute ETH                │
│  Step 4: Track your investment         │
│                                         │
├─────────────────────────────────────────┤
│  BENEFITS SECTION                       │
│  - Transparent (blockchain)            │
│  - Instant payouts                     │
│  - Auto-refunds                        │
│  - Community-driven                    │
│                                         │
├─────────────────────────────────────────┤
│  FAQ / TRUST SECTION                    │
│  - Security                            │
│  - How refunds work                    │
│  - Gas fees explained                  │
│                                         │
├─────────────────────────────────────────┤
│  CTA SECTION                            │
│  - "Start Creating" (bold)             │
│  - "Explore Campaigns"                 │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  - Links, social, legal                │
└─────────────────────────────────────────┘
```

**Design Notes:**
- Hero: Gradient background (dark blue to cyan)
- Stats: Counter animations (on scroll)
- Cards: Hover lift effect + shadow
- Typography: Bold, clear hierarchy
- CTA buttons: Gradient, always visible

---

### 2. CAMPAIGNS LIST PAGE

**Goal:** Browse & filter campaigns easily

**Structure:**
```
┌─────────────────────────────────────────┐
│  NAVIGATION BAR                         │
├─────────────────────────────────────────┤
│                                         │
│  PAGE HEADER                            │
│  - Title: "Explore Campaigns"           │
│  - Subtitle: Show total active         │
│                                         │
├─────────────────────────────────────────┤
│  FILTERS & SEARCH (Sticky on scroll)   │
│  ┌─────────────────────────────────┐   │
│  │ [Search box]  [Filter]  [Sort]  │   │
│  │ Categories: Tech | Art | Social │   │
│  │ Status: Active | Ended | Funded │   │
│  │ Amount: Low → High              │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  CAMPAIGN GRID (3-4 columns)            │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │Card  │ │Card  │ │Card  │           │
│  └──────┘ └──────┘ └──────┘           │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │Card  │ │Card  │ │Card  │           │
│  └──────┘ └──────┘ └──────┘           │
│                                         │
├─────────────────────────────────────────┤
│  PAGINATION                             │
│  < Previous  [1] [2] [3]  Next >       │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

**Design Notes:**
- Filters: Sticky header on scroll
- Cards: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Search: Auto-clear suggestions
- Empty state: "No campaigns found" + icon
- Lazy loading: Infinite scroll or pagination

---

### 3. CAMPAIGN DETAIL PAGE

**Goal:** Detailed info + contributor call-to-action

**Structure:**
```
┌──────────────────────────────────────────────┐
│  NAVIGATION BAR                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────┐  ┌──────────────┐ │
│  │                      │  │ RIGHT PANEL  │ │
│  │  HERO IMAGE (16:9)   │  │              │ │
│  │  + Category Badge    │  │ CONTRIBUTION │ │
│  │  + Bookmark icon     │  │ WIDGET       │ │
│  └──────────────────────┘  │              │ │
│                             │ - Title      │ │
│  CONTENT                     │ - Goal      │ │
│  ┌──────────────────────┐   │ - Raised    │ │
│  │ TITLE                │   │ - Days left │ │
│  │ Creator info         │   │ - Contributors
│  │ Category             │   │              │ │
│  │                      │   │ [Contribute] │ │
│  │ DESCRIPTION          │   │ [Share]      │ │
│  │ (Rich text)          │   │              │ │
│  │                      │   └──────────────┘ │
│  │ PROGRESS BAR         │                    │
│  │ (Visual)             │                    │
│  │                      │                    │
│  │ UPDATES SECTION      │                    │
│  │ - Creator updates    │                    │
│  │                      │                    │
│  │ COMMENTS/DISCUSSION  │                    │
│  │                      │                    │
│  │ CONTRIBUTORS LIST    │                    │
│  │ - Recent backers     │                    │
│  │                      │                    │
│  └──────────────────────┘                    │
│                                              │
├──────────────────────────────────────────────┤
│  FOOTER                                      │
└──────────────────────────────────────────────┘
```

**Right Panel (Contribution Widget) - Desktop:**
```
┌─────────────────────────┐
│ PROJECT STATUS          │
├─────────────────────────┤
│                         │
│ 65% Funded              │
│ [═══════════════╌╌╌╌]   │
│                         │
│ 52.5 ETH / 80 ETH       │
│                         │
│ ⏳ 14 days left          │
│                         │
├─────────────────────────┤
│ CONTRIBUTION            │
│ [Input: 1.5 ETH]        │
│                         │
│ Est. gas fee: 0.02 ETH  │
│ Total: 1.52 ETH         │
│                         │
│ [CONTRIBUTE NOW]        │
│                         │
├─────────────────────────┤
│ 👥 1,284 backers        │
│ 📍 Smart contract verified
│ 🔗 View on block explorer
│ ✓ Refund on failure     │
│                         │
├─────────────────────────┤
│ [Share on Twitter]      │
│ [Copy link]             │
└─────────────────────────┘
```

---

### 4. CREATE CAMPAIGN PAGE

**Goal:** Step-by-step campaign creation (no friction)

**Structure (Multi-step form):**

**Step 1 - Project Basics**
```
┌──────────────────────────┐
│ CREATE A CAMPAIGN        │
│ Step 1 of 4              │
│                          │
│ [Project Title]          │
│ [Category selector]      │
│ [Short Description]      │
│                          │
│ < Back  [Next >]         │
└──────────────────────────┘
```

**Step 2 - Details**
```
┌──────────────────────────┐
│ CREATE A CAMPAIGN        │
│ Step 2 of 4              │
│                          │
│ [Full Description]       │
│ [Image Upload]           │
│ [Preview]                │
│                          │
│ < Back  [Next >]         │
└──────────────────────────┘
```

**Step 3 - Funding Details**
```
┌──────────────────────────┐
│ CREATE A CAMPAIGN        │
│ Step 3 of 4              │
│                          │
│ [Funding Goal (ETH)]     │
│ [Deadline (Days)]        │
│ [Preview calculation]    │
│                          │
│ < Back  [Next >]         │
└──────────────────────────┘
```

**Step 4 - Review & Deploy**
```
┌──────────────────────────┐
│ CREATE A CAMPAIGN        │
│ Step 4 of 4              │
│                          │
│ PROJECT PREVIEW          │
│ [Card preview]           │
│                          │
│ ☐ I understand risks     │
│ ☐ Accept terms           │
│                          │
│ [Deploy to blockchain]   │
│ (Shows gas estimate)     │
│                          │
│ < Back  [Deploy]         │
└──────────────────────────┘
```

**Design Notes:**
- Progress bar at top
- One section per screen (mobile-first)
- Validation on each field
- Preview pane (optional, desktop)
- Save draft (localStorage)

---

### 5. DASHBOARD PAGE

**Goal:** User overview of contributions + campaigns created

**Structure:**
```
┌──────────────────────────────┐
│  NAVIGATION BAR              │
│  Active: Dashboard           │
├──────────────────────────────┤
│                              │
│  WELCOME SECTION             │
│  "Welcome back, 0x742d..."   │
│  [Edit Profile]              │
│                              │
├──────────────────────────────┤
│  STATS GRID (4 columns)      │
│  ┌────────┐ ┌────────┐       │
│  │Total   │ │Total   │       │
│  │Raised  │ │Contrib │       │
│  └────────┘ └────────┘       │
│  ┌────────┐ ┌────────┐       │
│  │Campaigns│ │Pending │      │
│  │Created  │ │Trans.  │      │
│  └────────┘ └────────┘       │
│                              │
├──────────────────────────────┤
│  TABS                        │
│  [My Campaigns] [Backed By Me] [Transactions]
│                              │
├──────────────────────────────┤
│  MY CAMPAIGNS (Creator)      │
│  ┌─────────────┐             │
│  │ Campaign 1  │  Status OK   │
│  │ 80% funded  │  [Edit]      │
│  └─────────────┘             │
│                              │
│  ┌─────────────┐             │
│  │ Campaign 2  │  Failed      │
│  │ 45% funded  │  [Refund]    │
│  └─────────────┘             │
│                              │
├──────────────────────────────┤
│  BACKED BY ME (Contributor)  │
│  ┌─────────────┐             │
│  │ Project 1   │  2.5 ETH     │
│  │ Active      │  [View]      │
│  └─────────────┘             │
│                              │
│  ┌─────────────┐             │
│  │ Project 2   │  1.0 ETH     │
│  │ Succeeded   │  [View]      │
│  └─────────────┘             │
│                              │
├──────────────────────────────┤
│  RECENT TRANSACTIONS         │
│  - Contributed 2.5 ETH   ✓   │
│  - Campaign created      ✓   │
│  - Withdrawn 25 ETH      ✓   │
│                              │
└──────────────────────────────┘
```

---

### 6. PROFILE PAGE

**Goal:** User profile + account settings

**Structure:**
```
┌──────────────────────────────┐
│  NAVIGATION BAR              │
│  Active: Profile             │
├──────────────────────────────┤
│                              │
│  PROFILE HEADER              │
│  [Avatar] 0x742d...8C42      │
│  [Edit Profile]              │
│                              │
├──────────────────────────────┤
│  PROFILE SECTION             │
│  - Username                  │
│  - Bio                       │
│  - Joined: March 2026        │
│                              │
│  - Email (if provided)       │
│  - Verified: ✓               │
│                              │
│  Stats:                      │
│  - Campaigns created: 3      │
│  - Backed: 15 projects       │
│  - Total contributed: 50 ETH │
│                              │
├──────────────────────────────┤
│  SETTINGS TABS               │
│  [Account] [Security] [Notifications]
│                              │
├──────────────────────────────┤
│  ACCOUNT SETTINGS            │
│  - Update avatar             │
│  - Update username           │
│  - Update bio                │
│  - [Save changes]            │
│                              │
│  SECURITY                    │
│  - Connected wallet          │
│  - Disconnect wallet         │
│  - Change network            │
│                              │
│  NOTIFICATIONS               │
│  ☑ Campaign updates          │
│  ☑ New backers               │
│  ☑ Milestone reached         │
│  ☑ Comments                  │
│                              │
├──────────────────────────────┤
│  DANGER ZONE                 │
│  [Delete account]            │
│  [Sign out everywhere]       │
│                              │
└──────────────────────────────┘
```

---

## 🔗 WEB3 SPECIFIC UX

### 1. WALLET CONNECTION FLOW

```
FLOW:

┌─ User clicks "Connect Wallet"
│
├─→ MetaMask dialog appears
│   (Browser popup)
│
├─→ User approves connection
│
├─→ App shows "Connecting..." spinner
│
├─→ Success! Show:
│   - Connected address (truncated)
│   - User avatar (if set)
│   - Balance preview
│   - Profile menu
│
└─ User can now transact

UI STATE:
- Disconnected: "Connect Wallet" (blue button)
- Connecting: "Connecting..." (spinner)
- Connected: "0x742d...8C42" (truncated address in navbar)
```

**Button States:**
```tsx
// Disconnected
<button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600">
  Connect Wallet
</button>

// Connecting
<button disabled className="px-6 py-3 bg-blue-600 opacity-50">
  <Spinner /> Connecting...
</button>

// Connected (Navbar)
<button className="px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
  0x742d...8C42
  <ChevronDown />
</button>
```

---

### 2. TRANSACTION STATES & FEEDBACK

```
PENDING:
┌─────────────────────────────┐
│ ⏳ Transaction Pending      │
│                             │
│ Waiting for confirmation... │
│ [View on Etherscan]         │
│                             │
│ Do not close this page      │
└─────────────────────────────┘
   (Blue banner, top of page)

CONFIRMING:
┌─────────────────────────────┐
│ ✓ 3/12 confirmations        │
│ [Progress bar]              │
│ Estimated time: 2 mins      │
└─────────────────────────────┘

SUCCESS:
┌─────────────────────────────┐
│ ✓ Transaction Confirmed!    │
│                             │
│ Your contribution of 2.5 ETH│
│ has been recorded.          │
│                             │
│ [View on Etherscan]         │
│ [Back to dashboard]         │
└─────────────────────────────┘
   (Green toast, bottom right)

FAILED:
┌─────────────────────────────┐
│ ✗ Transaction Failed        │
│                             │
│ Error: Insufficient balance │
│                             │
│ Please check your wallet    │
│ and try again.              │
│                             │
│ [Retry] [View error]        │
└─────────────────────────────┘
   (Red toast, bottom right)
```

**Implementation:**
```tsx
// Enum for states
enum TxStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Display based on status
{status === TxStatus.PENDING && (
  <div className="fixed top-0 left-0 right-0 bg-blue-600/10 border-b border-blue-500 p-4">
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Transaction pending...</span>
      <a href={etherScanLink} target="_blank">View</a>
    </div>
  </div>
)}
```

---

### 3. ETH AMOUNT DISPLAYS

```
Display Format:
- 1.5 ETH (no decimals)
- 0.015 ETH (max 3-4 decimals)
- 0.00000001 ETH = "< 0.00001 ETH" (too small)

With USD equivalent (fetch live rate):
- 1.5 ETH ≈ $3,000 USD

In tables/lists:
- 2.5 ETH  [right-aligned, monospace]

Wallet balance:
- Balance: 5.234 ETH
- (Shows in profile menu)

Gas fees (disclosure):
- Estimated gas: 0.015 ETH
- (Shown in contribution modal)
```

---

### 4. BLOCKCHAIN TRANSPARENCY

**Smart Contract Verification:**
```
┌──────────────────────────────┐
│ ✓ Smart Contract Verified    │
│                              │
│ Campaign Address:            │
│ 0x1a2b3c...9z8y            │
│                              │
│ [View on Etherscan]          │
│ [View source code]           │
│                              │
│ Network: Ethereum Sepolia    │
│ Status: Verified (Etherscan) │
│                              │
│ This ensures full            │
│ transparency and security.   │
└──────────────────────────────┘
```

**Transaction List (History):**
```
Date          | Type        | Amount    | Status
─────────────────────────────────────────────────
Apr 23 14:32  | Contribution| 2.5 ETH   | ✓ Confirmed
Apr 22 10:15  | Created     | Campaign  | ✓ Confirmed
Apr 20 16:42  | Withdraw    | 25 ETH    | ✓ Confirmed

Each row:
- Clickable → View on Etherscan
- Status badge (confirmed/pending/failed)
- Copy tx hash on hover
```

---

### 5. NETWORK INDICATOR

**Current Implementation:**
```
┌─ Navbar right side
├─ "Sepolia" or "Mainnet" badge
├─ Network switch dropdown
│  - Current: Sepolia (active)
│  - Other: Mainnet (disabled - coming soon)
│
└─ Color coding:
   - Sepolia: Yellow/Warning (testnet)
   - Mainnet: Green (production)
```

**UI:**
```tsx
<div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 
                border border-yellow-500/50 rounded-lg">
  <div className="w-2 h-2 rounded-full bg-yellow-500" />
  <span className="text-sm font-semibold text-yellow-300">Sepolia</span>
</div>
```

---

## 🎯 USER FLOWS

### Flow 1: New Visitor → Contributor

```
START
  ↓
[Landing Page]
  User sees hero + stats
  User intrigued
  ↓
[Connect Wallet]
  MetaMask prompt
  User approves
  ↓
[Browse Campaigns]
  See featured campaigns
  Filter/search
  Click on project
  ↓
[View Campaign Details]
  Read description
  See progress bar
  See backers
  ↓
[Contribute]
  Enter ETH amount
  Review details
  Confirm on MetaMask
  ↓
[Transaction]
  Pending → Confirming → Success
  ↓
[Show Success]
  "You contributed 2.5 ETH!"
  Add to dashboard
  ↓
END (Happy contributor)
```

---

### Flow 2: Creator → Create Campaign

```
START
  ↓
[Landing Page]
  User reads "Start Creating"
  ↓
[Connect Wallet]
  MetaMask prompt
  ↓
[Dashboard]
  See "Create Campaign" button
  ↓
[Create Campaign - Step 1]
  Title + Category
  ↓
[Create Campaign - Step 2]
  Description + Image
  ↓
[Create Campaign - Step 3]
  Goal + Deadline
  ↓
[Create Campaign - Step 4]
  Review + Deploy
  ↓
[Deploy to Blockchain]
  MetaMask transaction
  Gas estimate shown
  ↓
[Processing]
  Pending → Confirming → Success
  ↓
[Campaign Live]
  Redirect to campaign page
  Show success message
  ↓
END (Campaign live!)
```

---

### Flow 3: Refund Flow (Campaign Failed)

```
START
  ↓
[Campaign Deadline Passed]
  Goal not reached
  ↓
[System Detects]
  Auto-refund process starts
  Cron job triggers
  ↓
[Each Contributor]
  Gets notified
  Sees "Refund pending"
  ↓
[Blockchain]
  Smart contract processes
  Sends ETH back to each wallet
  ↓
[Success]
  Contributor receives ETH
  Dashboard shows "Refunded"
  ↓
END (Automatic fairness)
```

---

## 💡 SPECIFIC UX IMPROVEMENTS

### Current → Improved

| Issue | Current | Improved | Implementation |
|-------|---------|----------|-----------------|
| **Onboarding** | "Click here" unclear | Step-by-step guide | Animated tour + tooltips |
| **Campaign browsing** | Long lists | Filters + search | Sticky filter bar |
| **Mobile experience** | Not optimized | Mobile-first design | Responsive components |
| **Contribution flow** | Many clicks | One-click confirm | Modal flow |
| **Error messages** | Generic | Specific help | Error codes + solutions |
| **Loading states** | No feedback | Skeletons + spinners | Smooth transitions |
| **Wallet balance** | Not shown | Displayed prominently | Navbar + profile |
| **Gas fees** | Hidden | Transparent estimate | Shown in modal |
| **Transaction history** | Absent | Full history | Dashboard tab |
| **Empty states** | Blank | Helpful messages | Icons + CTAs |

---

## 🎯 IMPLEMENTATION ROADMAP

### PHASE 1: FOUNDATION (Week 1-2)
Priority: **Critical** ✅

**Deliverables:**
- [ ] Tailwind config: Colors + typography + spacing
- [ ] Global CSS: Dark mode + variables
- [ ] Base components: Button, Card, Input, Badge
- [ ] Layout: Navbar + footer
- [ ] Color update on all pages

**Files to create/update:**
```
tailwind.config.js        (color system)
app/globals.css           (CSS variables + dark mode)
components/ui/Button.tsx  (reusable button)
components/ui/Card.tsx    (campaign card)
components/ui/Input.tsx   (form inputs)
components/ui/Badge.tsx   (status badges)
components/Layout.tsx     (navbar + footer)
```

---

### PHASE 2: PAGES (Week 2-3)
Priority: **High** ⚠️

**Deliverables:**
- [ ] Landing page redesign
- [ ] Campaigns list improvements
- [ ] Campaign detail page
- [ ] Dashboard modernization
- [ ] Profile page update

**Files to update:**
```
app/page.tsx              (home redesign)
app/campaigns/page.tsx    (filters + search)
app/campaigns/[id]/page.tsx (detail page)
app/dashboard/page.tsx    (dashboard layout)
app/profile/page.tsx      (profile design)
```

---

### PHASE 3: WEB3 UX (Week 3-4)
Priority: **High** ⚠️

**Deliverables:**
- [ ] Transaction state indicators
- [ ] Wallet connection flow
- [ ] Confirmation modals
- [ ] Toast notifications
- [ ] Gas fee display

**Files to create:**
```
components/ui/Modal.tsx        (transaction confirmations)
components/ui/Toast.tsx        (notifications)
components/TransactionStatus.tsx (pending/success/error)
components/GasEstimate.tsx     (fee display)
components/ConfirmModal.tsx    (contribution confirm)
```

---

### PHASE 4: POLISH (Week 4+)
Priority: **Medium** 📋

**Deliverables:**
- [ ] Animations & transitions
- [ ] Loading states (skeletons)
- [ ] Empty states
- [ ] Error boundaries
- [ ] Performance optimization

---

## 🎨 COLOR IMPLEMENTATION GUIDE

### Update Tailwind Config

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    colors: {
      // Neutrals
      'neutral': {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
      },
      
      // Primary (Cyan → Blue)
      'primary': {
        '50': '#f0f9ff',
        '100': '#e0f2fe',
        '200': '#bae6fd',
        '300': '#7dd3fc',
        '400': '#38bdf8',
        '500': '#0ea5e9',    // PRIMARY
        '600': '#0284c7',    // HOVER
        '700': '#0369a1',    // PRESSED
        '900': '#082f49',
      },
      
      // Accent (Gold)
      'accent': {
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
      },
    },
    
    extend: {
      // Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      },
    },
  },
};
```

### Update Global CSS

```css
/* app/globals.css */

:root {
  color-scheme: dark;
}

body {
  @apply bg-neutral-950 text-neutral-100;
}

/* Backgrounds */
.bg-base {
  @apply bg-neutral-950;
}

.bg-surface {
  @apply bg-neutral-900;
}

.bg-surface-alt {
  @apply bg-neutral-800;
}

/* Borders */
.border-base {
  @apply border-neutral-800;
}

.border-light {
  @apply border-neutral-700;
}

/* Text colors */
.text-muted {
  @apply text-neutral-500;
}

.text-secondary {
  @apply text-neutral-400;
}

/* Primary gradient */
.btn-primary {
  @apply bg-gradient-to-r from-primary-500 to-cyan-500 
         text-white font-semibold rounded-lg
         hover:shadow-lg hover:shadow-primary-500/20
         transition-all duration-200;
}

/* Focus ring */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500/50;
}
```

---

## ✅ QUICK WINS (Immediate Changes)

These can be done NOW (< 2 hours):

1. **Update color palette** in tailwind.config.js
2. **Add CSS gradients** to global.css  
3. **Update navbar colors** to new primary
4. **Update buttons** to use new colors
5. **Add dark mode** toggle preference
6. **Update card borders** to new neutral color

**Impact:** 40% visual improvement immediately

---

## 🎯 DESIGN PRINCIPLES SUMMARY

### Remember These Always:

1. **Dark Mode is Default** - Web3 users expect it
2. **Clarity > Beauty** - Users need to understand actions
3. **Feedback is Gold** - Show users what's happening
4. **Web3 is Trustless** - Transparency everywhere
5. **Mobile First** - 50%+ traffic from mobile
6. **Accessibility** - WCAG 2.1 AA minimum
7. **Performance** - Every ms counts
8. **Consistency** - Same components everywhere

---

## 📞 NEXT STEPS

1. Review this design system as a team
2. Validate color palette with stakeholders
3. Start Phase 1 implementation
4. Get feedback early (often)
5. Iterate based on user testing

---

**Version Control:** Track changes in DESIGN_SYSTEM_CHANGELOG.md  
**Last Review:** April 2026  
**Next Review:** May 2026

