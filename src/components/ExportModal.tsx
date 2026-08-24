import React, { useState } from "react";
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  FileText, 
  Sparkles 
} from "lucide-react";
import { CVAnalysisResult, InterviewPrepKit } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CVAnalysisResult | null;
  prepKit: InterviewPrepKit | null;
  targetRole: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  prepKit,
  targetRole,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const generateMarkdownReport = () => {
    let md = `# CV ATS Audit & Interview Preparation Report\n`;
    md += `Generated: ${new Date().toLocaleDateString()} | Target Role: ${targetRole || "Tech Professional"}\n\n`;
    md += `## 1. Overall ATS Score: ${analysis.overallScore}/100 (${analysis.scoreLabel})\n`;
    md += `- ATS Compatibility: ${analysis.categoryScores.atsCompatibility}%\n`;
    md += `- Impact & Metrics: ${analysis.categoryScores.impactAndMetrics}%\n`;
    md += `- Skills Density: ${analysis.categoryScores.skillsDensity}%\n`;
    md += `- Brevity & Structure: ${analysis.categoryScores.brevityAndStructure}%\n\n`;

    md += `## 2. Recruiter 6-Second First Scan Simulation\n`;
    md += `> ${analysis.recruiterFirstScan}\n\n`;

    md += `## 3. Key Strengths\n`;
    analysis.strengths.forEach((s) => (md += `- ${s}\n`));
    md += `\n`;

    md += `## 4. High-Priority Improvements\n`;
    analysis.criticalImprovements.forEach((f) => (md += `- ${f}\n`));
    md += `\n`;

    md += `## 5. Skills & Keyword Matrix\n`;
    md += `**Detected Skills:** ${analysis.skillsAnalysis.detectedSkills.join(", ")}\n\n`;
    md += `**Missing Target Keywords:** ${analysis.skillsAnalysis.missingKeySkills.join(", ")}\n\n`;

    md += `## 6. High-Impact Bullet Rewrites\n`;
    analysis.bulletAudits.forEach((b, i) => {
      md += `### Bullet ${i + 1}\n`;
      md += `* **Original:** ${b.originalBullet}\n`;
      md += `* **Critique:** ${b.critique}\n`;
      md += `* **Optimized:** ${b.improvedBullet}\n\n`;
    });

    if (prepKit && prepKit.questions) {
      md += `## 7. Tailored Interview Question Bank\n`;
      prepKit.questions.forEach((q, i) => {
        md += `### Q${i + 1}: ${q.question} [${q.category}]\n`;
        md += `* **Why Interviewers Ask:** ${q.whyInterviewerAsks}\n`;
        md += `* **STAR Framework Tip:** ${q.starFrameworkTip || "Use Situation, Task, Action, Result"}\n`;
        md += `* **Model Answer:** ${q.sampleModelAnswer}\n\n`;
      });
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_Audit_Interview_Prep_${analysis.candidateName.replace(/\s+/g, "_") || "Report"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white font-mono">
              Export Audit & Interview Report
            </h3>
          </div>
          <button
            onClick={onClose}
            id="close-export-modal"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Preview */}
        <div className="p-6 flex-1 overflow-y-auto font-mono text-xs text-zinc-300 space-y-4 bg-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <span className="text-zinc-500">Document Format: Markdown / PDF</span>
            <span className="text-emerald-400">Score: {analysis.overallScore}/100</span>
          </div>

          <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap font-mono">
            {generateMarkdownReport()}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-zinc-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
