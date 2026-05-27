"use client";

import Link from "next/link";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useWallet } from "@/hooks/useWallet";
import { useFetch } from "@/hooks/useFetch";
import { TrendingUp, Zap, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Campaign {
  id: number;
  title: string;
  goal_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
}

interface Contribution {
  id: number;
  amount: number;
  created_at: string;
  campaign: { id: number; title: string };
}

export default function DashboardPage() {
  const wallet = useWallet();
  const { data: contributions, loading: loadContrib } = useFetch<Contribution[]>("/api/contributions", "GET", true);
  const { data: campaigns, loading: loadCamp } = useFetch<Campaign[]>("/api/campaigns", "GET", true);

  const contribArray = contributions ?? [];
  const campaignsArray = campaigns ?? [];

  const totalContributed = contribArray.reduce((sum, c) => sum + c.amount, 0);
  const totalRaised = campaignsArray.reduce((sum, c) => sum + c.current_amount, 0);

  return (
    <ProtectedPage loading={loadContrib || loadCamp}>
      {/* Header */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-neutral-300">Bienvenue {wallet.address?.slice(0, 6)}...</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-cyan-400" />
              <p className="text-neutral-300 text-sm uppercase tracking-wide">Total contribué</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalContributed.toFixed(2)} ETH</p>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={20} className="text-blue-400" />
              <p className="text-neutral-300 text-sm uppercase tracking-wide">Campagnes lancées</p>
            </div>
            <p className="text-3xl font-bold text-white">{campaignsArray.length}</p>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-purple-400" />
              <p className="text-neutral-300 text-sm uppercase tracking-wide">Total collecté</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalRaised.toFixed(2)} ETH</p>
          </div>
        </div>

        {/* My Campaigns */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Mes campagnes</h2>
            <Link href="/campaigns/create">
              <Button variant="primary" size="sm" className="gap-2">
                <Plus size={16} /> Nouvelle
              </Button>
            </Link>
          </div>
          {campaignsArray.length ? (
            <div className="grid md:grid-cols-2 gap-6">
              {campaignsArray.map((c) => {
                const progress = Math.min((c.current_amount / c.goal_amount) * 100, 100);
                const daysRemaining = Math.ceil(
                  (new Date(c.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.id}`}
                    className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="p-4 space-y-3">
                      <h3 className="text-white font-bold group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>{progress.toFixed(0)}% financé</span>
                        <span className={`font-medium ${
                          c.status === "active" ? "text-green-400" : "text-neutral-400"
                        }`}>
                          {c.status === "active" ? "Actif" : "Terminé"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <Calendar size={12} />
                        {Math.max(daysRemaining, 0)} jours
                      </div>
                      <div className="flex justify-between text-sm text-neutral-300">
                        <span className="font-semibold">{c.current_amount} ETH</span>
                        <span className="text-neutral-400">sur {c.goal_amount} ETH</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-300">
              <p className="mb-4">Aucune campagne lancée</p>
              <Link href="/campaigns/create">
                <Button variant="secondary" size="sm">Créer votre première campagne</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Contributions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Mes contributions</h2>
          {contribArray.length ? (
            <div className="space-y-3">
              {contribArray.map((contrib) => (
                <Link
                  key={contrib.id}
                  href={`/campaigns/${contrib.campaign.id}`}
                  className="block p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-semibold hover:text-cyan-400 transition-colors line-clamp-2">
                      {contrib.campaign.title}
                    </h3>
                    <span className="text-cyan-400 font-bold whitespace-nowrap ml-4">
                      {contrib.amount} ETH
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2">
                    {new Date(contrib.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-300">
              <p className="mb-4">Aucune contribution</p>
              <Link href="/explore">
                <Button variant="secondary" size="sm">Découvrir les projets</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
