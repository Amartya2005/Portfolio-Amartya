/* AmartyaOS: all portfolio content lives here.
   Edit this file to update the site; no build step needed. */
window.PROFILE = {
  name: 'Amartya Sarangee',
  firstName: 'Amartya',
  headline: 'Software Engineer & FocusTrigger Co‑Founder + Director',
  focus: ['Backend', 'Applied AI', 'System Architecture'],
  role: 'Building FocusTag at FocusTrigger Automation',
  location: 'Bhubaneswar, Odisha, India',
  timezone: 'Asia/Kolkata',
  email: 'amartyasarangee@focustriggerautomation.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/amartya-sarangee-3351a8241',
    github: 'https://github.com/Amartya2005',
    instagram: 'https://www.instagram.com/_amartya.ffs/',
  },
  bio: [
    "I'm a third-year Computer Science student at GIET University, Co-Founder & Director at FocusTrigger Automation Pvt Ltd, and a software developer. I like building intelligent systems that solve real-world problems.",
    'I work across software engineering, system architecture, applied AI/ML, generative AI and agentic systems. I enjoy designing applications end to end and finding new approaches to automation.',
    'Most of all, I like turning technical ideas into reliable, production-ready software: making architectural decisions deliberately, weighing the tradeoffs, and building systems that hold up.',
  ],
  languages: [
    ['Odia', 'Native'],
    ['Hindi', 'Full professional'],
    ['English', 'Professional working'],
    ['Spanish', 'Elementary'],
  ],
};

window.COMPANY = {
  name: 'FocusTrigger Automation Pvt Ltd.',
  title: 'Co-Founder & Director',
  period: 'Oct 2026 – Present',
  place: 'Gunupur, Odisha',
  product: 'FocusTag',
  productLine: 'NFC- and QR-enabled interactions, built for focus.',
  productDesc:
    "FocusTag is the company's first proprietary product. It supports direct phone-to-phone NFC interaction, with a QR code as a fallback. Its first use is classroom focus: NFC checkpoints and mobile focus enforcement, managed from an admin dashboard.",
  myRole:
    'I lead the architecture and technical approach. I decide the engineering tradeoffs and make sure the product is scalable and built to industry standards.',
  clientWork:
    'Alongside FocusTag, we build custom software and technology services for organisations and startups, turning product ideas into working software.',
  approach:
    'We work in reviewable stages and keep a clear line between what exists today and what is planned.',
  stack: ['Kotlin (Android)', 'NFC', 'QR fallback', 'Next.js', 'TypeScript', 'Supabase'],
  links: [['focustriggerautomation.com', 'https://focustriggerautomation.com']],
};

window.PROJECTS = [
  {
    id: 'focustag',
    name: 'FocusTag',
    tag: 'Co-founder · Architecture lead',
    color: '#ff5a1f',
    summary: 'Phone-to-phone NFC with a QR fallback, for classroom focus enforcement.',
    stack: ['Kotlin', 'NFC', 'Next.js', 'TypeScript', 'Supabase'],
    opensCompany: true,
  },
  {
    id: 'ccms',
    name: 'Complaint & Case Management System',
    short: 'CCMS',
    tag: 'Team lead · Live',
    color: '#1fb36b',
    summary: 'Complaint intake, routing, escalation and analytics for colleges. Keyword classification feeds a priority engine, and a local LLM routes complaints to departments.',
    stack: ['FastAPI', 'SQLAlchemy', 'MySQL', 'Redis', 'APScheduler', 'React 19', 'Vite', 'Docker', 'Nginx', 'GitHub Actions', 'Ollama · Qwen 3.5 4B'],
    facts: [
      ['58', 'automated test cases; CI runs pytest against MySQL + Redis'],
      ['0–100', 'priority score from severity, impact and age, recalculated hourly'],
      ['10 / min', 'login rate limit (100 / min default, 20 / min for new complaints)'],
    ],
    sections: [
      ['Architecture', 'FastAPI with SQLAlchemy and MySQL, a React 19 + Vite frontend, and Alembic migrations. The production setup is Docker Compose: Nginx serves the SPA (gzip, security headers) and proxies the API to uvicorn (2 workers, non-root), with MySQL and Redis behind health checks. A JWT-authenticated WebSocket endpoint delivers notifications.'],
      ['Classification and priority (how it actually works)', 'A lightweight keyword-based classifier scans the title and description; confidence is the share of keyword matches for the winning category. The prediction is logged and drives a severity score. Priority = severity + impact (similar open complaints in 30 days) + aging, clamped to 0–100 and mapped to LOW, MEDIUM, HIGH or CRITICAL. An hourly job recalculates every open complaint and alerts staff and admins on CRITICAL. scikit-learn is in the dependencies for a future trained model, but it is not in the live path today.'],
      ['Local LLM department routing', 'If a student leaves the department blank, a local Qwen 3.5 4B model (via Ollama) picks from the departments registered in the database, so it cannot invent a destination. The complaint goes to the least-loaded active staff member there. A keyword fallback keeps routing working when the model is turned off.'],
      ['Security and reliability', 'JWT auth with role-based access for students, staff and admins, plus token revocation checks. slowapi rate limits (100 / min default, 10 / min login, 20 / min complaint creation). Startup fails on a weak secret key or wildcard CORS in production. Deleting a user with complaint history returns 409, so audit trails are kept.'],
      ['Smart allocation', 'Assignment weighs priority, staff rating and workload: CRITICAL complaints prefer staff rated 4.5 or higher, HIGH 3.5 or higher, MEDIUM 2.5 or higher.'],
    ],
    links: [
      ['Live site', 'https://ai-based-complaint-and-management-s.vercel.app'],
      ['Source', 'https://github.com/Amartya2005/AI-Based-Complaint-and-Management-System'],
    ],
  },
  {
    id: 'agentarora',
    name: 'AgentArora',
    tag: 'Smart India Hackathon 2026 · Team prototype',
    color: '#7c5cff',
    summary: 'A privacy-preserving browser agent: personal data on the page is detected and redacted locally before any reasoning model sees it.',
    stack: ['Python', 'JSON Schema', 'Chrome MV3', 'LLM adapter'],
    facts: [
      ['134', 'automated test cases'],
      ['5', 'frozen JSON contracts between perception, privacy, agent and execution'],
    ],
    sections: [
      ['How it works', 'Browser perception captures the page, a local privacy engine detects and redacts PII and replaces it with placeholders, and only the sanitized page state crosses into the agent. The agent returns a structured action plan that is schema-validated and checked by a deterministic risk policy; high-risk actions need user confirmation before execution.'],
      ['What is built', 'Frozen contracts, Chrome MV3 perception with opaque element IDs, local PII detection and redaction, independent privacy verification, action planning and validation, a risk policy, stale-element recovery and a local browser bridge.'],
      ['Status', 'A five-day hackathon prototype. Provider-specific LLM integration sits behind an adapter boundary and is not wired to a model yet.'],
    ],
  },
  {
    id: 'epl',
    name: 'EPL 2025-26 Analytics',
    tag: 'Applied ML · Live',
    color: '#00a3ff',
    summary: 'A 10-page Streamlit dashboard with leakage-free match-outcome models, a chronological Elo system, and honest model reporting.',
    stack: ['Python', 'pandas', 'scikit-learn', 'XGBoost', 'SHAP', 'Streamlit', 'Plotly', 'Pytest'],
    facts: [
      ['380', 'matches across 20 teams'],
      ['3', 'classifiers compared against a 44.8% home-win baseline'],
      ['12', 'pipeline tests, including leakage and Elo conservation'],
    ],
    sections: [
      ['Leakage-free features', 'Match statistics in the source data describe the same fixture, so features are shifted rolling averages of each team’s previous matches only. Tests check that no future information leaks in.'],
      ['Honest results', 'Logistic Regression 27.6%, Random Forest 44.8% and XGBoost 41.4% test accuracy, against a 44.8% baseline of always picking the home team. None of the models meaningfully beats the baseline, and the dashboard says so instead of inflating the numbers. XGBoost has the best macro-F1 (0.396).'],
      ['Elo system', 'A chronological Elo rating (K = 24) with home advantage and margin-of-victory weighting. Ratings start at 1500 and a test verifies they stay zero-sum across every update.'],
    ],
    links: [['Live site', 'https://epl-2026-predictor.vercel.app']],
  },
  {
    id: 'food',
    name: 'Real-time Food Ordering Platform',
    short: 'Food Ordering',
    tag: 'Solo',
    color: '#ffb000',
    summary: 'One API for customers, restaurant owners and admins, with live order status over Socket.IO.',
    stack: ['React', 'Node.js', 'Express', 'MySQL', 'Socket.IO', 'JWT', 'Jest', 'Supertest'],
    facts: [
      ['3 roles', 'customer, restaurant owner and admin, enforced in middleware'],
      ['4 states', 'Received → Preparing → Ready → Delivered'],
      ['27', 'API test cases (auth, orders, admin)'],
    ],
    sections: [
      ['Architecture', 'An Express API over MySQL, with roles and order states constrained in the schema. Socket.IO authenticates with the JWT from the handshake and pushes order updates to each role.'],
      ['Hardening', 'Helmet, CORS, express-rate-limit, bcrypt password hashing, request logging with Morgan, response compression, pagination defaults and centralized error handling.'],
      ['Order lifecycle', 'Orders move through four explicit states (Received → Preparing → Ready → Delivered), and payments are tracked separately as Pending, Paid or Failed.'],
    ],
  },
  {
    id: 'optify',
    name: 'Optify',
    tag: 'Hackathon MVP · AI',
    color: '#26c6da',
    summary: 'Fetches heavy web pages on the server and streams an AI-summarized text version to students on slow connections.',
    stack: ['FastAPI', 'HTTPX', 'BeautifulSoup', 'Gemini API', 'Preact', 'Vite', 'Tailwind CSS'],
    facts: [['3 models', 'fallback chain when the API rate-limits: Gemini 2.5 Flash-Lite → Gemini 1.5 Flash → Gemma 3']],
    sections: [
      ['Architecture', 'FastAPI fetches the page asynchronously with HTTPX, strips it with BeautifulSoup, and streams a summarized Markdown version to a Preact frontend, so text appears before generation finishes.'],
      ['Resilience', 'When one model is rate-limited (HTTP 429), the backend falls back to the next model in the chain, so a single quota doesn’t take the service down.'],
      ['For low-bandwidth users', 'Text-to-speech uses the browser’s built-in voice (no extra download), and recent results are cached in LocalStorage for data-free re-reading.'],
    ],
  },
  {
    id: 'sos',
    name: 'Women Safety SOS Platform',
    short: 'SOS Platform',
    tag: 'Concept · Safety',
    color: '#ff3b5c',
    summary: 'A one-tap SOS with live GPS tracking and a police response dashboard.',
    stack: ['React', 'FastAPI'],
    sections: [
      ['Idea', 'One tap broadcasts the user’s location to a FastAPI backend, which forwards it to a response dashboard for monitoring staff. The critical path is kept as short as possible, because every extra interaction costs time in an emergency.'],
    ],
  },
  {
    id: 'portfolio',
    name: 'This portfolio (AmartyaOS)',
    short: 'This portfolio',
    tag: 'Solo · Live',
    color: '#141414',
    summary: 'A 3D desk on desktop, a fast text page on phones, and a retro OS built from scratch, all generated from one content file.',
    stack: ['Three.js', 'TypeScript', 'Vanilla JS', 'Webpack', 'Vercel', 'Hostinger DNS'],
    facts: [
      ['100', 'Lighthouse SEO, accessibility and best practices (mobile)'],
      ['98 → 6 MB', 'site weight after removing and recompressing assets'],
      ['908 → 4 KB', 'JavaScript sent to phones (3D code is split out)'],
      ['11.2 → 2.6 s', 'time to the start screen on a 4 Mbps connection'],
    ],
    sections: [
      ['Architecture', 'Phones get a prerendered text page; desktops lazy-load the 3D scene, whose monitor runs AmartyaOS in an iframe. A build step turns os/data.js into crawlable HTML, schema.org data and a sitemap, so content lives in one place.'],
      ['Credits', 'The 3D desk is a modified fork of Henry Heffernan’s MIT-licensed project. AmartyaOS, the content pipeline and the optimizations are mine.'],
    ],
    links: [['Source', 'https://github.com/Amartya2005/Portfolio-Amartya']],
  },
];

window.MORE_PROJECTS = [];

window.EXPERIENCE = [
  {
    title: 'Co-Founder & Director',
    org: 'FocusTrigger Automation Pvt Ltd.',
    period: 'Oct 2026 – Present',
    place: 'Gunupur, Odisha',
    current: true,
    link: ['focustriggerautomation.com', 'https://focustriggerautomation.com'],
    points: [
      'Building FocusTag, the company’s first product: phone-to-phone NFC with a QR fallback.',
      'Lead the architecture and technical approach: own the tradeoffs and keep the product scalable and industry-standard.',
      'Deliver custom software for organisations and startups, in reviewable stages.',
    ],
  },
  {
    title: 'Development Intern (Full Stack)',
    org: 'Thiranex EduTech LLP',
    period: 'Jul 2026 – Aug 2026',
    points: [
      'Shipped full-stack features (React + FastAPI) across four production applications.',
      'Relational database design, JWT authentication and third-party API integrations, supporting parallel delivery across all four codebases.',
    ],
  },
  {
    title: 'Freelance Web Developer',
    org: 'CollectIQ Services',
    period: 'Mar 2026 – Apr 2026',
    place: 'Remote',
    points: [
      'Built and deployed collectiqservices.com end to end for a startup client.',
      'Owned the Hostinger hosting, a pre-launch security audit and the EmailJS form backend.',
      'Set up the client’s email infrastructure and added front-end code protections before handover.',
    ],
    link: ['collectiqservices.com', 'https://collectiqservices.com'],
  },
  {
    title: 'Data Specialist',
    org: 'Central Tool Room & Training Centre (CTTC), Bhubaneswar',
    period: 'Jun 2025 – Jul 2025',
    points: [
      'Cleaned and preprocessed datasets in Python and Excel.',
      'Built exploratory visualizations in Tableau for the analytics team’s internal reporting.',
    ],
  },
];

window.EDUCATION = [
  ['B.Tech, Computer Science', 'GIET University, Gunupur', 'Nov 2024 – Nov 2028'],
  ['Class 12', 'Doon International School', '2022 – 2024'],
  ['Class 10', 'St. Joseph’s Convent Higher Secondary School, Sambalpur', '2011 – 2021'],
];

window.COURSEWORK = ['Data Structures & Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'Theory of Computation', 'Cloud Computing', 'System Design'];

window.CERTIFICATES = [
  {
    title: 'Full Stack Development Internship',
    issuer: 'Thiranex',
    date: '04 Jul 2026 – 03 Aug 2026',
    id: 'THX-JUL0426-440',
    image: 'assets/certs/thiranex-full-stack-internship.webp',
    thumb: 'assets/certs/thiranex-full-stack-internship-thumb.webp',
  },
  {
    title: 'Getting Started with Artificial Intelligence',
    issuer: 'IBM SkillsBuild',
    date: 'Issued 08 Dec 2025',
    image: 'assets/certs/ibm-skillsbuild-ai.webp',
    thumb: 'assets/certs/ibm-skillsbuild-ai-thumb.webp',
    verify: 'https://www.credly.com/badges/38183edd-8618-4b56-a8c5-a003e53c7b53',
  },
];

window.SKILLS = [
  ['Core engineering', 'Used in shipped projects', ['Python', 'JavaScript / TypeScript', 'SQL', 'FastAPI', 'Node.js / Express', 'REST API design', 'SQLAlchemy', 'MySQL', 'Redis', 'JWT auth & RBAC', 'WebSockets / Socket.IO', 'React', 'System design']],
  ['Applied AI & ML', 'Applied in the projects above', ['Local LLMs (Ollama · Qwen)', 'Gemini API & model fallback', 'LLM agent design & guardrails', 'PII redaction for AI', 'scikit-learn', 'XGBoost', 'pandas', 'Leakage-free evaluation', 'Streamlit']],
  ['Infrastructure & tools', 'Used to build, test and ship', ['Docker & Compose', 'Nginx', 'GitHub Actions CI', 'Pytest', 'Jest & Supertest', 'Alembic', 'APScheduler', 'Rate limiting (slowapi)', 'Vercel', 'DNS (Hostinger)', 'Git', 'Linux']],
  ['Familiar technologies', 'Worked with, less depth', ['Java', 'C++', 'Kotlin', 'Flask', 'Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vite', 'Chrome extensions (MV3)', 'YOLOv8', 'LlamaIndex', 'FAISS', 'Cohere API', 'DistilBERT', 'CatBoost', 'Sentry', 'Tableau', 'Excel', 'Railway', 'Netlify']],
];
