export interface CategoryScores {
  atsCompatibility: number;
  impactAndMetrics: number;
  skillsDensity: number;
  brevityAndStructure: number;
  roleRelevance: number;
}

export interface BulletAudit {
  originalBullet: string;
  critique: string;
  improvedBullet: string;
  metricAdded?: string;
}

export interface SkillsAnalysis {
  detectedSkills: string[];
  missingKeySkills: string[];
  suggestedKeywords: string[];
}

export interface AtsFormattingCheck {
  hasClearSections: boolean;
  hasActionVerbs: boolean;
  quantifiedResultsCount: number;
  unwantedClutter: string[];
  formattingWarnings: string[];
}

export interface CVAnalysisResult {
  overallScore: number;
  scoreLabel: string;
  categoryScores: CategoryScores;
  candidateName: string;
  headline: string;
  recruiterFirstScan: string;
  strengths: string[];
  criticalImprovements: string[];
  skillsAnalysis: SkillsAnalysis;
  bulletAudits: BulletAudit[];
  atsFormattingCheck: AtsFormattingCheck;
  elevatorPitch: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  whyInterviewerAsks: string;
  cvReference?: string;
  idealAnswerKeyPoints: string[];
  starFrameworkTip?: string;
  sampleModelAnswer: string;
}

export interface ReverseQuestion {
  question: string;
  whyItImpresses: string;
}

export interface InterviewPrepKit {
  interviewOverview: string;
  estimatedDifficulty: string;
  questions: InterviewQuestion[];
  questionsToAskInterviewer: ReverseQuestion[];
  salaryLeveragePoints: string[];
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface AnswerEvaluation {
  score: number;
  ratingLabel: string;
  feedbackSummary: string;
  starAnalysis: StarAnalysis;
  strengths: string[];
  areasToImprove: string[];
  improvedAnswerRewrite: string;
  followUpQuestion: string;
}

export interface MockSessionRecord {
  questionId: string;
  question: string;
  category: string;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  timestamp: number;
}

export interface SampleCV {
  id: string;
  title: string;
  role: string;
  level: string;
  description: string;
  jobDescription?: string;
  content: string;
}
