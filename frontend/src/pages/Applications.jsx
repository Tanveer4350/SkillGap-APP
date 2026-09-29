import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication, deleteApplication, createApplication } from '../services/applications';
import {
  KanbanSquare,
  Plus,
  Building2,
  Calendar,
  Sparkles,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Clock,
  DollarSign
} from 'lucide-react';

const COLUMNS = [
  { id: 'saved', label: 'Saved', color: 'border-slate-700' },
  { id: 'applied', label: 'Applied', color: 'border-blue-500/40' },
  { id: 'assessment', label: 'Assessment Stage', color: 'border-purple-500/40' },
  { id: 'interview', label: 'Interviewing', color: 'border-amber-500/40' },
  { id: 'offer', label: 'Offer Received', color: 'border-emerald-500/40' },
];

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    custom_title: '',
    custom_company: '',
    status: 'saved',
    notes: '',
    deadline_date: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStatus = async (appId, newStatus) => {
    try {
      const updated = await updateApplication(appId, { status: newStatus });
      setApplications(applications.map((a) => (a.id === appId ? updated : a)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (appId) => {
    try {
      await deleteApplication(appId);
      setApplications(applications.filter((a) => a.id !== appId));
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const handleCreate = async (e) => {
    e?.preventDefault();
    try {
      const created = await createApplication(newApp);
      setApplications([created, ...applications]);
      setShowAddModal(false);
      setNewApp({
        custom_title: '',
        custom_company: '',
        status: 'saved',
        notes: '',
        deadline_date: '',
      });
    } catch (err) {
      console.error('Error creating application:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading Application Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Opportunity Pipeline</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {applications.length} Active Tracks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Application Tracker Kanban
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize and track your internship and job applications across stages.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Application</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          const colIdx = COLUMNS.findIndex((c) => c.id === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">{col.label}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in this column */}
              <div className="space-y-3 flex-1">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between text-xs space-y-2.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="font-bold text-white text-xs leading-snug">
                          {app.custom_title}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-brand-950 text-brand-300 font-bold text-[10px]">
                          {app.match_score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {app.custom_company}
                      </p>
                    </div>

                    {app.interview_date && (
                      <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/30 text-[10px] text-amber-300">
                        <strong>Interview:</strong> {app.interview_date}
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Quick Move Stage Controls */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1">
                        {colIdx > 0 && (
                          <button
                            onClick={() => handleMoveStatus(app.id, COLUMNS[colIdx - 1].id)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400"
                            title="Move back"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                        )}
                        {colIdx < COLUMNS.length - 1 && (
                          <button
                            onClick={() => handleMoveStatus(app.id, COLUMNS[colIdx + 1].id)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-brand-400"
                            title="Move next stage"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Track Custom Application</h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newApp.custom_title}
                  onChange={(e) => setNewApp({ ...newApp, custom_title: e.target.value })}
                  placeholder="e.g. Backend Engineer Intern"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newApp.custom_company}
                  onChange={(e) => setNewApp({ ...newApp, custom_company: e.target.value })}
                  placeholder="e.g. Stripe, Vercel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                <select
                  value={newApp.status}
                  onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="assessment">Assessment Stage</option>
                  <option value="interview">Interviewing</option>
                  <option value="offer">Offer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Reminders</label>
                <textarea
                  rows={2}
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Add interview dates, challenge notes, or contact info..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
