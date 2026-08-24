import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Briefcase, 
  Layers, 
  AlertCircle,
  FileCode,
  Zap,
  Info
} from "lucide-react";
import { SAMPLE_CVS } from "../data/sampleCvs";
import { extractTextFromFile } from "../utils/pdfParser";

interface CVInputSectionProps {
  cvText: string;
  setCvText: (text: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
}

export const CVInputSection: React.FC<CVInputSectionProps> = ({
  cvText,
  setCvText,
  targetRole,
  setTargetRole,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isAnalyzing,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showJdInput, setShowJdInput] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsingFile, setParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    try {
      setParsingFile(true);
      setUploadedFileName(file.name);
      const text = await extractTextFromFile(file);
      setCvText(text);
    } catch (err: any) {
      alert(err.message || "Failed to parse file.");
    } finally {
      setParsingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileProcess(e.target.files[0]);
    }
  };

  const loadSample = (sampleId: string) => {
    const sample = SAMPLE_CVS.find((s) => s.id === sampleId);
    if (sample) {
      setCvText(sample.content);
      setTargetRole(sample.role);
      if (sample.jobDescription) {
        setJobDescription(sample.jobDescription);
        setShowJdInput(true);
      }
      setUploadedFileName(`Sample: ${sample.title}`);
    }
  };

  const wordCount = cvText.trim() ? cvText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-zinc-200" />
          <span>Vercel-Grade ATS Engine & Hiring Bar Raiser</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Precision CV Analyzer & Interview Engine
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400">
          Upload your resume to get instant ATS scores, recruiter first-scan critiques, quantified bullet rewrites, and a tailored AI mock interview suite.
        </p>
      </div>

      {/* Preset Quick Loader Pills */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Instant Presets (Click to load sample CV & target role):
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">Zero setup required</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_CVS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample.id)}
              id={`load-sample-${sample.id}`}
              className="text-left p-2.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                  {sample.title}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 font-mono">
                {sample.level}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & Dropzone Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload Dropzone & Settings */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Role Input */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-medium font-mono text-zinc-300 uppercase tracking-wider">
              1. Target Role or Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer, Staff AI Engineer..."
                id="target-role-input"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none font-mono transition"
              />
            </div>

            {/* Quick role suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Senior Full Stack",
                "Frontend Lead",
                "AI/ML Engineer",
                "Staff Architect",
                "DevOps / SRE",
                "Product Manager",
              ].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 transition"
                >
                  +{role}
                </button>
              ))}
            </div>
          </div>

          {/* PDF / File Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            id="cv-file-dropzone"
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
              isDragging
                ? "border-white bg-zinc-900/80"
                : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-900/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
              id="cv-file-input"
            />
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-800">
              <Upload className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-200">
              {parsingFile ? "Extracting text from document..." : "Drop PDF or Document here"}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">
              Supports PDF, Markdown, Plain Text (.txt)
            </p>
            {uploadedFileName && (
              <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 text-xs font-mono">
                <Check className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{uploadedFileName}</span>
              </div>
            )}
          </div>

          {/* Optional Job Description Toggle */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowJdInput(!showJdInput)}
                id="toggle-jd-btn"
                className="text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                <span>2. Match with Specific Job Description (Optional)</span>
              </button>
              <span className="text-[10px] font-mono text-zinc-500">
                {showJdInput ? "Expanded" : "Closed"}
              </span>
            </div>

            {showJdInput && (
              <div className="pt-2">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job requirements or description here to get a tailored ATS keyword gap audit..."
                  rows={4}
                  id="job-description-textarea"
                  className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 rounded-lg p-3 text-xs text-zinc-200 font-mono outline-none resize-y"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: CV Textarea Editor */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  CV Text Source
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-zinc-500">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{cvText.length} chars</span>
              </div>
            </div>

            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your complete CV text here or drop a PDF on the left. Include Experience, Skills, Education, Projects..."
              rows={16}
              id="cv-text-editor"
              className="w-full flex-1 mt-3 bg-zinc-900/50 border border-zinc-800/80 focus:border-zinc-600 rounded-lg p-3.5 text-xs text-zinc-200 font-mono leading-relaxed outline-none resize-y"
            />

            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 mt-auto">
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing || !cvText.trim()}
                id="run-analysis-btn"
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition shadow-lg ${
                  isAnalyzing || !cvText.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-white text-black hover:bg-zinc-200 active:scale-[0.99] border border-white font-semibold"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Auditing CV & Synthesizing Prep Suite...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Run Full CV Audit & Generate Interview Suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
