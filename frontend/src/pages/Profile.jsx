import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProfile,
  updateProfile,
  getMySkills,
  addStudentSkill,
  deleteStudentSkill,
  getProjects,
  createProject,
  deleteProject,
  connectGitHub,
  getGitHubProfile,
  getLatestResumeAnalysis
} from '../services/profile';
import { ResumeUploader } from '../components/ResumeUploader';
import { ProjectCard } from '../components/ProjectCard';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Github,
  Code2,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [github, setGithub] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    role: 'Full Stack Developer',
    duration: '3 weeks',
    impact_metrics: '',
  });

  const [githubInput, setGithubInput] = useState('');
  const [syncingGithub, setSyncingGithub] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profRes, skillsRes, projRes] = await Promise.all([
        getProfile(),
        getMySkills(),
        getProjects(),
      ]);
      setProfile(profRes);
      setSkills(skillsRes);
      setProjects(projRes);

      try {
        const ra = await getLatestResumeAnalysis();
        setResumeAnalysis(ra);
      } catch (e) {}

      try {
        const gh = await getGitHubProfile();
        setGithub(gh);
        setGithubInput(gh.username);
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await addStudentSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency_level: 'intermediate',
      });
      setNewSkillName('');
      const updated = await getMySkills();
      setSkills(updated);
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteStudentSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const techs = newProj.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      await createProject({
        ...newProj,
        technologies: techs,
      });
      setShowAddProject(false);
      setNewProj({
        title: '',
        description: '',
        technologies: '',
        github_url: '',
        live_url: '',
        role: 'Full Stack Developer',
        duration: '3 weeks',
        impact_metrics: '',
      });
      const updated = await getProjects();
      setProjects(updated);
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleSyncGithub = async (e) => {
    e.preventDefault();
    if (!githubInput.trim()) return;
    setSyncingGithub(true);
    try {
      const res = await connectGitHub(githubInput.trim());
      setGithub(res);
      fetchProfileData();
    } catch (err) {
      console.error('Error syncing github:', err);
    } finally {
      setSyncingGithub(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading Student Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-brand-950/20 via-slate-900/60 to-slate-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`}
              alt={user?.full_name}
              className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-brand-500/40 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user?.full_name}</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.college} • {user?.degree} (Class of {user?.graduation_year})
              </p>
              <p className="text-xs text-slate-300 mt-2 max-w-xl">{profile?.bio}</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-2xl font-black text-emerald-400">{Math.round(profile?.profile_readiness_pct || 78)}%</span>
            <span className="block text-xs font-semibold text-slate-400 mt-0.5">Profile Readiness</span>
            <span className="text-[10px] text-brand-400 block mt-1">
              Target: {profile?.custom_target_role || 'Full Stack Developer'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skills, Projects, Education */}
        <div className="lg:col-span-7 space-y-8">
          {/* Skills with Verified Evidence Status */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Technical Skills & Evidence Badges</h3>
                <p className="text-xs text-slate-400">Skills with verified badges have backing projects or assessments</p>
              </div>
              <span className="text-xs text-brand-400 font-semibold">{skills.length} listed</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200"
                >
                  {s.verified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Evidence Verified" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Unverified Claim" />
                  )}
                  <span>{s.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize font-normal">({s.category})</span>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="pt-4 border-t border-slate-800 flex gap-2 text-xs">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add skill (e.g. Docker, Redis, Kubernetes)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Cloud">Cloud</option>
                <option value="Programming">Programming</option>
                <option value="AI/ML">AI/ML</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

          {/* Technical Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Technical Projects</h3>
                <p className="text-xs text-slate-400">Projects automatically generate verifiable evidence</p>
              </div>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {/* Add Project Modal/Drawer */}
            {showAddProject && (
              <form onSubmit={handleCreateProject} className="glass-panel p-6 rounded-2xl border border-brand-500/30 space-y-3.5 text-xs">
                <h4 className="font-bold text-white text-sm">Add New Technical Project</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newProj.title}
                      onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                      placeholder="e.g. Distributed Task Queue"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Role / Subsystem</label>
                    <input
                      type="text"
                      value={newProj.role}
                      onChange={(e) => setNewProj({ ...newProj, role: e.target.value })}
                      placeholder="Backend Lead"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Description & Architecture *</label>
                  <textarea
                    rows={2}
                    required
                    value={newProj.description}
                    onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                    placeholder="Describe problem solved, database models, and APIs..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Technologies (comma separated) *</label>
                    <input
                      type="text"
                      required
                      value={newProj.technologies}
                      onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                      placeholder="FastAPI, PostgreSQL, Docker, Redis"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Impact Metrics</label>
                    <input
                      type="text"
                      value={newProj.impact_metrics}
                      onChange={(e) => setNewProj({ ...newProj, impact_metrics: e.target.value })}
                      placeholder="e.g. Reduced API latency by 40%"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">GitHub Repo URL</label>
                    <input
                      type="text"
                      value={newProj.github_url}
                      onChange={(e) => setNewProj({ ...newProj, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={newProj.live_url}
                      onChange={(e) => setNewProj({ ...newProj, live_url: e.target.value })}
                      placeholder="https://demo.app"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                  >
                    Save Project & Evidence
                  </button>
                </div>
              </form>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-4">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Resume Analyzer & GitHub Sync */}
        <div className="lg:col-span-5 space-y-8">
          {/* AI Resume Analyzer */}
          <ResumeUploader
            initialAnalysis={resumeAnalysis}
            onUploadSuccess={(data) => {
              fetchProfileData();
            }}
          />

          {/* GitHub Connection */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">GitHub Integration</h3>
              </div>
              {github && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                  Connected
                </span>
              )}
            </div>

            <form onSubmit={handleSyncGithub} className="flex gap-2">
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="GitHub Username (e.g. alexsharma-dev)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={syncingGithub}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center gap-1.5"
              >
                {syncingGithub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Sync'}
              </button>
            </form>

            {github && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Public Repositories: {github.public_repos || 8}</span>
                  <span>Total Stars: {github.total_stars || 22}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Detected Code Languages:</span>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(github.languages || {}).map(([lang, pct]) => (
                      <span key={lang} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {lang} ({pct}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
