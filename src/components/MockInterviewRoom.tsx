import React, { useState, useEffect, useRef } from "react";
import { 
  InterviewQuestion, 
  AnswerEvaluation, 
  MockSessionRecord, 
  InterviewPrepKit 
} from "../types";
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  User, 
  Bot, 
  ArrowRight, 
  History,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";

interface MockInterviewRoomProps {
  prepKit: InterviewPrepKit | null;
  activeQuestion: InterviewQuestion | null;
  setActiveQuestion: (q: InterviewQuestion | null) => void;
  cvText: string;
  targetRole: string;
}

export const MockInterviewRoom: React.FC<MockInterviewRoomProps> = ({
  prepKit,
  activeQuestion,
  setActiveQuestion,
  cvText,
  targetRole,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [sessionHistory, setSessionHistory] = useState<MockSessionRecord[]>([]);
  const [interviewerPersona, setInterviewerPersona] = useState<string>("Staff Engineer / Tech Bar Raiser");
  const [speechSynthEnabled, setSpeechSynthEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Set default question if none is active
  useEffect(() => {
    if (!activeQuestion && prepKit?.questions && prepKit.questions.length > 0) {
      setActiveQuestion(prepKit.questions[0]);
    }
  }, [prepKit, activeQuestion, setActiveQuestion]);

  // Read question aloud when selected if speech synth enabled
  const speakQuestion = (text: string) => {
    if (!speechSynthEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectQuestion = (q: InterviewQuestion) => {
    setActiveQuestion(q);
    setUserAnswer("");
    setEvaluation(null);
    speakQuestion(q.question);
  };

  // Toggle Web Speech Recognition for mic answer input
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your answer in the text box.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setUserAnswer(transcript.trim());
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (e) {
      console.warn(e);
      setIsRecording(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!activeQuestion || !userAnswer.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    try {
      setIsEvaluating(true);
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion.question,
          userAnswer: userAnswer.trim(),
          category: activeQuestion.category,
          cvContext: cvText,
          targetRole,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to evaluate answer");
      }

      const data: AnswerEvaluation = await res.json();
      setEvaluation(data);

      if (data.score >= 80) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#10b981", "#06b6d4", "#ffffff"],
          });
        } catch (_) {}
      }

      // Add to session history
      const record: MockSessionRecord = {
        questionId: activeQuestion.id,
        question: activeQuestion.question,
        category: activeQuestion.category,
        userAnswer: userAnswer.trim(),
        evaluation: data,
        timestamp: Date.now(),
      };
      setSessionHistory((prev) => [record, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to evaluate answer.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!prepKit?.questions) return;
    const currentIndex = prepKit.questions.findIndex((q) => q.id === activeQuestion?.id);
    const nextIndex = (currentIndex + 1) % prepKit.questions.length;
    handleSelectQuestion(prepKit.questions[nextIndex]);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "bg-emerald-950/80 text-emerald-300 border-emerald-700/60";
    if (score >= 70) return "bg-cyan-950/80 text-cyan-300 border-cyan-700/60";
    if (score >= 50) return "bg-amber-950/80 text-amber-300 border-amber-700/60";
    return "bg-red-950/80 text-red-300 border-red-700/60";
  };

  if (!prepKit || !prepKit.questions || prepKit.questions.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800">
          <Mic className="w-6 h-6 text-zinc-400" />
        </div>
        <h3 className="text-base font-bold text-white">
          Mock Interview Simulator
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Please run a CV audit first in Tab 1 to generate personalized technical and behavioral interview questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-white">
                Live AI Mock Interview Room
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Role Target: {targetRole || "Senior Engineer"}
            </p>
          </div>
        </div>

        {/* Persona Selector & Speech Toggle */}
        <div className="flex items-center space-x-2">
          <select
            value={interviewerPersona}
            onChange={(e) => setInterviewerPersona(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono outline-none"
          >
            <option value="Staff Engineer / Tech Bar Raiser">Staff Engineer (Deep Tech)</option>
            <option value="VP of Engineering / Hiring Manager">Hiring Manager (Leadership & Culture)</option>
            <option value="Principal Product Architect">Product Architect (System Design & Scale)</option>
          </select>

          <button
            onClick={() => setSpeechSynthEnabled(!speechSynthEnabled)}
            className={`p-2 rounded-lg border text-xs transition ${
              speechSynthEnabled
                ? "bg-zinc-900 text-zinc-200 border-zinc-700"
                : "bg-zinc-950 text-zinc-600 border-zinc-900"
            }`}
            title={speechSynthEnabled ? "Voice Enabled" : "Voice Muted"}
          >
            {speechSynthEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Simulation Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Question Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3">
              <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
                Question Queue ({prepKit.questions.length})
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {prepKit.questions.map((q, idx) => (
                <button
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(q)}
                  id={`mock-q-${idx}`}
                  className={`w-full text-left p-3 rounded-lg border transition space-y-1.5 ${
                    activeQuestion?.id === q.id
                      ? "bg-zinc-900 border-white/60 text-white"
                      : "bg-zinc-950/60 hover:bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Q{idx + 1}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {q.category.split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-xs font-medium line-clamp-2 leading-relaxed">
                    {q.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Interviewer Stage & Response Input */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Question Prompter Card */}
          {activeQuestion && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                  Interviewer Question:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakQuestion(activeQuestion.question)}
                    className="hover:text-white flex items-center space-x-1"
                    title="Replay Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                  <span>•</span>
                  <span>{activeQuestion.category}</span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                "{activeQuestion.question}"
              </h2>

              {activeQuestion.cvReference && (
                <p className="text-xs font-mono text-zinc-400 bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                  <span className="text-cyan-400">Context:</span> Sparked from CV project: "{activeQuestion.cvReference}"
                </p>
              )}
            </div>
          )}

          {/* User Answer Stage */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Your Candidate Response (Type or Speak)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  id="mic-toggle-btn"
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-md border transition ${
                    isRecording
                      ? "bg-red-950 text-red-300 border-red-700 animate-pulse"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording... (Click to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Voice Answer (Mic)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Speak or type your answer here. Remember the STAR format: Situation, Task, Action, Result..."
              rows={6}
              id="mock-answer-input"
              className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 rounded-lg p-3.5 text-xs sm:text-sm text-zinc-100 font-sans leading-relaxed outline-none resize-y"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] font-mono text-zinc-500">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setUserAnswer("")}
                  className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 transition"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  id="submit-answer-btn"
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold transition ${
                    isEvaluating || !userAnswer.trim()
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                      : "bg-white text-black hover:bg-zinc-200 shadow-md active:scale-95"
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Evaluating with Hiring Bar Raiser...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Evaluate & Score My Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Evaluation Report (Score & STAR Rubric) */}
          {evaluation && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-5">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-900">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Hiring Manager Feedback & Score
                  </span>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {evaluation.score}
                    </span>
                    <span className="text-sm font-mono text-zinc-500">/ 100</span>
                    <span className={`px-2.5 py-0.5 text-xs font-mono rounded-full border ${getScoreBadge(evaluation.score)}`}>
                      {evaluation.ratingLabel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  id="next-question-btn"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-white transition"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Feedback Summary */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800 font-sans">
                {evaluation.feedbackSummary}
              </p>

              {/* STAR Rubric Breakdown */}
              <div>
                <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider block mb-2.5">
                  STAR Rubric Breakdown:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-semibold block mb-1">S — Situation</span>
                    <p className="text-zinc-300 font-sans text-xs">{evaluation.starAnalysis.situation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-semibold block mb-1">T — Task</span>
                    <p className="text-zinc-300 font-sans text-xs">{evaluation.starAnalysis.task}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-semibold block mb-1">A — Action & Ownership</span>
                    <p className="text-zinc-300 font-sans text-xs">{evaluation.starAnalysis.action}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-semibold block mb-1">R — Result & Metrics</span>
                    <p className="text-zinc-300 font-sans text-xs">{evaluation.starAnalysis.result}</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Areas to Improve Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                  <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
                    What Worked Well:
                  </span>
                  <ul className="space-y-1.5">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-2">
                  <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider block">
                    What to Improve:
                  </span>
                  <ul className="space-y-1.5">
                    {evaluation.areasToImprove.map((imp, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* High-Impact Benchmark Rewrite of their exact story */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-2">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
                  How a Staff/Principal Engineer would state this exact story:
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed bg-black/60 p-3.5 rounded border border-zinc-900 whitespace-pre-line">
                  "{evaluation.improvedAnswerRewrite}"
                </p>
              </div>

              {/* Natural Follow-up question */}
              {evaluation.followUpQuestion && (
                <div className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-start space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                      Probable Next Follow-up from Interviewer:
                    </span>
                    <p className="text-xs text-zinc-300 font-sans mt-0.5">
                      "{evaluation.followUpQuestion}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
