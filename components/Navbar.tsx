"use client";

import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const router = useRouter();
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const handleWalletClick = () => {
    if (!wallet.isConnected) {
      wallet.connect();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/campaigns", label: "Campagnes" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(31, 41, 55, 0.5)',
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-cyan rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
              DAMLEGEND
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {wallet.isConnected ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-cyan-400">
                  {formatAddress(wallet.address || "")}
                </span>
              </div>
            ) : (
              <button
                onClick={handleWalletClick}
                disabled={wallet.isLoading}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {wallet.isLoading ? "Connexion..." : "Connect Wallet"}
              </button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-neutral-300 hover:text-white"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isOpen && (
          <div className="border-t border-neutral-800 py-4 space-y-2" style={{ borderColor: 'rgba(31, 41, 55, 0.5)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-cyan-300 hover:text-cyan-200 hover:bg-neutral-800/50 rounded transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
