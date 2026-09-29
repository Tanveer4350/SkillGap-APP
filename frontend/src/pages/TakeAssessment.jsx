import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentDetail, submitAssessment } from '../services/assessments';
import {
  Trophy,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TakeAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getAssessmentDetail(id);
        setAssessment(data);
      } catch (err) {
        console.error('Error fetching assessment detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Prevent changing after submission
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitAssessment(id, answers);
      setResult(res);
      if (res.passed) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading Assessment Questions...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment?.questions?.length || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Back & Header */}
      <div>
        <button
          onClick={() => navigate('/assessments')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessments Catalog
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              {assessment?.category} • {assessment?.difficulty}
            </span>
            <h1 className="text-xl font-bold text-white mt-1">{assessment?.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{assessment?.description}</p>
          </div>

          {!result && (
            <div className="shrink-0 flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-300 font-semibold">
                Answered: <strong className="text-white">{answeredCount} / {totalQuestions}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Result Card if Submitted */}
      {result && (
        <div
          className={`glass-panel rounded-3xl p-6 sm:p-8 border ${
            result.passed ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-rose-500/40 bg-rose-950/15'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                  result.passed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}
              >
                {result.passed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Result</span>
                <h3 className="text-xl font-black text-white">
                  {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-3xl font-black ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.score_percentage}%
              </span>
              <span className="block text-[11px] text-slate-400">
                {result.correct_count} of {result.total_questions} Correct
              </span>
            </div>
          </div>

          <div className="pt-4 text-xs text-slate-300">
            <p className="leading-relaxed">
              <strong className="text-white">Recommendation: </strong> {result.recommendation}
            </p>
            {result.unlocked_evidence && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Assessment Badge has been recorded into your Skill Evidence Audit!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {assessment?.questions?.map((q, qIndex) => {
          const fb = result?.feedback?.find((f) => f.question_id === q.id);
          const userSelected = answers[q.id];

          return (
            <div
              key={q.id}
              className={`glass-panel rounded-2xl p-6 border transition-all ${
                fb
                  ? fb.is_correct
                    ? 'border-emerald-500/30 bg-emerald-950/5'
                    : 'border-rose-500/30 bg-rose-950/5'
                  : 'border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {qIndex + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {q.question_type}
                  </span>
                </div>

                {fb && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      fb.is_correct ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {fb.is_correct ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-semibold text-white leading-relaxed mb-3">
                {q.question_text}
              </h4>

              {/* Code Snippet if applicable */}
              {q.code_snippet && (
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-brand-300 overflow-x-auto mb-4">
                  <code>{q.code_snippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2.5 text-xs">
                {q.options?.map((opt, optIdx) => {
                  let optStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (!result) {
                    if (userSelected === optIdx) {
                      optStyle = 'bg-brand-950/60 border-brand-500 text-white font-semibold shadow-sm';
                    }
                  } else {
                    if (optIdx === fb?.correct_option_index) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                    } else if (userSelected === optIdx && !fb?.is_correct) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 font-medium';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${optStyle} ${
                        !result ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          userSelected === optIdx
                            ? 'border-brand-400 bg-brand-500'
                            : 'border-slate-600'
                        }`}
                      >
                        {userSelected === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation (Shown post-submission) */}
              {fb && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">Explanation:</span>
                  <p className="text-slate-400 leading-relaxed">{fb.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Footer */}
      {!result ? (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between sticky bottom-4 z-20 shadow-2xl bg-slate-950/90 backdrop-blur-xl">
          <span className="text-xs text-slate-400">
            {answeredCount === totalQuestions ? 'Ready to submit!' : `Answer all questions to submit (${answeredCount}/${totalQuestions})`}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Grading Answers...
              </>
            ) : (
              'Submit Assessment'
            )}
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/assessments')}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Explore Other Assessments
          </button>
          <button
            onClick={() => navigate('/roadmap')}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors"
          >
            Return to Roadmap
          </button>
        </div>
      )}
    </div>
  );
};
