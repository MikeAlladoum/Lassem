import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";

export function HeroSection() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom right, rgba(6,182,212,0.1) 0%, transparent 50%, rgba(2,132,199,0.1) 100%)'
      }} />
      
      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.3)',
            marginBottom: '16px'
          }}>
            <Zap style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#06b6d4' }}>
              Financez les projets qui vous passionnent
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 8vw, 56px)',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '1.2',
              marginBottom: '16px'
            }}>
              Découvrez les{' '}
              <span style={{
                background: 'linear-gradient(to right, #06b6d4, #06b6d4, #0284c7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                meilleures idées
              </span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(209, 213, 219, 0.8)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Soutinez des créateurs innovants et soyez les premiers à accéder aux projets révolutionnaires.
              Zéro frais cachés, totalement transparent.
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/explore" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" style={{ gap: '8px' }}>
                  Explorer les projets
                  <ArrowRight style={{ width: '20px', height: '20px' }} />
                </Button>
              </Link>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg">
                  Voir mes contributions
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
            marginTop: '64px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(31, 41, 55, 0.5)'
          }}>
            <div>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#06b6d4',
                marginBottom: '4px'
              }}>
                1.2K+
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(107, 114, 128, 1)' }}>
                Projets financés
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#06b6d4',
                marginBottom: '4px'
              }}>
                15K+
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(107, 114, 128, 1)' }}>
                Contributeurs actifs
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#06b6d4',
                marginBottom: '4px'
              }}>
                250 ETH
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(107, 114, 128, 1)' }}>
                Collectés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
