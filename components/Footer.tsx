"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Accueil", href: "/" },
      { label: "Campagnes", href: "/campaigns" },
      { label: "Explore", href: "/explore" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    company: [
      { label: "À propos", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Carrières", href: "#careers" },
      { label: "Contact", href: "mailto:Damlegen48@gmail.com" },
    ],
    legal: [
      { label: "Conditions", href: "#terms" },
      { label: "Confidentialité", href: "#privacy" },
      { label: "Cookies", href: "#cookies" },
      { label: "CGU", href: "#cgu" },
    ],
    social: [
      { icon: Github, href: "https://github.com/MikeAlladoum", label: "GitHub" },
      { icon: Twitter, href: "http://x.com/Mike_Alladoum", label: "Twitter" },
      { icon: Linkedin, href: "https://www.linkedin.com/in/mike-alladoum-a557102a1/", label: "LinkedIn" },
      { icon: Mail, href: "mailto:Damlegen48@gmail.com", label: "Email" },
    ],
  };

  return (
    <footer style={{
      backgroundColor: '#030712',
      borderTop: '1px solid rgba(31, 41, 55, 0.5)',
      marginTop: '120px',
    }}>
      {/* Main Footer Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Brand Section */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#22d3ee' }}>
                DAMLEGEND
              </h3>
            </Link>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Plateforme de financement participatif décentralisée sur Web3
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {footerLinks.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                      color: '#d1d5db',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
                      e.currentTarget.style.color = '#22d3ee';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.5)';
                      e.currentTarget.style.color = '#d1d5db';
                    }}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Produit
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.product.map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#22d3ee';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Entreprise
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.company.map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#22d3ee';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Légal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.legal.map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#22d3ee';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(31, 41, 55, 0.5)',
          paddingTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}>
          {/* Copyright */}
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: 0,
          }}>
            © {currentYear} DAMLEGEND Corporation. Tous droits réservés.
          </p>

          {/* Additional Info */}
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '12px',
            color: '#6b7280',
          }}>
            <span>Plateforme Web3</span>
            <span>•</span>
            <span>Décentralisée</span>
            <span>•</span>
            <span>Sécurisée</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
