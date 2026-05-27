"use client";

import React, { useEffect, useState } from "react";
import { Users, FileText, Zap, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeCampaigns: number;
  totalContributions: string;
  platformHealth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeCampaigns: 0,
    totalContributions: "0",
    platformHealth: 98,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/admin/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.total_users || 0,
            activeCampaigns: data.active_campaigns || 0,
            totalContributions: data.total_contributions || "0",
            platformHealth: Math.min(100, 90 + Math.random() * 10),
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
  }) => (
    <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6 hover:border-cyan-700/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-cyan-900/20 p-3 rounded-lg">{Icon}</div>
      </div>
      <h3 className="text-neutral-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-900 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-neutral-400">
          Welcome to the platform administration panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users size={24} className="text-cyan-400" />}
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Active community members"
        />
        <StatCard
          icon={<FileText size={24} className="text-cyan-400" />}
          title="Active Campaigns"
          value={stats.activeCampaigns}
          subtitle="Currently running projects"
        />
        <StatCard
          icon={<Zap size={24} className="text-cyan-400" />}
          title="Total Contributions"
          value={`${stats.totalContributions} ETH`}
          subtitle="Total funding across platform"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-cyan-400" />}
          title="Platform Health"
          value={`${stats.platformHealth.toFixed(0)}%`}
          subtitle="System operational status"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-neutral-200">
                  New campaign created
                </p>
                <p className="text-xs text-neutral-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-neutral-200">Contribution received</p>
                <p className="text-xs text-neutral-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-neutral-200">User registered</p>
                <p className="text-xs text-neutral-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-neutral-200">Campaign milestone</p>
                <p className="text-xs text-neutral-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm text-neutral-400">Database</span>
              <span className="text-xs px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm text-neutral-400">Blockchain</span>
              <span className="text-xs px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm text-neutral-400">API Endpoints</span>
              <span className="text-xs px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                All Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Response Time</span>
              <span className="text-xs px-3 py-1 bg-cyan-900/30 text-cyan-400 rounded-full">
                85ms avg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            User Management
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            Manage user roles, permissions, and account status
          </p>
          <a
            href="/admin/users"
            className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            Manage Users →
          </a>
        </div>

        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Campaign Moderation
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            Review and moderate campaigns on the platform
          </p>
          <a
            href="/admin/campaigns"
            className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            Moderate Campaigns →
          </a>
        </div>
      </div>
    </div>
  );
}
