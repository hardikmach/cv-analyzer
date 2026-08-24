import { SampleCV } from "../types";

export const SAMPLE_CVS: SampleCV[] = [
  {
    id: "senior-fullstack",
    title: "Senior Full Stack & Cloud Engineer",
    role: "Senior Full Stack Engineer",
    level: "Senior / Staff (L5-L6)",
    description: "Distributed systems, React/Node/Go, Kubernetes, Postgres, high-scale microservices.",
    jobDescription: "We are seeking a Senior Full Stack Engineer to scale our core developer infrastructure platform. Requirements: 5+ years experience with Next.js, Node.js/Go, distributed caching (Redis), Kubernetes, CI/CD, and designing high-throughput REST/gRPC APIs. Strong record in latency optimization and mentoring.",
    content: `ALEXANDER VANCE
San Francisco, CA • alexander.vance.dev@gmail.com • github.com/avance • linkedin.com/in/alexandervance

SUMMARY
Senior Full Stack Engineer with 6+ years of experience building mission-critical distributed web architectures and developer tooling. Proven track record reducing API latency by 45% and leading cross-functional teams of 8 engineers.

EXPERIENCE

STAFF SOFTWARE ENGINEER | VORTEX CLOUD SYSTEMS | San Francisco, CA | 2022 – Present
• Architected and migrated monolithic legacy billing service to event-driven Go and Node.js microservices handling 14M daily requests with 99.99% uptime.
• Reduced p99 API response times from 420ms to 85ms across core checkout endpoints through Redis cluster caching and Postgres query index optimization.
• Spearheaded Next.js 14 and Tailwind design system adoption across 4 squads, cutting frontend feature delivery cycle time by 30%.
• Built automated CI/CD pipeline in GitHub Actions and ArgoCD on AWS EKS, reducing deployment failure rate from 12% to under 0.5%.
• Mentored 6 mid-level engineers, conducting 120+ code reviews and establishing unit/integration testing standards achieving 88% code coverage.

FULL STACK DEVELOPER | NEXA PLATFORMS | Austin, TX | 2019 – 2022
• Developed real-time collaborative workspace dashboard using React, TypeScript, WebSockets, and GraphQL, growing MAU from 80K to 450K.
• Implemented role-based access control (RBAC) and OAuth2/SAML single sign-on system compliant with SOC-2 Type II audits.
• Refactored legacy Redux state into React Query and server components, decreasing initial client bundle size by 38%.
• Collaborated with Product and Design teams to conduct bi-weekly user research sessions and A/B testing on onboarding flows, raising conversion by 18%.

EDUCATION & CERTIFICATIONS
• B.S. in Computer Science — University of Texas at Austin (2019)
• AWS Certified Solutions Architect – Professional (2023)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Go, Python, SQL, GraphQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Prisma, Drizzle
Infrastructure & Tools: AWS (ECS, Lambda, S3, RDS), Kubernetes, Docker, Redis, PostgreSQL, Kafka, Git, Jest`,
  },
  {
    id: "aiml-engineer",
    title: "AI / Machine Learning Engineer",
    role: "Senior AI / ML Engineer",
    level: "Senior (L5)",
    description: "LLM fine-tuning, RAG pipelines, PyTorch, Vector DBs, LangChain, Model Evaluation.",
    jobDescription: "Looking for an AI/ML Engineer to build next-generation enterprise generative AI features. Experience with PyTorch, LLM fine-tuning (LoRA/QLoRA), RAG architectures (Pinecone/Milvus), quantization, and model inference latency optimization.",
    content: `ELENA ROSTOVA
Seattle, WA • elena.rostova.ai@gmail.com • huggingface.co/erostova • linkedin.com/in/elenarostova

SUMMARY
Machine Learning Engineer specializing in Large Language Models, Retrieval-Augmented Generation (RAG), and efficient inference deployment. Built production AI systems serving 2M+ active users.

EXPERIENCE

SENIOR AI ENGINEER | SYNAPSE INTELLIGENCE | Seattle, WA | 2023 – Present
• Designed and shipped enterprise RAG pipeline utilizing Qdrant vector database, hybrid sparse-dense embeddings, and reranking, achieving 94.2% retrieval accuracy on technical documentation.
• Fine-tuned open-weights models (Llama 3 70B & Mistral) using LoRA and DPO for domain-specific coding assistance, outperforming baseline GPT-4 by 12% on internal benchmarks.
• Optimized multi-tenant inference throughput using vLLM, TensorRT-LLM, and INT4 quantization, reducing GPU hosting costs by $34,000/month.
• Developed automated evaluation framework with LLM-as-a-Judge and golden test datasets, shortening validation loops from 3 days to 40 minutes.

MACHINE LEARNING RESEARCHER | COGNITIVE DATA LABS | Boston, MA | 2020 – 2023
• Trained deep NLP sentiment and entity extraction models on PyTorch and Hugging Face Transformers for financial news analysis.
• Productionized ML pipelines using Ray, Kubeflow, and FastAPI with automated drift detection and data lineage tracking.
• Published 2 research papers at EMNLP workshops on efficient attention mechanisms and prompt optimization.

EDUCATION
• M.S. in Artificial Intelligence — Carnegie Mellon University
• B.S. in Computer Science & Applied Mathematics — University of Washington

TECHNICAL SKILLS
AI/ML: PyTorch, Hugging Face, vLLM, LangChain, LlamaIndex, LoRA/QLoRA, Triton Inference, DeepSpeed
Data & Vector: Pinecone, Qdrant, Milvus, Postgres (pgvector), Pandas, NumPy, Spark
Cloud & MLOps: AWS SageMaker, GCP Vertex AI, Docker, Kubernetes, Weights & Biases, MLflow`,
  },
  {
    id: "frontend-design-eng",
    title: "Staff Frontend & Design Systems Engineer",
    role: "Staff Frontend Engineer",
    level: "Staff (L6)",
    description: "Design systems, WebGL/Three.js, Web Vitals, Micro-frontends, Accessibility (a11y).",
    jobDescription: "Staff Frontend Engineer to lead our customer experience architecture. Deep mastery of React 19, TypeScript, micro-interactions, CSS architecture, web performance (INP/LCP), and accessibility standards (WCAG AAA).",
    content: `MAYA CHEN
New York, NY • maya.chen.ui@gmail.com • mayachen.design • github.com/mayachen

SUMMARY
Staff Frontend Engineer with 8+ years crafting high-performance user interfaces and foundational design systems. Passionate about sub-50ms interactions, WCAG AAA accessibility, and delightful animations.

EXPERIENCE

STAFF FRONTEND ENGINEER | LUMEN DIGITAL | New York, NY | 2021 – Present
• Created the core company Design System used across 14 web and mobile products, serving over 18M monthly users with 100% WCAG 2.1 AA compliance.
• Improved Core Web Vitals across company storefront: LCP decreased by 1.4s, CLS brought to 0.01, and INP improved from 280ms to 42ms.
• Designed and integrated custom WebGL and motion physics engine for interactive product visualizer, lifting checkout conversions by 24%.
• Authored comprehensive engineering guidelines and organized internal accessibility workshops for 70+ engineers and product designers.

LEAD UI DEVELOPER | AURA STUDIOS | Brooklyn, NY | 2017 – 2021
• Built responsive single-page web applications with React, TypeScript, Next.js, and Tailwind CSS for Fortune 500 brand activations.
• Converted legacy Sass codebase into zero-runtime atomic CSS utility structure, cutting production stylesheet payload by 62%.
• Mentored 8 junior and mid-level engineers in modern web standards, semantic HTML, and automated visual regression testing using Playwright.

SKILLS
Frontend: React, TypeScript, Next.js, Tailwind CSS, Motion/Framer, WebGL, Three.js, CSS Architecture, HTML5
Tooling & Testing: Vite, Turborepo, Jest, Playwright, Storybook, Figma-to-Code Tokens, Lighthouse
Methodologies: Design Systems, Web Performance Optimization, Responsive & Fluid Layouts, WCAG a11y`,
  },
  {
    id: "product-manager",
    title: "Senior Technical Product Manager",
    role: "Senior Product Manager",
    level: "Senior (L5-L6)",
    description: "B2B SaaS, developer platforms, product-led growth, telemetry, monetization.",
    jobDescription: "Senior PM for Developer Platforms. Lead roadmap, feature discovery, monetization metrics, and API developer experience. Strong background collaborating with engineering leads and executive stakeholders.",
    content: `MARCUS STERLING
San Francisco, CA • marcus.sterling.pm@gmail.com • linkedin.com/in/marcussterling

SUMMARY
Data-driven Senior Product Manager with 7+ years directing SaaS developer platforms and API monetization. Scaled ARR from $4M to $28M while maintaining 135% net revenue retention.

EXPERIENCE

SENIOR PRODUCT MANAGER | APEX CLOUD PLATFORMS | San Francisco, CA | 2021 – Present
• Led product strategy and execution for API Gateway and Developer Portal, driving developer signups from 25K to 160K in 18 months.
• Defined usage-based pricing and billing tiers that contributed $12M net new ARR with a 22% increase in average contract value.
• Collaborated with 4 distributed engineering squads (24 engineers) utilizing Scrum/Kanban to ship 18 major product releases on schedule.
• Implemented Amplitude and Mixpanel telemetry tracking, uncovering onboarding drop-off bottlenecks and improving time-to-first-API-call from 14 minutes to 90 seconds.

PRODUCT MANAGER | DATAFLOW SYSTEMS | San Jose, CA | 2018 – 2021
• Managed roadmap for real-time analytics dashboards and alerting workflows used by 500+ enterprise clients.
• Conducted 100+ customer discovery interviews with CTOs and Engineering VPs to prioritize top friction points.
• Partnered with Product Marketing to orchestrate multi-channel launch campaigns resulting in 4,500 qualified leads in Q1.

EDUCATION & CERTS
• B.S. in Industrial Engineering & Economics — UC Berkeley
• Certified Scrum Product Owner (CSPO)

CORE COMPETENCIES
Product Strategy, Roadmap Prioritization, PLG, API Ecosystems, User Discovery, A/B Testing, SQL, Mixpanel, Jira`,
  },
];
