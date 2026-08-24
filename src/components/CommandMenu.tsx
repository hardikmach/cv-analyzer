import React, { useState, useEffect } from "react";
import { 
  X, 
  Search, 
  FileText, 
  HelpCircle, 
  Mic, 
  PenTool, 
  Download, 
  Zap, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { SAMPLE_CVS } from "../data/sampleCvs";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: "analysis" | "interview" | "mock" | "rewriter") => void;
  onLoadSample: (sampleId: string) => void;
  onExport: () => void;
  onReset: () => void;
  hasAnalysis: boolean;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onLoadSample,
  onExport,
  onReset,
  hasAnalysis,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle handled outside
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "tab-analysis",
      title: "Go to CV & ATS Audit",
      shortcut: "1",
      icon: FileText,
      action: () => {
        onSelectTab("analysis");
        onClose();
      },
    },
    {
      id: "tab-interview",
      title: "Go to Tailored Interview Prep Kit",
      shortcut: "2",
      icon: HelpCircle,
      action: () => {
        onSelectTab("interview");
        onClose();
      },
    },
    {
      id: "tab-mock",
      title: "Go to Live Mock Interview Simulator",
      shortcut: "3",
      icon: Mic,
      action: () => {
        onSelectTab("mock");
        onClose();
      },
    },
    {
      id: "tab-rewriter",
      title: "Go to Bullet Point Optimizer (XYZ Formula)",
      shortcut: "4",
      icon: PenTool,
      action: () => {
        onSelectTab("rewriter");
        onClose();
      },
    },
    ...(hasAnalysis
      ? [
          {
            id: "action-export",
            title: "Export Audit & Prep Report (PDF/Markdown)",
            shortcut: "E",
            icon: Download,
            action: () => {
              onExport();
              onClose();
            },
          },
          {
            id: "action-reset",
            title: "Start New CV Audit",
            shortcut: "R",
            icon: RefreshCw,
            action: () => {
              onReset();
              onClose();
            },
          },
        ]
      : []),
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSamples = SAMPLE_CVS.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 space-x-3">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search preset profiles..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-3">
          {/* Navigation & Commands */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Navigation & Actions
            </span>
            {filteredActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={act.action}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-900 transition text-left group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    <span>{act.title}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                    {act.shortcut}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Preset Profiles */}
          <div className="space-y-1 pt-2 border-t border-zinc-900">
            <span className="px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Load Preset Profile
            </span>
            {filteredSamples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  onLoadSample(sample.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-900 transition text-left group"
              >
                <div>
                  <div className="text-zinc-200 group-hover:text-white font-medium">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-sans">
                    {sample.role} • {sample.level}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Navigate with mouse or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
