import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SectionHeader } from "@/components/ui/shared";
import { User, Shield, Bell, Lock } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>

      {/* Profile */}
      <div className="bg-card rounded-lg shadow-surface p-5">
        <SectionHeader title="Profile" />
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
        <div className="grid gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Display Name</label>
            <input defaultValue={user?.name} className="w-full h-10 px-3 rounded-sm bg-background shadow-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input defaultValue={user?.email} className="w-full h-10 px-3 rounded-sm bg-background shadow-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button className="mt-4 h-9 px-4 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity duration-150">
          Save Changes
        </button>
      </div>

      {/* Password */}
      <div className="bg-card rounded-lg shadow-surface p-5">
        <SectionHeader title="Change Password" />
        <div className="grid gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Current Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-sm bg-background shadow-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-sm bg-background shadow-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button className="mt-4 h-9 px-4 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity duration-150">
          Update Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg shadow-surface p-5">
        <SectionHeader title="Notification Preferences" />
        <div className="space-y-3">
          {["Query Updates", "Announcements", "Fee Reminders", "Assignment Deadlines"].map((pref) => (
            <label key={pref} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">{pref}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-primary" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
