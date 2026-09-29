import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Split,
  Map,
  Trophy,
  Briefcase,
  KanbanSquare,
  ShieldCheck,
  Building,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/skill-gap', label: 'Skill Gap Engine', icon: Split, badge: 'Core' },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
    { to: '/assessments', label: 'Assessments', icon: Trophy },
    { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/applications', label: 'Application Tracker', icon: KanbanSquare },
    { to: '/evidence', label: 'Evidence Audit', icon: ShieldCheck },
    { to: '/profile', label: 'Student Profile', icon: UserCheck },
  ];

  if (user?.role === 'placement_cell' || user?.role === 'admin') {
    navItems.push({ to: '/placement-cell', label: 'Placement Cell', icon: Building, badge: 'Admin' });
  }

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Logo */}
      <div>
        <div className="h-16 px-6 flex items-center gap-2.5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              Skill<span className="text-brand-400">Gap</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
              Employability Intel
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-brand-300 font-bold border border-slate-700/60">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Target Role & Gamification Mini Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 m-3 rounded-2xl border">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="font-semibold text-white">Target Goal</span>
          <span className="text-brand-400 font-bold">Active</span>
        </div>
        <p className="text-xs font-bold text-slate-200 truncate">
          Full Stack Developer
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>Level 2 • 450 XP</span>
        </div>
      </div>
    </aside>
  );
};
