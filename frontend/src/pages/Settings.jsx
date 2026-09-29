import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profile';
import { Settings as SettingsIcon, User, Bell, Lock, Shield, CheckCircle2, Save } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [workplacePref, setWorkplacePref] = useState('remote');
  const [savedMessage, setSavedMessage] = useState(null);

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      await updateProfile({
        custom_target_role: targetRole,
        preferred_workplace_type: workplacePref,
      });
      setSavedMessage('Settings saved successfully.');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white">Account Settings & Career Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your target role benchmark, workplace preferences, and notifications.</p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 text-xs">
        {/* User profile snapshot */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" /> Profile Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block mb-1">Full Name</span>
              <input
                type="text"
                disabled
                value={user?.full_name || ''}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Registered Email</span>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Career Preferences */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Target Role Calibration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Career Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                <option value="Android Developer">Android Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Workplace</label>
              <select
                value={workplacePref}
                onChange={(e) => setWorkplacePref(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
                <option value="any">Any / Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" /> Notifications & Alerts
          </h3>
          <div className="space-y-2 text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-0" />
              <span>Email notification when high matching opportunities (&gt;80%) are posted</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-0" />
              <span>Milestone reminder alerts for active learning roadmap phases</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-lg shadow-brand-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
