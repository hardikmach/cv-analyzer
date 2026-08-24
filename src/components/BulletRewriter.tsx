import React, { useState } from "react";
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  Layers, 
  Award,
  TrendingUp,
  Code
} from "lucide-react";

interface BulletRewriterProps {
  initialBullet?: string;
  targetRole: string;
}

export const BulletRewriter: React.FC<BulletRewriterProps> = ({
  initialBullet = "",
  targetRole,
}) => {
  const [bulletText, setBulletText] = useState(
    initialBullet || "Worked on migrating the backend to microservices and improved API speed."
  );
  const [role, setRole] = useState(targetRole || "Senior Software Engineer");
  const [isRewriting, setIsRewriting] = useState(false);
  const [results, setResults] = useState<{
    original: string;
    metricFocused: string;
    executiveFocused: string;
    technicalFocused: string;
    keyVerbsUsed: string[];
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!bulletText.trim()) return;

    try {
      setIsRewriting(true);
      const res = await fetch("/api/optimize-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: bulletText.trim(),
          targetRole: role,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to optimize bullet.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      alert(err.message || "Failed to optimize bullet.");
    } finally {
      setIsRewriting(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
          <PenTool className="w-4 h-4 text-emerald-400" />
          <span>Google XYZ Resume Formula Transformer</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Transform Passive Bullet Points into Quantified Accomplishments
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
          The XYZ formula: <span className="text-zinc-200 font-mono">"Accomplished [X] as measured by [Y], by doing [Z]"</span>. Paste any raw line to generate 3 tailored styles.
        </p>

        {/* Input Sandbox */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
                Original Bullet Point:
              </label>
              <textarea
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                placeholder="e.g. Built a new caching layer with Redis to speed up database queries..."
                rows={3}
                id="bullet-rewriter-input"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-3 text-xs text-zinc-100 font-mono outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
                Target Role Context:
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                id="bullet-role-input"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-3 text-xs text-zinc-100 font-mono outline-none"
              />
              <button
                type="button"
                onClick={handleRewrite}
                disabled={isRewriting || !bulletText.trim()}
                id="generate-rewrites-btn"
                className={`mt-3 w-full py-2.5 px-4 rounded-lg font-medium text-xs transition flex items-center justify-center space-x-2 ${
                  isRewriting || !bulletText.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-white text-black hover:bg-zinc-200 font-semibold"
                }`}
              >
                {isRewriting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Transforming...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate 3 High-Impact Variations</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Variations */}
      {results && (
        <div className="space-y-4">
          {/* Key Verbs Banner */}
          {results.keyVerbsUsed && results.keyVerbsUsed.length > 0 && (
            <div className="flex items-center space-x-2 text-xs font-mono bg-zinc-950 border border-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-500 uppercase">Power Action Verbs:</span>
              <div className="flex flex-wrap gap-1.5">
                {results.keyVerbsUsed.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 text-[11px]">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Option 1: Metric & Impact Heavy */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  1. Metric & Quantified Impact (Google XYZ Formula)
                </span>
              </div>
              <button
                onClick={() => copyText(results.metricFocused, "metric")}
                id="copy-metric-btn"
                className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-white transition"
              >
                {copiedKey === "metric" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-zinc-100 bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/40 font-mono leading-relaxed">
              • {results.metricFocused}
            </p>
          </div>

          {/* Option 2: Executive & Leadership Angle */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  2. Executive & Leadership / High-Agency Angle
                </span>
              </div>
              <button
                onClick={() => copyText(results.executiveFocused, "executive")}
                id="copy-exec-btn"
                className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-white transition"
              >
                {copiedKey === "executive" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-zinc-100 bg-cyan-950/20 p-3.5 rounded-lg border border-cyan-900/40 font-mono leading-relaxed">
              • {results.executiveFocused}
            </p>
          </div>

          {/* Option 3: Technical Depth & Modern Tooling */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  3. Technical Depth & Architecture Scaling Style
                </span>
              </div>
              <button
                onClick={() => copyText(results.technicalFocused, "tech")}
                id="copy-tech-btn"
                className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-white transition"
              >
                {copiedKey === "tech" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-zinc-100 bg-amber-950/20 p-3.5 rounded-lg border border-amber-900/40 font-mono leading-relaxed">
              • {results.technicalFocused}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
