/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CVInputSection } from "./components/CVInputSection";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { InterviewPrepSection } from "./components/InterviewPrepSection";
import { MockInterviewRoom } from "./components/MockInterviewRoom";
import { BulletRewriter } from "./components/BulletRewriter";
import { ExportModal } from "./components/ExportModal";
import { CommandMenu } from "./components/CommandMenu";
import { CVAnalysisResult, InterviewPrepKit, InterviewQuestion } from "./types";
import { SAMPLE_CVS } from "./data/sampleCvs";

export default function App() {
  const [activeTab, setActiveTab] = useState<"analysis" | "interview" | "mock" | "rewriter">("analysis");
  
  // Input State initialized with default sample for immediate delight
  const defaultSample = SAMPLE_CVS[0];
  const [cvText, setCvText] = useState(defaultSample.content);
  const [targetRole, setTargetRole] = useState(defaultSample.role);
  const [jobDescription, setJobDescription] = useState(defaultSample.jobDescription || "");

  // Output & Analysis State
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [prepKit, setPrepKit] = useState<InterviewPrepKit | null>(null);
  const [activeMockQuestion, setActiveMockQuestion] = useState<InterviewQuestion | null>(null);
  const [rewriterInitialBullet, setRewriterInitialBullet] = useState<string>("");

  // Loading & Error states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPrepping, setIsPrepping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Run Combined CV Analysis & Interview Kit Generation
  const handleRunFullAnalysis = async () => {
    if (!cvText || cvText.trim().length < 20) {
      setError("Please provide a valid CV (minimum 20 characters).");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setIsPrepping(true);

    try {
      // 1. Fetch CV Analysis
      const analysisPromise = fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: cvText.trim(),
          targetRole: targetRole.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      // 2. Fetch Interview Prep Kit in parallel
      const prepPromise = fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: cvText.trim(),
          targetRole: targetRole.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      const [analysisRes, prepRes] = await Promise.all([analysisPromise, prepPromise]);

      if (!analysisRes.ok) {
        const errData = await analysisRes.json();
        throw new Error(errData.error || "CV analysis failed.");
      }

      const analysisData: CVAnalysisResult = await analysisRes.json();
      setAnalysis(analysisData);

      if (prepRes.ok) {
        const prepData: InterviewPrepKit = await prepRes.json();
        setPrepKit(prepData);
        if (prepData.questions && prepData.questions.length > 0) {
          setActiveMockQuestion(prepData.questions[0]);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
      setIsPrepping(false);
    }
  };

  const handleGenerateInterviewKitOnly = async () => {
    if (!cvText || cvText.trim().length < 20) return;
    try {
      setIsPrepping(true);
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: cvText.trim(),
          targetRole: targetRole.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate interview kit.");
      const data: InterviewPrepKit = await res.json();
      setPrepKit(data);
      if (data.questions && data.questions.length > 0) {
        setActiveMockQuestion(data.questions[0]);
      }
    } catch (err: any) {
      alert(err.message || "Failed to generate kit");
    } finally {
      setIsPrepping(false);
    }
  };

  const handlePracticeQuestion = (question: InterviewQuestion) => {
    setActiveMockQuestion(question);
    setActiveTab("mock");
  };

  const handleNavigateToRewriter = (bullet?: string) => {
    if (bullet) {
      setRewriterInitialBullet(bullet);
    }
    setActiveTab("rewriter");
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_CVS.find((s) => s.id === sampleId);
    if (sample) {
      setCvText(sample.content);
      setTargetRole(sample.role);
      setJobDescription(sample.jobDescription || "");
      setAnalysis(null);
      setPrepKit(null);
      setActiveTab("analysis");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setPrepKit(null);
    setActiveTab("analysis");
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col vercel-grid-bg selection:bg-zinc-800 selection:text-white">
      {/* Vercel Glow Header Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 vercel-subtle-glow pointer-events-none"></div>

      {/* Main App Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={!!analysis}
        onOpenCommand={() => setIsCommandOpen(true)}
        onExport={() => setIsExportOpen(true)}
        onReset={handleReset}
        isAnalyzing={isAnalyzing || isPrepping}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Tab 1: CV & ATS Audit */}
        {activeTab === "analysis" && (
          <div className="space-y-8">
            {!analysis ? (
              <CVInputSection
                cvText={cvText}
                setCvText={setCvText}
                targetRole={targetRole}
                setTargetRole={setTargetRole}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onAnalyze={handleRunFullAnalysis}
                isAnalyzing={isAnalyzing}
                error={error}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-500">Audited Profile:</span>
                    <span className="text-white font-semibold">{analysis.candidateName}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{analysis.overallScore}/100 ATS Score</span>
                  </div>
                  <button
                    onClick={() => setAnalysis(null)}
                    id="edit-input-cv-btn"
                    className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Edit CV / Re-upload
                  </button>
                </div>

                <AnalysisDashboard
                  analysis={analysis}
                  onNavigateToInterview={() => setActiveTab("interview")}
                  onNavigateToMock={() => setActiveTab("mock")}
                  onNavigateToRewriter={handleNavigateToRewriter}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tailored Interview Prep Kit */}
        {activeTab === "interview" && (
          <InterviewPrepSection
            prepKit={prepKit}
            onPracticeQuestion={handlePracticeQuestion}
            isLoading={isPrepping}
            onGenerate={handleGenerateInterviewKitOnly}
          />
        )}

        {/* Tab 3: Live Interactive Mock Interview Simulator */}
        {activeTab === "mock" && (
          <MockInterviewRoom
            prepKit={prepKit}
            activeQuestion={activeMockQuestion}
            setActiveQuestion={setActiveMockQuestion}
            cvText={cvText}
            targetRole={targetRole}
          />
        )}

        {/* Tab 4: Bullet Point Optimizer (XYZ Formula) */}
        {activeTab === "rewriter" && (
          <BulletRewriter
            initialBullet={rewriterInitialBullet}
            targetRole={targetRole}
          />
        )}
      </main>

      {/* Modals */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={setActiveTab}
        onLoadSample={handleLoadSample}
        onExport={() => setIsExportOpen(true)}
        onReset={handleReset}
        hasAnalysis={!!analysis}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        analysis={analysis}
        prepKit={prepKit}
        targetRole={targetRole}
      />

      {/* Vercel-Style Footer */}
      <footer className="border-t border-zinc-900 bg-black/90 py-6 mt-12 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <svg
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 fill-zinc-500"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span>CV Sentinel • Next-Gen ATS Auditor & Interview Room</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 text-[11px]">
            <span>Powered by Gemini 3.7 Flash</span>
            <span>•</span>
            <span>Google XYZ Formula</span>
            <span>•</span>
            <span>STAR Rubric</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
