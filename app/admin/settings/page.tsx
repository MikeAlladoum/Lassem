"use client";

import React, { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "DApp Crowdfunding",
    maintenanceMode: false,
    allowNewCampaigns: true,
    requireApproval: false,
    transactionFee: "2.5",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: Save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-neutral-400">Configure platform settings and options</p>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl space-y-6">
        {/* Platform Settings */}
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Platform Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Transaction Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.transactionFee}
                onChange={(e) => handleChange("transactionFee", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900/50 border border-cyan-900/30 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-600"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Fee deducted from each successful contribution
              </p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-neutral-900/50 border border-cyan-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Feature Controls
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-300">
                  Maintenance Mode
                </label>
                <p className="text-xs text-neutral-500 mt-1">
                  Disable all user features during maintenance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleChange("maintenanceMode", e.target.checked)
                  }
                  className="w-5 h-5 rounded border-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-300">
                    Allow New Campaigns
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">
                    Allow creators to launch new campaigns
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.allowNewCampaigns}
                    onChange={(e) =>
                      handleChange("allowNewCampaigns", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-cyan-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-300">
                    Require Admin Approval
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">
                    Review campaigns before they go live
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.requireApproval}
                    onChange={(e) =>
                      handleChange("requireApproval", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-cyan-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-neutral-300 mb-4">
                These actions can have serious consequences
              </p>
              <button className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium">
                Reset Platform Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all font-medium"
          >
            <Save size={20} />
            Save Settings
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Settings saved successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
