"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-12 text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Settings Coming Soon</h3>
        <p className="text-muted-foreground">
          This is a placeholder for the settings page. You could implement profile updates, password changes, or theme toggling here!
        </p>
      </div>
    </div>
  );
}
