import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Split,
  Map,
  Trophy,
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Layers,
  Code2,
  Cpu,
  Lock,
  Building2
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Skill<span className="text-brand-400">Gap</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#evidence" className="hover:text-white transition-colors">Evidence System</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg shadow-brand-600/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-brand-300 mb-8">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>The Student Employability Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Know the skills you need. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-400">
            Build the career you want.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SkillGap analyzes your skills, projects, resume, and target roles to show exactly where you stand and what to build next.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-all shadow-xl shadow-brand-600/30 group"
          >
            <span>Analyze My Skills Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-semibold transition-colors"
          >
            <span>Explore Live Demo (Alex Sharma)</span>
          </Link>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-slate-800/60 to-slate-900/20 border border-slate-800 shadow-2xl">
          <div className="rounded-2xl bg-slate-950 p-6 sm:p-8 text-left border border-slate-800/80">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Demo Profile Preview</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Alex Sharma • Target: Full Stack Developer</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  Profile Readiness: 78%
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                  82% Skill Coverage
                </span>
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Technical Strengths</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">✓ React (100% Assessed)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">✓ PostgreSQL (3 Projects)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">✓ FastAPI</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Critical Skill Gaps</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">✗ Docker (Needs Evidence)</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">✗ AWS (Missing)</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">! Redis (Developing)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Recommended Next Step</span>
                <p className="text-slate-400 leading-relaxed pt-1">
                  "Containerize your Django / FastAPI project with Docker and add Docker Compose to your GitHub repo."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">The Real Problem</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Why college students struggle to get hired
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Students often know what they learned in coursework, but have zero visibility into what companies actually demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Unclear Industry Expectations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coursework rarely matches the exact tech stacks, tooling (Docker, AWS, CI/CD), and architecture required by hiring teams.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Listing Skills Without Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Writing "Docker" or "PostgreSQL" on a resume without verifiable GitHub repos, projects, or assessments gets filtered out by recruiters.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Aimless Learning Roadmaps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students waste months watching endless tutorials instead of building targeted projects that directly bridge their critical gaps.
            </p>
          </div>
        </div>
      </section>

      {/* How SkillGap Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
            How SkillGap Works
          </h2>
          <p className="mt-4 text-slate-400 text-sm">
            A transparent, explainable pipeline from your current student profile to verified career readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative text-xs">
            <span className="text-3xl font-black text-brand-400/40 block mb-2">01</span>
            <h4 className="text-sm font-bold text-white mb-1.5">Profile & Evidence</h4>
            <p className="text-slate-400 leading-relaxed">
              Upload your resume, connect GitHub, and list your projects and skills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative text-xs">
            <span className="text-3xl font-black text-brand-400/40 block mb-2">02</span>
            <h4 className="text-sm font-bold text-white mb-1.5">Skill Gap Engine</h4>
            <p className="text-slate-400 leading-relaxed">
              Compare your profile against target roles or pasted job descriptions to uncover gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative text-xs">
            <span className="text-3xl font-black text-brand-400/40 block mb-2">03</span>
            <h4 className="text-sm font-bold text-white mb-1.5">Personalized Roadmap</h4>
            <p className="text-slate-400 leading-relaxed">
              Follow milestone tracks with curated resources, practice tasks, and project challenges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative text-xs">
            <span className="text-3xl font-black text-brand-400/40 block mb-2">04</span>
            <h4 className="text-sm font-bold text-white mb-1.5">Opportunity Matching</h4>
            <p className="text-slate-400 leading-relaxed">
              Discover real internships matching your verified skills and track applications with Kanban.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence System Callout */}
      <section id="evidence" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">The Major Differentiator</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-4">
                The Skill Evidence System
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Don't just claim skills. SkillGap audits and links multi-stream proof:
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Projects:</strong> Tested architecture, live demo URLs & tech stack tags</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>GitHub Code:</strong> Public repositories, languages distribution & commit activity</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Skill Assessments:</strong> Technical MCQ, debugging & scenario test results</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Resume ATS:</strong> Calibrated extraction and missing evidence flags</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-3">
              <div className="text-slate-400 text-[11px] font-sans pb-2 border-b border-slate-800">
                Transparent Skill Proof Audit
              </div>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>React</span>
                  <span className="text-emerald-400">Strong (4 Evidence Streams)</span>
                </div>
                <p className="text-slate-400 text-[11px]">✓ Project: Campus Navigation • ✓ Assessment: 100% • ✓ GitHub Code</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Docker</span>
                  <span className="text-rose-400">Critical Gap (0 Evidence)</span>
                </div>
                <p className="text-slate-400 text-[11px]">✗ No Dockerfile found • ✗ No container project • ✗ Unverified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl font-black text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1.5">Does Profile Readiness predict if I will get hired?</h4>
            <p className="text-slate-400 leading-relaxed">
              No. Profile Readiness strictly measures how well your verified skills, projects, and evidence match the published requirements of your target career. It is transparent and explainable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1.5">Can I analyze a custom job posting?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes! Use the Job Description Analyzer to paste any internship or job posting. SkillGap will extract the requirements and compare them against your profile in real-time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1.5">Is my resume kept private and secure?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes. Your uploaded resume is stored securely in your private user storage and is never made publicly accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center border-t border-slate-900">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-brand-900/30 to-slate-950 border border-brand-500/20 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to turn your skills into career readiness?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Join thousands of college students bridging their technical gaps with SkillGap today.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 SkillGap Platform. Turn your skills into career readiness.</p>
      </footer>
    </div>
  );
};
