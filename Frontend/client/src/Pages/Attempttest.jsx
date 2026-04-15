// src/Pages/Attempttest.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Play, Code, CheckCircle, ChevronRight, Brain, AlertCircle,
  Loader, Database, Cpu, Network, Binary, XCircle,
  Clock, Zap, ArrowRight, Sparkles, FileCode, CircleDot
} from 'lucide-react';

// ─── Topic Cards Config ───────────────────────────
const TOPICS = [
  { value: 'dsa', label: 'DSA', desc: 'Data Structures & Algorithms', icon: Binary, color: 'indigo' },
  { value: 'dbms', label: 'DBMS', desc: 'Database Management Systems', icon: Database, color: 'emerald' },
  { value: 'os', label: 'OS', desc: 'Operating Systems', icon: Cpu, color: 'amber' },
  { value: 'networking', label: 'Networks', desc: 'Computer Networks', icon: Network, color: 'cyan' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'emerald' },
  { value: 'medium', label: 'Medium', color: 'amber' },
  { value: 'hard', label: 'Hard', color: 'red' },
];

const LETTERS = ['A', 'B', 'C', 'D'];

const AttemptTest = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // New state for enhanced UX
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  // ─── Timer ────────────────────────────────────────
  useEffect(() => {
    if (testStarted && !feedbackToast) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testStarted, feedbackToast]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ─── Generate Questions ───────────────────────────
  const handleGenerate = async () => {
    if (!topic) {
      setError('Please select a topic to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/ai/generate', { topic, difficulty });
      const generatedQuestions = res.data?.questions || res.data || [];

      if (generatedQuestions.length === 0) {
        setError("No questions were generated. Please try again.");
        return;
      }

      setQuestions(generatedQuestions);
      setTestStarted(true);
      setCurrentIndex(0);
      setCode('');
      setSelectedAnswer('');
      setResults([]);
      setElapsedTime(0);
    } catch (err) {
      console.error("Generate error:", err);
      setError(err.response?.data?.message || "Failed to generate questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Submit Answer (fixed routing) ────────────────
  const handleSubmitAnswer = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const qType = currentQ.type?.toLowerCase() || (currentQ.options?.length > 0 ? 'mcq' : 'coding');

    if (qType === 'mcq' && !selectedAnswer) return;
    if (qType === 'coding' && !code.trim()) return;

    setSubmitting(true);

    try {
      let res;

      if (qType === 'coding') {
        // Coding → AI evaluation (Groq 70B, strict)
        res = await API.post('/ai/evaluate', {
          questionId: currentQ._id,
          userCode: code,
          language: language,
        });
      } else {
        // MCQ → Backend comparison (fast, reliable)
        res = await API.post('/ai/evaluate', {
          questionId: currentQ._id,
          userAnswer: selectedAnswer,
          questionType: 'mcq',
        });
      }

      const { isCorrect, feedback, suggestion, correctAnswer, nextDifficulty } = res.data || {};

      const newResult = {
        title: currentQ.title,
        isCorrect: Boolean(isCorrect),
        feedback: feedback || (isCorrect ? "Good job!" : "Incorrect answer"),
        suggestion: suggestion || "",
        correctAnswer: correctAnswer || "",
        userAnswer: qType === 'coding' ? code : selectedAnswer,
        type: qType,
      };

      setResults(prev => [...prev, newResult]);
      showFeedbackAndAdvance(newResult);

    } catch (err) {
      console.error("Evaluation error:", err);
      const qType2 = currentQ.type?.toLowerCase() || 'mcq';
      const fallbackResult = {
        title: currentQ.title,
        isCorrect: false,
        feedback: err.response?.data?.message || "Evaluation failed. Please try again.",
        suggestion: "",
        correctAnswer: "",
        userAnswer: qType2 === 'coding' ? code : selectedAnswer,
        type: qType2,
      };
      setResults(prev => [...prev, fallbackResult]);
      showFeedbackAndAdvance(fallbackResult);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Feedback Toast + Advance ─────────────────────
  const showFeedbackAndAdvance = (result) => {
    setFeedbackToast(result);

    setTimeout(() => {
      setFeedbackToast(null);
      setAnimating(true);

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer('');
          setCode('');
        } else {
          navigate('/results', { state: { results: [...results, result] } });
        }
        setAnimating(false);
      }, 300);
    }, 2000);
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Setup Screen
  // ═══════════════════════════════════════════════════
  const renderSetup = () => {
    if (loading) {
      return (
        <div className="max-w-xl mx-auto mt-20">
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500/30 rounded-full animate-spin"></div>
              <Brain className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Crafting Your Assessment</h2>
            <p className="text-slate-400 max-w-sm">Our AI is generating personalized questions tailored to your difficulty level...</p>
            <div className="flex gap-1.5 mt-6">
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    const selectedTopic = TOPICS.find(t => t.value === topic);

    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="glass-card p-10 overflow-hidden relative">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="text-indigo-400" size={30} />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">Configure Assessment</h2>
            <p className="text-slate-400 text-center mb-10">Choose your topic and difficulty to begin</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 mb-8 text-red-400 text-sm animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Topic Cards */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Topic</label>
              <div className="grid grid-cols-2 gap-4">
                {TOPICS.map(t => {
                  const Icon = t.icon;
                  const isSelected = topic === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTopic(t.value)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle size={18} className="text-indigo-400" />
                        </div>
                      )}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <Icon size={22} />
                      </div>
                      <h4 className={`font-bold text-base mb-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {t.label}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Pills */}
            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Difficulty Level</label>
              <div className="flex gap-3">
                {DIFFICULTIES.map(d => {
                  const isActive = difficulty === d.value;
                  const colorMap = {
                    emerald: isActive ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-emerald-500/10' : '',
                    amber: isActive ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-amber-500/10' : '',
                    red: isActive ? 'bg-red-500/15 border-red-500 text-red-400 shadow-red-500/10' : '',
                  };
                  return (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-3.5 px-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? `${colorMap[d.color]} shadow-lg`
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic}
              className="btn-primary w-full flex justify-center items-center gap-3 py-4 text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={22} />
              <span>Generate Assessment</span>
              <ArrowRight size={20} />
            </button>

            {/* Info Strip */}
            {topic && (
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CircleDot size={12} className="text-indigo-400" /> 5 MCQ Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Code size={12} className="text-purple-400" /> 1 Coding Challenge
                </span>
                <span className="flex items-center gap-1.5">
                  <Brain size={12} className="text-cyan-400" /> AI-Powered
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Test Screen
  // ═══════════════════════════════════════════════════
  const renderTest = () => {
    const currentQ = questions[currentIndex];
    const qType = currentQ?.type?.toLowerCase() || (currentQ?.options?.length > 0 ? 'mcq' : 'coding');
    const isMcq = qType === 'mcq';
    const total = questions.length;
    const progress = ((currentIndex + 1) / total) * 100;

    return (
      <div className={`max-w-4xl mx-auto mt-4 transition-all duration-300 ${animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>

        {/* ── Top Bar: Timer + Progress ──────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Question Type Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isMcq
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {isMcq ? <CircleDot size={12} /> : <FileCode size={12} />}
              {isMcq ? 'MCQ' : 'Coding'}
            </span>

            {/* Difficulty Badge */}
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
              currentQ?.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              currentQ?.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {currentQ?.difficulty || difficulty}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-white/5 rounded-xl">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm font-mono font-bold text-slate-300">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* ── Progress Bar + Dots ────────────────────── */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-slate-400 mb-3">
            <span>Question {currentIndex + 1} of {total}</span>
            <span className="text-indigo-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Question Dots */}
          <div className="flex gap-2 justify-center">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < currentIndex
                    ? results[i]?.isCorrect ? 'bg-emerald-500 shadow-emerald-500/30 shadow-sm' : 'bg-red-500 shadow-red-500/30 shadow-sm'
                    : i === currentIndex
                    ? 'bg-indigo-500 shadow-indigo-500/40 shadow-md scale-125'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Question Card ─────────────────────────── */}
        <div className="glass-card p-8 lg:p-10 mb-8 border-t-4 border-t-indigo-500 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />

          <h3 className="text-xl lg:text-2xl font-semibold text-white mb-8 leading-relaxed relative z-10">
            {currentQ?.title}
          </h3>

          {isMcq ? (
            /* ── MCQ Options with Letters ──────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options?.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(opt)}
                    disabled={submitting}
                    className={`flex items-start gap-4 text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-indigo-500/30'
                    } ${submitting ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    {/* Letter circle */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}>
                      {LETTERS[i]}
                    </div>
                    <span className={`pt-2 font-medium leading-relaxed transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {opt}
                    </span>
                    {isSelected && (
                      <CheckCircle size={20} className="text-indigo-400 ml-auto shrink-0 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* ── Coding Editor ──────────────────── */
            <div className="rounded-xl overflow-hidden border border-white/10 h-[420px]">
              <div className="bg-slate-900 border-b border-white/5 px-5 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-slate-500" />
                  <span className="text-xs font-mono text-slate-400">solution.{language}</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-800 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'gutter',
                  cursorBlinking: 'smooth',
                }}
              />
            </div>
          )}
        </div>

        {/* ── Submit Button ─────────────────────────── */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            {isMcq ? 'Select an option above' : 'Write your solution in the editor'}
          </p>
          <button
            onClick={handleSubmitAnswer}
            disabled={submitting || feedbackToast || (isMcq && !selectedAnswer) || (!isMcq && !code.trim())}
            className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>{currentIndex + 1 === total ? 'Finish Test' : 'Submit & Next'}</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Feedback Toast Overlay
  // ═══════════════════════════════════════════════════
  const renderFeedbackToast = () => {
    if (!feedbackToast) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className={`glass-card p-8 max-w-md w-full mx-6 text-center border-2 animate-scale-in ${
          feedbackToast.isCorrect
            ? 'border-emerald-500/40 shadow-emerald-500/10'
            : 'border-red-500/40 shadow-red-500/10'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            feedbackToast.isCorrect
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {feedbackToast.isCorrect
              ? <CheckCircle size={36} />
              : <XCircle size={36} />
            }
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${feedbackToast.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {feedbackToast.isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            {feedbackToast.feedback}
          </p>
          {feedbackToast.correctAnswer && !feedbackToast.isCorrect && (
            <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
              Correct answer: <span className="text-indigo-400 font-semibold">{feedbackToast.correctAnswer}</span>
            </p>
          )}
          <div className="mt-4 flex gap-1.5 justify-center">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-950 ml-72">
      <Sidebar />
      <Navbar />
      <main className="p-10">
        {!testStarted ? renderSetup() : renderTest()}
      </main>

      {/* Feedback Toast Overlay */}
      {renderFeedbackToast()}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AttemptTest;