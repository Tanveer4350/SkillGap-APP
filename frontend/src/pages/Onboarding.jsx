import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  FileText,
  UploadCloud,
  Loader2,
  Plus
} from 'lucide-react';
import { updateProfile, bulkAddSkills, createProject, uploadResume } from '../services/profile';
import { analyzeRoleGap } from '../services/skill_gap';

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Personal Info
  const [bio, setBio] = useState('Enthusiastic computer science student passionate about building scalable web systems and modern architectures.');
  const [location, setLocation] = useState('Bangalore / Remote');
  const [githubUsername, setGithubUsername] = useState('alexsharma-dev');

  // Step 2: Career Goal
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const careerOptions = [
    { title: 'Full Stack Developer', desc: 'React, Node.js/FastAPI, PostgreSQL, Docker' },
    { title: 'Backend Developer', desc: 'Python, FastAPI/Django, PostgreSQL, Redis, APIs' },
    { title: 'Cloud & DevOps Engineer', desc: 'Docker, Kubernetes, AWS, CI/CD, Linux' },
    { title: 'Data Scientist / AI Engineer', desc: 'Python, Machine Learning, LLMs, SQL' },
    { title: 'Android Developer', desc: 'Kotlin, Jetpack Compose, REST APIs, SQLite' },
  ];

  // Step 3: Skills Selection
  const allAvailableSkills = [
    { name: 'React', cat: 'Frontend' },
    { name: 'JavaScript', cat: 'Programming' },
    { name: 'Python', cat: 'Programming' },
    { name: 'FastAPI', cat: 'Backend' },
    { name: 'Node.js', cat: 'Backend' },
    { name: 'PostgreSQL', cat: 'Database' },
    { name: 'Docker', cat: 'DevOps' },
    { name: 'AWS', cat: 'Cloud' },
    { name: 'Git', cat: 'Tools' },
    { name: 'Tailwind CSS', cat: 'Frontend' },
    { name: 'Redis', cat: 'Database' },
    { name: 'TypeScript', cat: 'Programming' },
  ];
  const [selectedSkills, setSelectedSkills] = useState(['React', 'JavaScript', 'Python', 'FastAPI', 'PostgreSQL', 'Git']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 4: Project
  const [projectTitle, setProjectTitle] = useState('Campus Navigation & Booking System');
  const [projectDesc, setProjectDesc] = useState('A full-stack React and FastAPI platform for student campus routing and room reservations.');
  const [projectTechs, setProjectTechs] = useState('React, FastAPI, PostgreSQL, Tailwind CSS');
  const [projectGithub, setProjectGithub] = useState('https://github.com/alexsharma-dev/campus-nav');

  // Step 5: Resume
  const [resumeFile, setResumeFile] = useState(null);

  const toggleSkill = (skillName) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      // 1. Update Profile
      await updateProfile({
        bio,
        location,
        github_username: githubUsername,
        custom_target_role: targetRole,
      });

      // 2. Add Skills
      const skillsPayload = selectedSkills.map((s) => ({
        name: s,
        category: 'core',
        proficiency_level: 'intermediate',
      }));
      await bulkAddSkills(skillsPayload);

      // 3. Add Project
      if (projectTitle && projectDesc) {
        const techs = projectTechs.split(',').map((t) => t.trim()).filter(Boolean);
        await createProject({
          title: projectTitle,
          description: projectDesc,
          technologies: techs,
          github_url: projectGithub,
          role: 'Full Stack Developer',
        });
      }

      // 4. Upload Resume if selected
      if (resumeFile) {
        await uploadResume(resumeFile);
      }

      // 5. Trigger Skill Gap computation
      await analyzeRoleGap(null, targetRole, null);

      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding sync error:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      {/* Top Brand & Step Indicator */}
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white">
              Skill<span className="text-brand-400">Gap</span>
            </span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Step {step} of 5</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-6 bg-brand-500'
                      : s < step
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Content Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-6">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 1</span>
                <h2 className="text-xl font-bold text-white mt-1">Personal Details & Online Presence</h2>
                <p className="text-xs text-slate-400 mt-0.5">Let's set up your core student profile.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Student Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Location / Relocation</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bangalore / Remote"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">GitHub Username</label>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="e.g. alexsharma-dev"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Career Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-6">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 2</span>
                <h2 className="text-xl font-bold text-white mt-1">Select Your Target Career Goal</h2>
                <p className="text-xs text-slate-400 mt-0.5">SkillGap uses this to benchmark industry requirements and skill gaps.</p>
              </div>

              <div className="space-y-2.5">
                {careerOptions.map((opt) => (
                  <div
                    key={opt.title}
                    onClick={() => setTargetRole(opt.title)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                      targetRole === opt.title
                        ? 'bg-brand-950/40 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    {targetRole === opt.title && (
                      <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Skills Selector */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-6">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 3</span>
                <h2 className="text-xl font-bold text-white mt-1">Select Your Current Technical Skills</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select the technologies you have learned or used in projects.</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {allAvailableSkills.map((s) => {
                  const isSelected = selectedSkills.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => toggleSkill(s.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Input */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2 border-t border-slate-800 text-xs">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. GraphQL, Next.js)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Add First Project */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-6">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 4</span>
                <h2 className="text-xl font-bold text-white mt-1">Add a Technical Project</h2>
                <p className="text-xs text-slate-400 mt-0.5">Projects provide primary evidence for your claimed skills.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Airline Booking System"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description & Architecture</label>
                  <textarea
                    rows={2}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Technologies Used</label>
                    <input
                      type="text"
                      value={projectTechs}
                      onChange={(e) => setProjectTechs(e.target.value)}
                      placeholder="React, FastAPI, PostgreSQL"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="text"
                      value={projectGithub}
                      onChange={(e) => setProjectGithub(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Resume Upload */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="mb-6">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 5</span>
                <h2 className="text-xl font-bold text-white mt-1">Upload Resume (Optional)</h2>
                <p className="text-xs text-slate-400 mt-0.5">We'll scan for ATS keywords and cross-reference your project evidence.</p>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-2xl p-8 text-center bg-slate-950/40">
                <input
                  type="file"
                  id="onboarding-resume"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="onboarding-resume" className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    {resumeFile ? resumeFile.name : 'Select or drop your PDF / DOCX resume'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">You can also skip and upload later on your dashboard.</p>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/20"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleCompleteOnboarding}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Profile Readiness...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Launch My Dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500">
        SkillGap Platform • Turn your skills into career readiness
      </div>
    </div>
  );
};
