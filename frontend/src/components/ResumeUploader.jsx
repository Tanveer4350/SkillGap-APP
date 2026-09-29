import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { uploadResume } from '../services/profile';

export const ResumeUploader = ({ onUploadSuccess, initialAnalysis }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(initialAnalysis || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      const data = await uploadResume(selectedFile);
      setLoading(false);
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Resume analysis failed. Please verify the file format and try again.');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">AI Resume Analyzer</span>
          <h3 className="text-lg font-bold text-white">Upload & Extract Evidence</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> ATS Calibrated
        </span>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          loading
            ? 'border-brand-500/50 bg-brand-950/20 pointer-events-none'
            : 'border-slate-700 hover:border-brand-500/60 hover:bg-slate-900/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-3" />
            <p className="text-sm font-semibold text-white">Analyzing Resume with AI...</p>
            <p className="text-xs text-slate-400 mt-1">Extracting technical skills, project impact, and verifiable evidence...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              {file ? file.name : 'Drag and drop your resume here, or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF and DOCX formats up to 10MB.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Preview if available */}
      {analysis && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Extracted Skills:</span>
            <span className="text-emerald-400 font-semibold">{analysis.extracted_skills?.length || 0} skills detected</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {analysis.extracted_skills?.map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                {s}
              </span>
            ))}
          </div>

          {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1.5">AI Evidence Improvement Suggestions:</span>
              <ul className="space-y-1 text-slate-300">
                {analysis.improvement_suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
