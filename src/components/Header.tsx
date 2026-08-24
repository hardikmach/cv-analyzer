import React from "react";
import { 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Mic, 
  PenTool, 
  Download, 
  Command, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface HeaderProps {
  activeTab: "analysis" | "interview" | "mock" | "rewriter";
  setActiveTab: (tab: "analysis" | "interview" | "mock" | "rewriter") => void;
  hasAnalysis: boolean;
  onOpenCommand: () => void;
  onExport: () => void;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasAnalysis,
  onOpenCommand,
  onExport,
  onReset,
  isAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            {/* Vercel Triangle Icon */}
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  viewBox="0 0 76 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-white"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
              <span className="text-zinc-600">/</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  CV Sentinel
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  v3.7-flash
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-zinc-800 space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {isAnalyzing ? "Processing with Gemini 3.7 Flash..." : "ATS Core Online"}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCommand}
              id="command-palette-trigger"
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 rounded-md hover:text-white hover:border-zinc-700 transition"
              title="Open Command Palette (Ctrl/Cmd + K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Quick Actions</span>
              <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded font-mono border border-zinc-700">
                ⌘K
              </kbd>
            </button>

            {hasAnalysis && (
              <button
                onClick={onExport}
                id="export-report-btn"
                className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            )}

            {hasAnalysis && (
              <button
                onClick={onReset}
                id="reset-analysis-btn"
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent rounded-md transition"
                title="Start new analysis"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">New Audit</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 -mb-px overflow-x-auto no-scrollbar border-t border-zinc-900 pt-1">
          <button
            onClick={() => setActiveTab("analysis")}
            id="tab-analysis"
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "analysis"
                ? "border-white text-white font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. CV & ATS Audit</span>
            {hasAnalysis && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            id="tab-interview"
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "interview"
                ? "border-white text-white font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Interview Prep Kit</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded">
              STAR
            </span>
          </button>

          <button
            onClick={() => setActiveTab("mock")}
            id="tab-mock"
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "mock"
                ? "border-white text-white font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>3. Live Mock Room</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded">
              Interactive
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rewriter")}
            id="tab-rewriter"
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "rewriter"
                ? "border-white text-white font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>4. Bullet Point Optimizer</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded">
              XYZ Formula
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
