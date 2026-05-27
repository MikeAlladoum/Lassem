"use client";

import React, { useState } from "react";
import { TrendingUp, Users, Zap, FileText } from "lucide-react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const analyticsData = [
    {
      label: "Total Revenue",
      value: "342.5 ETH",
      change: "+12.5%",
      icon: Zap,
    },
    {
      label: "Active Users",
      value: "1,234",
      change: "+8.2%",
      icon: Users,
    },
    {
      label: "Successful Campaigns",
      value: "18",
      change: "+4.3%",
      icon: FileText,
    },
    {
      label: "Total Transactions",
      value: "8,942",
      change: "+23.1%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-neutral-400">Platform performance and metrics</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white focus:outline-none focus:border-cyan-600"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6 hover:border-cyan-700/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-cyan-900/20 p-3 rounded-lg">
                  <Icon size={24} className="text-cyan-400" />
                </div>
                <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                  {item.change}
                </span>
              </div>
              <h3 className="text-neutral-400 text-sm font-medium mb-2">
                {item.label}
              </h3>
              <p className="text-2xl font-bold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-neutral-500">
            <p>Chart visualization coming soon</p>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Campaign Success Rate
          </h3>
          <div className="h-64 flex items-center justify-center text-neutral-500">
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
