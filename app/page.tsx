"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CampaignCard } from "@/components/CampaignCard";
import { Button } from "@/components/ui/Button";
import { TrendingUp } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  goal_amount: number;
  current_amount: number;
}

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns?limit=6&status=active");
        const response = await res.json();
        setCampaigns(response.data?.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#030712',
        paddingTop: '80px'
      }}>
        {/* Hero Section */}
        <HeroSection />

        {/* Trending Section */}
        <section style={{
          padding: '80px 24px',
          backgroundColor: '#030712'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <TrendingUp style={{
                  width: '24px',
                  height: '24px',
                  color: '#06b6d4'
                }} />
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>En tendance maintenant</h2>
              </div>
              <p style={{
                fontSize: '16px',
                color: 'rgba(209, 213, 219, 1)'
              }}>
                Les projets qui captivent le plus de contributeurs cette semaine
              </p>
            </div>

            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '48px 0'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #06b6d4',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              </div>
            ) : campaigns.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '64px 0'
              }}>
                <p style={{
                  color: 'rgba(209, 213, 219, 1)',
                  marginBottom: '16px'
                }}>Aucun projet disponible pour le moment</p>
                <Link href="/explore">
                  <Button variant="primary">Explorer tous les projets</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(to right, rgba(6,182,212,0.1) 0%, transparent 50%, rgba(2,132,199,0.1) 100%)',
          borderTop: '1px solid rgba(31, 41, 55, 0.5)',
          borderBottom: '1px solid rgba(31, 41, 55, 0.5)'
        }}>
          <div style={{
            maxWidth: '896px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div style={{
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px'
              }}>
                Vous avez une idée révolutionnaire?
              </h2>
              <p style={{
                fontSize: '18px',
                color: 'rgba(209, 213, 219, 1)'
              }}>
                Lancez votre campagne et connectez-vous avec des supporters passionnés par votre vision.
              </p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Link href="/explore">
                  <Button variant="primary" size="lg">
                    Découvrir plus de projets
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Voir mes contributions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
