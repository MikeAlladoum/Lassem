# 🚀 IMPLEMENTATION GUIDE - Phase 1

**Status:** Ready to implement  
**Priority:** Critical  
**Estimated Time:** 2-3 hours

---

## 📋 PHASE 1 TASKS (This Week)

### STEP 1: Update tailwind.config.js
**File:** `tailwind.config.js`  
**Action:** Complete rewrite with new color system

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NEUTRAL - Grayscale
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

        // PRIMARY - Cyan to Blue (Main brand color)
        'primary': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',   // MAIN - Use in buttons
          '600': '#0284c7',   // HOVER
          '700': '#0369a1',   // PRESSED
          '900': '#082f49',
        },

        // ACCENT - Gold/Amber (Secondary)
        'accent': {
          '400': '#fbbf24',
          '500': '#f59e0b',   // ACTIVE
          '600': '#d97706',   // HOVER
        },

        // STATUS COLORS
        'success': {
          '50': '#f0fdf4',
          '500': '#22c55e',   // Success feedback
          '600': '#16a34a',
          '700': '#15803d',
        },

        'warning': {
          '50': '#fffbeb',
          '500': '#f59e0b',   // Alerts
          '600': '#d97706',
        },

        'danger': {
          '50': '#fef2f2',
          '500': '#ef4444',   // Errors
          '600': '#dc2626',
          '700': '#b91c1c',
        },

        // SEMANTIC (for quick ref in components)
        'bg-base': '#0a0e27',
        'bg-surface': '#1a2043',
        'bg-surface-alt': '#252f50',
        'border-base': '#3f4a6f',
      },

      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a2043 0%, #0a0e27 100%)',
      },

      boxShadow: {
        'glow': '0 0 20px rgba(15, 165, 233, 0.3)',
        'glow-lg': '0 0 40px rgba(15, 165, 233, 0.4)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.3)',
      },

      fontSize: {
        // Type scale
        'display': ['52px', { lineHeight: '64px', fontWeight: '700', letterSpacing: '0.02em' }],
        'h2': ['36px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '0' }],
        'h3': ['28px', { lineHeight: '36px', fontWeight: '600', letterSpacing: '0' }],
        'h4': ['22px', { lineHeight: '32px', fontWeight: '600', letterSpacing: '0' }],
        'lg-body': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },

      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Inter"', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },

      spacing: {
        'gutter-x': 'clamp(1rem, 5vw, 2rem)',
      },

      borderRadius: {
        'default': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
```

---

### STEP 2: Update app/globals.css

**File:** `app/globals.css`  
**Action:** Complete rewrite with new variables and utilities

```css
/* ============================================
   GLOBAL STYLES - DAMLEGEND DAPP
   ============================================ */

:root {
  /* Color variables */
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-accent: #f59e0b;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  /* Neutral palette */
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1f2937;
  --color-neutral-900: #111827;
  --color-neutral-950: #030712;

  /* Dark mode (default) */
  --bg-base: #0a0e27;
  --bg-surface: #1a2043;
  --bg-surface-alt: #252f50;
  --color-text: #f3f4f6;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-border: #3f4a6f;
  --color-border-light: #2d3555;

  color-scheme: dark;
}

/* Light mode (optional) */
html.light {
  --bg-base: #ffffff;
  --bg-surface: #f9fafb;
  --bg-surface-alt: #f3f4f6;
  --color-text: #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted: #9ca3af;
  --color-border: #e5e7eb;
  --color-border-light: #d1d5db;
}

/* ============================================
   BASE STYLES
   ============================================ */

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-base);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* ============================================
   TYPOGRAPHY
   ============================================ */

h1 {
  font-size: 52px;
  font-weight: 700;
  line-height: 64px;
  letter-spacing: -0.02em;
  margin: 0;
}

h2 {
  font-size: 36px;
  font-weight: 700;
  line-height: 48px;
  margin: 0;
}

h3 {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  margin: 0;
}

h4 {
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  margin: 0;
}

p {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
}

small {
  font-size: 12px;
  line-height: 16px;
  color: var(--color-text-muted);
}

a {
  color: var(--color-primary-500);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-primary-600);
  text-decoration: underline;
}

code {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  background-color: var(--bg-surface-alt);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-primary-400);
}

/* ============================================
   UTILITIES - COMMON PATTERNS
   ============================================ */

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 2rem);
}

/* Flex utilities */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Grid */
.grid-auto {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  gap: 1.5rem;
}

/* Backgrounds */
.bg-base {
  background-color: var(--bg-base);
}

.bg-surface {
  background-color: var(--bg-surface);
}

.bg-surface-alt {
  background-color: var(--bg-surface-alt);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.bg-gradient-accent {
  background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
}

/* Borders */
.border-base {
  border: 1px solid var(--color-border);
}

.border-light {
  border: 1px solid var(--color-border-light);
}

.rounded-lg {
  border-radius: 12px;
}

.rounded-xl {
  border-radius: 16px;
}

/* Text colors */
.text-muted {
  color: var(--color-text-muted);
}

.text-secondary {
  color: var(--color-text-secondary);
}

.text-primary {
  color: var(--color-primary-500);
}

.text-success {
  color: var(--color-success);
}

.text-danger {
  color: var(--color-danger);
}

.text-warning {
  color: var(--color-warning);
}

/* Typography utilities */
.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Shadows & Effects */
.shadow-glow {
  box-shadow: 0 0 20px rgba(15, 165, 233, 0.3);
}

.shadow-glow-lg {
  box-shadow: 0 0 40px rgba(15, 165, 233, 0.4);
}

.shadow-glow-accent {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.backdrop-blur {
  backdrop-filter: blur(10px);
}

/* Transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================
   FOCUS RING (Accessibility)
   ============================================ */

.focus-ring {
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 165, 233, 0.1),
    0 0 0 1px var(--color-primary-500);
}

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 165, 233, 0.1),
    0 0 0 1px var(--color-primary-500);
}

/* ============================================
   FORM ELEMENTS
   ============================================ */

input,
textarea,
select {
  background-color: var(--bg-surface);
  border: 1px solid var(--color-border-light);
  color: var(--color-text);
  font-family: inherit;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(15, 165, 233, 0.1);
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: var(--color-text-muted);
}

/* ============================================
   BUTTONS
   ============================================ */

button {
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  padding: 12px 24px;
  font-size: 16px;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(15, 165, 233, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--bg-surface);
  color: var(--color-text);
  padding: 12px 24px;
  border: 1px solid var(--color-border);
  font-size: 16px;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-surface-alt);
  border-color: var(--color-border);
}

/* Danger Button */
.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

/* ============================================
   MODAL / OVERLAY
   ============================================ */

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background-color: var(--bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* ============================================
   SCROLL BEHAVIOR
   ============================================ */

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar (Webkit browsers) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border);
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(15, 165, 233, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(15, 165, 233, 0.4);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

.animate-pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ============================================
   RESPONSIVE UTILITIES
   ============================================ */

@media (max-width: 768px) {
  h1 {
    font-size: 36px;
    line-height: 44px;
  }

  h2 {
    font-size: 28px;
    line-height: 36px;
  }

  .hide-mobile {
    display: none;
  }
}

@media (min-width: 769px) {
  .show-mobile {
    display: none;
  }
}

/* ============================================
   PRINT STYLES
   ============================================ */

@media print {
  body {
    background: white;
    color: black;
  }

  a {
    text-decoration: underline;
  }

  button {
    display: none;
  }
}
```

---

### STEP 3: Update app/layout.tsx

**File:** `app/layout.tsx`  
**Change:** Update metadata + background color

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAMLEGEND - Crowdfunding Blockchain",
  description: "Financez des projets innovants via la blockchain Ethereum Sepolia",
  keywords: "crowdfunding, blockchain, ethereum, web3, dapp",
  viewport: "width=device-width, initial-scale=1.0",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-neutral-950">
        {children}
      </body>
    </html>
  );
}
```

---

### STEP 4: Create Base UI Components

**New File:** `components/ui/Button.tsx`

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95",
      secondary:
        "bg-neutral-800 text-neutral-100 border border-neutral-700 hover:bg-neutral-700 active:scale-95",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:scale-95",
      ghost:
        "text-neutral-300 hover:text-white hover:bg-neutral-800/50 active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
```

**New File:** `lib/utils.ts`

```ts
export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

---

### STEP 5: Update Navbar

**File:** `components/Navbar.tsx`  
**Changes:** Use new colors + gradients

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Bell, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const router = useRouter();
  const wallet = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const shortAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : null;

  const handleDisconnect = () => {
    wallet.disconnect();
    setProfileMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-neutral-950/95 to-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-400 transition-all"
          >
            🎯 DAMLEGEND
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-neutral-300 hover:text-white transition-colors duration-200"
            >
              Accueil
            </Link>
            <Link
              href="/campaigns"
              className="text-neutral-300 hover:text-white transition-colors duration-200"
            >
              Campagnes
            </Link>
            {wallet.isConnected && (
              <Link
                href="/campaigns/create"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Créer
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet Button */}
            {!wallet.isConnected ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => wallet.connect()}
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg border border-neutral-700 transition-colors flex items-center gap-2"
                >
                  {shortAddress}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 inline mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <hr className="border-neutral-800 my-2" />
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900 border-t border-neutral-800 py-4 px-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-neutral-300 hover:text-white"
            >
              Accueil
            </Link>
            <Link
              href="/campaigns"
              className="block px-4 py-2 text-neutral-300 hover:text-white"
            >
              Campagnes
            </Link>
            {wallet.isConnected && (
              <Link
                href="/campaigns/create"
                className="block px-4 py-2 text-neutral-300 hover:text-white"
              >
                Créer
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
```

---

### STEP 6: Checklist ✅

Before moving to Phase 2, verify:

- [ ] `tailwind.config.js` updated with new colors
- [ ] `app/globals.css` completely replaced
- [ ] `app/layout.tsx` updated with new colors
- [ ] `components/ui/Button.tsx` created
- [ ] `lib/utils.ts` created with `cn()` function
- [ ] `components/Navbar.tsx` updated with new design
- [ ] npm run dev works without errors
- [ ] Frontend loads at localhost:3000 with new colors
- [ ] Buttons show gradient colors
- [ ] Dark mode looks professional

---

## 🎯 PHASE 2 (Next Step)

Once Phase 1 is complete, we'll update:

1. **Landing page** (app/page.tsx)
   - Hero section with new colors
   - Featured campaigns grid
   - Stats display with animations

2. **Campaigns list** (app/campaigns/page.tsx)
   - Improved filters
   - Better card layout
   - Search bar at top

3. **Campaign detail** (app/campaigns/[id]/page.tsx)
   - Right-side contribution widget
   - Better progress bar
   - Contributor list

4. **Dashboard** (app/dashboard/page.tsx)
   - Stats cards with new design
   - Better tabs layout
   - Transaction history

5. **Profile** (app/profile/page.tsx)
   - User profile card
   - Settings tabs
   - Security section

---

## 🚀 QUICK START

```bash
# 1. Replace files
cp DESIGN_SYSTEM.md (reference)
# 2. Update tailwind.config.js
# 3. Update app/globals.css
# 4. Update app/layout.tsx
# 5. Create components/ui/Button.tsx
# 6. Create lib/utils.ts
# 7. Update components/Navbar.tsx

# 8. Test
npm run dev

# Visit http://localhost:3000
# Verify colors and styling
```

---

**Status:** Ready for Phase 1 Implementation  
**Estimated Duration:** 2-3 hours  
**Next Review:** After Phase 1 completion

