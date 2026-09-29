import React, { useState, useEffect } from 'react';
import { getRoadmap, updateRoadmapItemStatus } from '../services/roadmap';
import { RoadmapPhaseCard } from '../components/RoadmapPhaseCard';
import { Map, Sparkles, Trophy, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await getRoadmap();
        setRoadmap(data);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const updated = await updateRoadmapItemStatus(itemId, newStatus);
      setRoadmap(updated);
      if (newStatus === 'completed') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Generating your personalized roadmap...</p>
      </div>
    );
  }

  const completedCount = roadmap?.items?.filter((i) => i.status === 'completed').length || 0;
  const totalCount = roadmap?.items?.length || 6;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-brand-950/30 via-slate-900/60 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Structured Learning Pathway</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                Phase {roadmap?.current_phase || 1} Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {roadmap?.title || 'Personalized Career Roadmap'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {roadmap?.description}
            </p>
          </div>

          {/* Progress Percentage Badge */}
          <div className="shrink-0 text-left md:text-right bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-3xl font-black text-emerald-400">{Math.round(roadmap?.progress_pct || 0)}%</span>
            <span className="block text-xs font-semibold text-slate-400 mt-0.5">
              {completedCount} of {totalCount} Phases Completed
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, roadmap?.progress_pct || 0))}%` }}
          />
        </div>
      </div>

      {/* Roadmap Milestone Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Milestone Phases</h3>
          <span className="text-xs text-slate-400">Mark items completed as you build evidence</span>
        </div>

        <div className="space-y-6">
          {roadmap?.items?.map((item) => (
            <RoadmapPhaseCard
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
