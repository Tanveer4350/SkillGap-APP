import React from 'react';
import { ExternalLink, Github, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800/80">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-base font-bold text-white hover:text-brand-400 transition-colors">
              {project.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              {project.role && <span>{project.role}</span>}
              {project.duration && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {project.duration}
                  </span>
                </>
              )}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 capitalize">
            {project.difficulty || 'Intermediate'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
          {project.description}
        </p>

        {project.impact_metrics && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Impact: {project.impact_metrics}</span>
          </div>
        )}

        {/* Technologies / Verified Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies && project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/60 text-[11px] text-slate-300 font-medium"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Links */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-xs text-brand-300 font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
