import React from 'react';
import { Moon, Sun, Bell, Languages, Download, Upload } from 'lucide-react';
import { cn } from '../types';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestNotification: () => void;
}

export function Settings({
  isDarkMode,
  onToggleDarkMode,
  onExport,
  onImport,
  onRequestNotification,
}: SettingsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* General Settings */}
      <div className="card space-y-6">
        <h3 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4">
          General Settings
        </h3>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-zinc-500">Adjust the app's appearance</p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              isDarkMode ? "bg-emerald-600" : "bg-zinc-300"
            )}
          >
            <div
              className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                isDarkMode ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-zinc-500">Get reminders and alerts</p>
            </div>
          </div>
          <button onClick={onRequestNotification} className="btn-secondary text-sm">
            Enable
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <Languages size={20} />
            </div>
            <div>
              <p className="font-medium">Language</p>
              <p className="text-xs text-zinc-500">English (US)</p>
            </div>
          </div>
          <button className="btn-secondary text-sm">Change</button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card space-y-6">
        <h3 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4">
          Data Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Button */}
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download size={20} className="text-emerald-600" />
            <div className="text-left">
              <p className="font-bold text-sm">Backup Data</p>
              <p className="text-xs text-zinc-500">Export to JSON file</p>
            </div>
          </button>

          {/* Import Button */}
          <label className="flex items-center justify-center gap-2 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <Upload size={20} className="text-blue-600" />
            <div className="text-left">
              <p className="font-bold text-sm">Restore Data</p>
              <p className="text-xs text-zinc-500">Import from JSON file</p>
            </div>
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
