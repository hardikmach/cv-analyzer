import React, { useState } from "react";
import { 
  InterviewPrepKit, 
  InterviewQuestion 
} from "../types";
import { 
  HelpCircle, 
  Sparkles, 
  Mic, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  MessageSquare, 
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface InterviewPrepSectionProps {
  prepKit: InterviewPrepKit | null;
  onPracticeQuestion: (question: InterviewQuestion) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const InterviewPrepSection: React.FC<InterviewPrepSectionProps> = ({
  prepKit,
  onPracticeQuestion,
  isLoading,
  onGenerate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-mono text-zinc-300">
          Synthesizing customized interview kit from CV & role requirements...
        </p>
      </div>
    );
  }

  if (!prepKit) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800">
          <HelpCircle className="w-6 h-6 text-zinc-400" />
        </div>
        <h3 className="text-base font-bold text-white">
          No Interview Kit Generated Yet
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Run the CV audit first or click below to generate a tailored question bank, STAR frameworks, and model answers.
        </p>
        <button
          onClick={onGenerate}
          id="generate-kit-btn"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Tailored Interview Kit</span>
        </button>
      </div>
    );
  }

  const categories = ["all", "Resume Deep-Dive", "Behavioral / STAR", "Technical / System Design", "Situational / Leadership"];

  const filteredQuestions = prepKit.questions.filter((q) => {
    if (selectedCategory === "all") return true;
    return q.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
           (selectedCategory.includes("Behavioral") && q.category.includes("STAR")) ||
           (selectedCategory.includes("Technical") && q.category.includes("System"));
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Interview Strategy & Level
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                Target: {prepKit.estimatedDifficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              Personalized Interview Preparation Suite
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              {prepKit.questions.length} Probing Questions
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {prepKit.interviewOverview}
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-zinc-900">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition ${
                selectedCategory === cat
                  ? "bg-white text-black border-white font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {cat === "all" ? "All Questions" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((item, idx) => {
          const isExpanded = expandedQuestionId === item.id || (!expandedQuestionId && idx === 0);

          return (
            <div
              key={item.id || idx}
              className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden transition"
            >
              {/* Question Header */}
              <div
                onClick={() => setExpandedQuestionId(isExpanded ? null : item.id)}
                className="p-5 cursor-pointer hover:bg-zinc-900/40 transition flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {item.category}
                    </span>
                    {item.cvReference && (
                      <span className="text-[11px] font-mono text-cyan-400/90 truncate max-w-md hidden sm:inline">
                        CV Spark: "{item.cvReference}"
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPracticeQuestion(item);
                    }}
                    id={`practice-btn-${idx}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-mono transition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Practice Live</span>
                  </button>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Question Deep Dive */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-zinc-900/80 space-y-4 text-xs font-mono bg-black/40">
                  {/* Why Interviewer Asks */}
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3.5">
                    <span className="text-amber-400 font-semibold block mb-1 uppercase text-[11px] tracking-wider">
                      Why the Interviewer Asks This:
                    </span>
                    <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                      {item.whyInterviewerAsks}
                    </p>
                  </div>

                  {/* Key Rubric Points to Cover */}
                  {item.idealAnswerKeyPoints && item.idealAnswerKeyPoints.length > 0 && (
                    <div>
                      <span className="text-zinc-400 font-semibold block mb-2 uppercase text-[11px] tracking-wider">
                        Key Points & Competencies to Hit:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.idealAnswerKeyPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start space-x-2 text-zinc-300 font-sans text-xs bg-zinc-900/40 p-2.5 rounded border border-zinc-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STAR Framework Tip */}
                  {item.starFrameworkTip && (
                    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-3">
                      <span className="text-cyan-400 font-semibold block mb-1 uppercase text-[11px] tracking-wider">
                        STAR Framework Tip (Situation, Task, Action, Result):
                      </span>
                      <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                        {item.starFrameworkTip}
                      </p>
                    </div>
                  )}

                  {/* Benchmark Model Answer */}
                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-3.5 space-y-1.5">
                    <span className="text-emerald-400 font-semibold block uppercase text-[11px] tracking-wider">
                      Benchmark High-Scoring Model Response:
                    </span>
                    <p className="text-zinc-200 font-sans text-xs leading-relaxed whitespace-pre-line bg-black/60 p-3 rounded border border-zinc-900">
                      "{item.sampleModelAnswer}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reverse Questions & Salary Negotiation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-IQ Questions to Ask Interviewer */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              High-IQ Questions to Ask Hiring Managers
            </h3>
          </div>
          <div className="space-y-3">
            {prepKit.questionsToAskInterviewer.map((rq, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-zinc-100">
                  "{rq.question}"
                </p>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Why it impresses: {rq.whyItImpresses}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Salary & Offer Leverage Points */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              CV-Derived Salary & Negotiation Leverage Points
            </h3>
          </div>
          <ul className="space-y-2.5">
            {prepKit.salaryLeveragePoints.map((point, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-300 bg-zinc-900/40 p-2.5 rounded border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
