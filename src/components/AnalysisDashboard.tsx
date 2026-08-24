import React, { useState } from "react";
import { 
  CVAnalysisResult 
} from "../types";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  Eye, 
  Layers, 
  TrendingUp, 
  Cpu, 
  Award,
  Zap
} from "lucide-react";

interface AnalysisDashboardProps {
  analysis: CVAnalysisResult;
  onNavigateToInterview: () => void;
  onNavigateToMock: () => void;
  onNavigateToRewriter: (bullet?: string) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onNavigateToInterview,
  onNavigateToMock,
  onNavigateToRewriter,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === "number") {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    if (score >= 70) return "text-cyan-400 border-cyan-500/30 bg-cyan-950/20";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-950/20";
    return "text-red-400 border-red-500/30 bg-red-950/20";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-cyan-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Candidate Info & Score Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Score Card */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Overall ATS Index
              </span>
              <span className={`px-2 py-0.5 text-[11px] font-mono rounded-full border ${getScoreColor(analysis.overallScore)}`}>
                {analysis.scoreLabel}
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-6xl font-black tracking-tight text-white font-mono">
                {analysis.overallScore}
              </span>
              <span className="text-xl text-zinc-500 font-mono">/100</span>
            </div>

            <p className="mt-2 text-xs text-zinc-400">
              Evaluated against top-tier tech bar-raiser benchmarks and ATS parsing standards.
            </p>
          </div>

          {/* Quick Category Metric Bars */}
          <div className="mt-6 space-y-3 pt-4 border-t border-zinc-900 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>ATS Parsing Safety</span>
                <span className="text-zinc-200">{analysis.categoryScores.atsCompatibility}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreProgressColor(analysis.categoryScores.atsCompatibility)} transition-all duration-500`}
                  style={{ width: `${analysis.categoryScores.atsCompatibility}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Metrics & Quantified Impact</span>
                <span className="text-zinc-200">{analysis.categoryScores.impactAndMetrics}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreProgressColor(analysis.categoryScores.impactAndMetrics)} transition-all duration-500`}
                  style={{ width: `${analysis.categoryScores.impactAndMetrics}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Skills & Keyword Density</span>
                <span className="text-zinc-200">{analysis.categoryScores.skillsDensity}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreProgressColor(analysis.categoryScores.skillsDensity)} transition-all duration-500`}
                  style={{ width: `${analysis.categoryScores.skillsDensity}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Brevity & Layout Flow</span>
                <span className="text-zinc-200">{analysis.categoryScores.brevityAndStructure}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreProgressColor(analysis.categoryScores.brevityAndStructure)} transition-all duration-500`}
                  style={{ width: `${analysis.categoryScores.brevityAndStructure}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recruiter 6-Second First Scan & Candidate Summary */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {analysis.candidateName || "Candidate Profile"}
                </h2>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {analysis.headline || "Detected Profile Title"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onNavigateToInterview}
                  id="dash-go-to-interview"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-white transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
                  <span>View Interview Kit</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
                <button
                  onClick={onNavigateToMock}
                  id="dash-go-to-mock"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Live Mock</span>
                </button>
              </div>
            </div>

            {/* Recruiter 6-Second First Scan Simulation */}
            <div className="mt-4 bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-xs font-mono font-medium text-amber-400 uppercase tracking-wider mb-1.5">
                <Eye className="w-4 h-4" />
                <span>Recruiter 6-Second First Scan Simulation:</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                "{analysis.recruiterFirstScan}"
              </p>
            </div>

            {/* 60-Second Elevator Pitch */}
            <div className="mt-4 bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Tailored 60-Second "Tell Me About Yourself" Opening:
                </span>
                <button
                  onClick={() => copyToClipboard(analysis.elevatorPitch)}
                  id="copy-pitch-btn"
                  className="inline-flex items-center space-x-1 text-[11px] font-mono text-zinc-400 hover:text-white transition"
                >
                  {copiedPitch ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Pitch</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic bg-black/40 p-3 rounded border border-zinc-900">
                "{analysis.elevatorPitch}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Critical Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-900">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Standout Strengths ({analysis.strengths.length})</span>
          </div>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Improvements Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-900">
            <AlertTriangle className="w-4 h-4" />
            <span>High-Priority ATS & Impact Fixes ({analysis.criticalImprovements.length})</span>
          </div>
          <ul className="space-y-3">
            {analysis.criticalImprovements.map((fix, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                <span className="leading-relaxed">{fix}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills Gap & Keyword Density Analysis */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Skills Matrix & Keyword Targeting
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            ATS Semantic Parsing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Detected Skills */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono font-medium text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Detected Skills in CV</span>
              <span className="text-zinc-500">{analysis.skillsAnalysis.detectedSkills.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillsAnalysis.detectedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Key Skills */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono font-medium text-red-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Missing Target Keywords</span>
              <span className="text-zinc-500">{analysis.skillsAnalysis.missingKeySkills.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillsAnalysis.missingKeySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-red-950/50 text-red-300 border border-red-900"
                >
                  +{skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended ATS Boost Keywords */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono font-medium text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Recommended Industry Terms</span>
              <span className="text-zinc-500">{analysis.skillsAnalysis.suggestedKeywords.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillsAnalysis.suggestedKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-cyan-950/40 text-cyan-300 border border-cyan-900"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section-by-Section Line Audits & Bullet Transformations */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-900">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Section Line-by-Line Audits & Benchmark Rewrites</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Transformed using Google XYZ Formula (Accomplished [X] measured by [Y] by doing [Z]).
            </p>
          </div>
          <button
            onClick={() => onNavigateToRewriter()}
            id="open-custom-rewriter-btn"
            className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 transition"
          >
            <span>Rewrite Any Bullet Point →</span>
          </button>
        </div>

        <div className="space-y-4">
          {analysis.bulletAudits.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-4 space-y-3"
            >
              {/* Original Bullet */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Original Bullet from CV:
                  </span>
                  <span className="text-[11px] font-mono text-red-400/80">
                    Needs Impact
                  </span>
                </div>
                <p className="text-xs text-zinc-400 bg-black/40 p-2.5 rounded border border-zinc-900 font-mono">
                  {item.originalBullet}
                </p>
              </div>

              {/* Recruiter Critique */}
              <div className="text-xs text-amber-300/90 flex items-start space-x-2 bg-amber-950/20 p-2 rounded border border-amber-900/30">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>Critique: {item.critique}</span>
              </div>

              {/* Improved Benchmark Rewrite */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    High-Impact Recruiter-Approved Rewrite:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onNavigateToRewriter(item.improvedBullet)}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white transition"
                    >
                      Fine-tune
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.improvedBullet, idx)}
                      id={`copy-bullet-${idx}`}
                      className="inline-flex items-center space-x-1 text-[11px] font-mono text-zinc-400 hover:text-white transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-100 bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40 font-mono leading-relaxed">
                  {item.improvedBullet}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Formatting & Parser Safety Checklist */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-zinc-900 mb-4">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-tight">
            ATS Technical Parser Audit
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-500 mb-1">Standard Section Headings</div>
            <div className="flex items-center space-x-1.5 text-zinc-200">
              {analysis.atsFormattingCheck.hasClearSections ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Pass</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">Review Headings</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-500 mb-1">Action Verb Starts</div>
            <div className="flex items-center space-x-1.5 text-zinc-200">
              {analysis.atsFormattingCheck.hasActionVerbs ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Strong Active Voice</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">Add Action Verbs</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-500 mb-1">Quantified Metrics Count</div>
            <div className="flex items-center space-x-1.5 text-white font-bold text-sm">
              <span>{analysis.atsFormattingCheck.quantifiedResultsCount} data points</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-500 mb-1">Parser Clutter Warning</div>
            <div className="text-zinc-300">
              {analysis.atsFormattingCheck.unwantedClutter.length === 0 ? (
                <span className="text-emerald-400">0 parser traps found</span>
              ) : (
                <span className="text-amber-400">{analysis.atsFormattingCheck.unwantedClutter.length} flags found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
