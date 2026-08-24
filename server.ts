import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const configuredOrigin = process.env.APP_ORIGIN?.replace(/\/$/, "");

if (isProduction && !process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be configured in production.");
}
if (isProduction && !configuredOrigin) {
  throw new Error("APP_ORIGIN must be configured in production.");
}

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);
}

app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "no-referrer" },
  ...(isProduction ? {} : { strictTransportSecurity: false }),
}));

// The API is intentionally same-origin. This blocks browser clients hosted on
// another origin from replaying a user's requests through this server.
app.use("/api", (req, res, next) => {
  const origin = req.get("origin");
  if (origin && configuredOrigin && origin !== configuredOrigin) {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }
  next();
});

app.use("/api", rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
}));

app.use(express.json({ limit: "2mb", strict: true }));

app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));

const MAX_PROMPT_FIELD_LENGTH = 100_000;
const isOversized = (...values: unknown[]) => values.some(
  (value) => typeof value === "string" && value.length > MAX_PROMPT_FIELD_LENGTH,
);

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment. Gemini features will fallback or return mock/error.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "cv-analyzer-server",
      },
    },
  });
};

// API: Analyze CV
app.post("/api/analyze-cv", async (req, res) => {
  try {
    const { cvText, targetRole, jobDescription } = req.body;

    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 20) {
      return res.status(400).json({ error: "Please provide a valid CV text (minimum 20 characters)." });
    }
    if (isOversized(cvText, targetRole, jobDescription)) {
      return res.status(413).json({ error: "One or more fields exceed the allowed length." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "AI service is temporarily unavailable." });
    }

    const prompt = `You are a Principal Technical Recruiter and ATS (Applicant Tracking System) Algorithm Auditor for top tier tech firms (Google, Vercel, Stripe, Meta).
Analyze this candidate's CV/Resume with deep technical rigor and actionable precision.

Candidate CV / Resume:
${cvText}

Target Role: ${targetRole || "General Senior Software Engineer / Tech Role"}
${jobDescription ? `Target Job Description:\n${jobDescription}` : "No specific job description provided; evaluate against market-leading standards for the role."}

Provide a comprehensive, high-detail JSON evaluation adhering strictly to the schema provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite executive tech recruiter and ATS parsing engine. Provide brutally honest, constructive, and highly quantified feedback in valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Overall rating 0-100" },
            scoreLabel: { type: Type.STRING, description: "e.g. Excellent / Strong / Competitive / Needs Work" },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                atsCompatibility: { type: Type.INTEGER, description: "0-100" },
                impactAndMetrics: { type: Type.INTEGER, description: "0-100" },
                skillsDensity: { type: Type.INTEGER, description: "0-100" },
                brevityAndStructure: { type: Type.INTEGER, description: "0-100" },
                roleRelevance: { type: Type.INTEGER, description: "0-100" },
              },
              required: ["atsCompatibility", "impactAndMetrics", "skillsDensity", "brevityAndStructure", "roleRelevance"],
            },
            candidateName: { type: Type.STRING, description: "Detected candidate name or Professional Candidate" },
            headline: { type: Type.STRING, description: "Professional title or 1-line identity" },
            recruiterFirstScan: {
              type: Type.STRING,
              description: "The 6-second recruiter impression: what stands out, what immediately feels missing or unclear.",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 key standout strengths",
            },
            criticalImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 high-priority fixes needed",
            },
            skillsAnalysis: {
              type: Type.OBJECT,
              properties: {
                detectedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingKeySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["detectedSkills", "missingKeySkills", "suggestedKeywords"],
            },
            bulletAudits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalBullet: { type: Type.STRING },
                  critique: { type: Type.STRING },
                  improvedBullet: { type: Type.STRING },
                  metricAdded: { type: Type.STRING },
                },
                required: ["originalBullet", "critique", "improvedBullet"],
              },
              description: "4-6 specific bullet points from the CV transformed from weak to high-impact",
            },
            atsFormattingCheck: {
              type: Type.OBJECT,
              properties: {
                hasClearSections: { type: Type.BOOLEAN },
                hasActionVerbs: { type: Type.BOOLEAN },
                quantifiedResultsCount: { type: Type.INTEGER },
                unwantedClutter: { type: Type.ARRAY, items: { type: Type.STRING } },
                formattingWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["hasClearSections", "hasActionVerbs", "quantifiedResultsCount", "unwantedClutter", "formattingWarnings"],
            },
            elevatorPitch: {
              type: Type.STRING,
              description: "A punchy 60-second 'Tell me about yourself' pitch crafted specifically from this CV.",
            },
          },
          required: [
            "overallScore",
            "scoreLabel",
            "categoryScores",
            "candidateName",
            "headline",
            "recruiterFirstScan",
            "strengths",
            "criticalImprovements",
            "skillsAnalysis",
            "bulletAudits",
            "atsFormattingCheck",
            "elevatorPitch",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini model.");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error in /api/analyze-cv:", err);
    return res.status(500).json({ error: "Unable to analyze the CV right now." });
  }
});

// API: Generate Tailored Interview Preparation Kit
app.post("/api/interview-prep", async (req, res) => {
  try {
    const { cvText, targetRole, jobDescription, focusArea } = req.body;

    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 20) {
      return res.status(400).json({ error: "Please provide CV text." });
    }
    if (isOversized(cvText, targetRole, jobDescription, focusArea)) {
      return res.status(413).json({ error: "One or more fields exceed the allowed length." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "AI service is temporarily unavailable." });
    }

    const prompt = `You are a Senior Engineering Hiring Manager / Interview Bar Raiser.
Generate a tailored, high-caliber interview preparation kit customized to this specific CV and target role.

Candidate CV:
${cvText}

Target Role: ${targetRole || "Senior Engineer / Tech Specialist"}
${jobDescription ? `Target Job Description:\n${jobDescription}` : ""}
${focusArea ? `Specific Focus Request: ${focusArea}` : ""}

Generate a set of realistic, probing questions across technical depth, past experience, system architecture, and behavioral STAR scenarios. Include probing follow-ups and model answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite hiring bar-raiser. Formulate intelligent, non-generic interview questions rooted in the candidate's actual projects and claims.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewOverview: { type: Type.STRING, description: "Strategy & persona summary for this interview." },
            estimatedDifficulty: { type: Type.STRING, description: "e.g. L5 / Senior / Staff / Mid-Level" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Resume Deep-Dive | Behavioral / STAR | Technical / System Design | Situational / Leadership" },
                  question: { type: Type.STRING },
                  whyInterviewerAsks: { type: Type.STRING },
                  cvReference: { type: Type.STRING, description: "Which project or claim from the CV sparked this question" },
                  idealAnswerKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  starFrameworkTip: { type: Type.STRING, description: "Advice on structuring Situation, Task, Action, Result" },
                  sampleModelAnswer: { type: Type.STRING, description: "A high-scoring benchmark answer" },
                },
                required: ["id", "category", "question", "whyInterviewerAsks", "idealAnswerKeyPoints", "sampleModelAnswer"],
              },
            },
            questionsToAskInterviewer: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  whyItImpresses: { type: Type.STRING },
                },
                required: ["question", "whyItImpresses"],
              },
              description: "High-IQ reverse questions the candidate should ask the hiring manager.",
            },
            salaryLeveragePoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key negotiation levers based on their unique achievements in the CV",
            },
          },
          required: ["interviewOverview", "estimatedDifficulty", "questions", "questionsToAskInterviewer", "salaryLeveragePoints"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error in /api/interview-prep:", err);
    return res.status(500).json({ error: "Unable to generate interview preparation right now." });
  }
});

// API: Evaluate User's Mock Interview Answer
app.post("/api/evaluate-answer", async (req, res) => {
  try {
    const { question, userAnswer, category, cvContext, targetRole } = req.body;

    if (!question || typeof question !== "string" || !userAnswer || typeof userAnswer !== "string" || userAnswer.trim().length < 5) {
      return res.status(400).json({ error: "Please provide both question and answer." });
    }
    if (isOversized(question, userAnswer, category, cvContext, targetRole)) {
      return res.status(413).json({ error: "One or more fields exceed the allowed length." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "AI service is temporarily unavailable." });
    }

    const prompt = `Evaluate the candidate's interview response objectively as a Principal Interviewer.

Target Role: ${targetRole || "Tech Professional"}
Category: ${category || "General"}
Interview Question: "${question}"
Candidate's CV Context (for reference):
${cvContext || "Not provided"}

Candidate's Answer:
"${userAnswer}"

Analyze the answer for:
1. STAR structure (Situation, Task, Action, Result)
2. Specificity and metrics vs hand-waving
3. Technical correctness and clarity
4. Delivery, confidence, and concise impact`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a demanding yet supportive hiring bar raiser. Evaluate the candidate's answer with specific score, detailed breakdown, and improved rewrite.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Rating 0-100" },
            ratingLabel: { type: Type.STRING, description: "Strong Hire / Hire / Leaning Hire / Leaning No Hire / No Hire" },
            feedbackSummary: { type: Type.STRING, description: "2-3 sentences concise executive feedback" },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING, description: "Assessment of Situation context" },
                task: { type: Type.STRING, description: "Assessment of Task definition" },
                action: { type: Type.STRING, description: "Assessment of personal ownership & action" },
                result: { type: Type.STRING, description: "Assessment of quantified result and impact" },
              },
              required: ["situation", "task", "action", "result"],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvedAnswerRewrite: { type: Type.STRING, description: "A polished, benchmark version of their answer keeping their core story" },
            followUpQuestion: { type: Type.STRING, description: "A natural follow-up question the interviewer would ask next" },
          },
          required: ["score", "ratingLabel", "feedbackSummary", "starAnalysis", "strengths", "areasToImprove", "improvedAnswerRewrite", "followUpQuestion"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error in /api/evaluate-answer:", err);
    return res.status(500).json({ error: "Unable to evaluate the answer right now." });
  }
});

// API: Bullet Point Optimizer
app.post("/api/optimize-bullet", async (req, res) => {
  try {
    const { bullet, targetRole } = req.body;
    if (!bullet || typeof bullet !== "string" || bullet.trim().length < 5) {
      return res.status(400).json({ error: "Please provide a bullet point to rewrite." });
    }
    if (isOversized(bullet, targetRole)) {
      return res.status(413).json({ error: "One or more fields exceed the allowed length." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "AI service is temporarily unavailable." });
    }

    const prompt = `Rewrite this resume bullet point into 3 distinct, high-impact styles for a ${targetRole || "Software Engineer"}:
Original Bullet: "${bullet}"

1. Metric & Impact Heavy (Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z])
2. Concise Executive / Leadership Style (High agency, team velocity, architecture)
3. Technical Depth & Modern Tooling Style (Precise stack, performance, scaling numbers)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            metricFocused: { type: Type.STRING },
            executiveFocused: { type: Type.STRING },
            technicalFocused: { type: Type.STRING },
            keyVerbsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["original", "metricFocused", "executiveFocused", "technicalFocused", "keyVerbsUsed"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Error in /api/optimize-bullet:", err);
    return res.status(500).json({ error: "Unable to optimize the bullet right now." });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`CV Analyzer server running on http://0.0.0.0:${PORT}`);
  });
  server.requestTimeout = 120_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
}

app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(400).json({ error: "Invalid request." });
});

startServer().catch((error) => {
  console.error("Server startup failed:", error instanceof Error ? error.message : "unknown error");
  process.exit(1);
});
