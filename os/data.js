/* AmartyaOS: all portfolio content lives here.
   Edit this file to update the site; no build step needed. */
window.PROFILE = {
  name: 'Amartya Sarangee',
  firstName: 'Amartya',
  headline: 'Co-Founder & Director, FocusTrigger Automation · Building FocusTag',
  role: 'Software Engineer · Backend, Applied AI & Agentic Systems',
  location: 'Bhubaneswar, Odisha, India',
  timezone: 'Asia/Kolkata',
  email: 'sarangeeamartya@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/amartya-sarangee-3351a8241',
    github: 'https://github.com/Amartya2005',
    instagram: 'https://www.instagram.com/_amartya.ffs/',
  },
  openTo: ['Software Engineering', 'Backend Engineering', 'AI/ML', 'Generative AI', 'Agentic AI'],
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
  links: [['FocusTag website', 'https://focustag-website.vercel.app']],
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
    id: 'agentarora',
    name: 'AgentArora',
    tag: 'Agentic AI · In progress',
    color: '#7c5cff',
    summary: 'An agentic AI and web-automation system that plans, grounds and executes tasks end to end.',
    stack: ['Python', 'LLMs', 'Web automation'],
    sections: [
      ['What it is', 'An agentic AI and web-automation project. It takes a goal and works through it on real web pages, from reading the page to completing the task.'],
      ['What I’m working on', 'Agent architecture, reasoning, element grounding (mapping intent to the right UI element), action planning, policy-controlled execution, and end-to-end task execution.'],
      ['Why policy control', 'An agent that can act on the web needs guardrails. Policies decide which actions are allowed before anything runs, so the system can be autonomous and still predictable.'],
    ],
    links: [['Source', 'https://github.com/Amartya2005/AgentArora']],
  },
  {
    id: 'ccms',
    name: 'Complaint & Case Management System',
    short: 'CCMS',
    tag: 'Team lead · Production',
    color: '#1fb36b',
    summary: 'ML-driven grievance routing and priority prediction, with layered security and full test coverage.',
    stack: ['React 19', 'FastAPI', 'SQLAlchemy', 'MySQL', 'Redis', 'WebSockets', 'scikit-learn', 'Docker', 'Nginx', 'Sentry'],
    facts: [['195', 'Pytest tests passing'], ['TF-IDF + LR', 'classifier with a rule-based fallback'], ['Sentry', 'production monitoring']],
    sections: [
      ['Architecture', 'FastAPI with SQLAlchemy behind Nginx, deployed with Docker and GitHub Actions. MySQL for persistence, Redis for sessions and rate limits. WebSockets push live status to role-scoped dashboards, so nothing polls. Alembic manages migrations.'],
      ['Machine learning', 'Complaints are classified by department and assigned a priority. I chose TF-IDF + Logistic Regression for low-latency, interpretable inference on modest hosting. When the model isn’t confident, a rule-based fallback assigns the label, so nothing goes unrouted. I also explored DistilBERT for classification and CatBoost for priority prediction.'],
      ['Security', 'JWT with role-based access control, account lockout and a password-reset flow. AES + RSA encryption of ticket contents, device fingerprinting, a honeypot for bots, and Redis-backed rate limiting.'],
      ['Tradeoff', 'TF-IDF over embeddings gives up some nuance in exchange for interpretability and near-instant inference. That suits a moderate, growing dataset.'],
    ],
    links: [
      ['Live site', 'https://ai-based-complaint-and-management-s.vercel.app'],
      ['Source', 'https://github.com/Amartya2005/AI-Based-Complaint-and-Management-System'],
    ],
  },
  {
    id: 'food',
    name: 'Real-time Food Ordering Platform',
    short: 'Food Ordering',
    tag: 'Solo',
    color: '#ffb000',
    summary: 'One API serving customers, restaurants and delivery partners, with live order updates.',
    stack: ['React', 'Node.js', 'Express', 'MySQL', 'Socket.IO', 'JWT'],
    facts: [['3 roles', 'RBAC enforced in middleware'], ['4 stages', 'explicit order state machine']],
    sections: [
      ['Architecture', 'An Express API over a normalized MySQL schema that keeps customers, restaurants and delivery separate. Socket.IO broadcasts order status to all three roles in real time.'],
      ['Order lifecycle', 'Each order moves through four explicit states: placed → confirmed → out for delivery → delivered. A free-text status field couldn’t enforce that order.'],
      ['Why these choices', 'A relational schema because the data has clear foreign keys (customer → order → items → restaurant). Socket.IO for automatic reconnection on flaky networks. JWT keeps auth stateless across three clients that share one API.'],
    ],
    links: [['Source', 'https://github.com/Amartya2005/Food-ordering-platform']],
  },
  {
    id: 'optify',
    name: 'Optify',
    tag: 'AI · Low bandwidth',
    color: '#00a3ff',
    summary: 'A university portal that stays under 50 KB per page, using AI summaries for students on slow connections.',
    stack: ['FastAPI', 'Preact', 'Gemini 1.5 Flash'],
    facts: [['< 50 KB', 'per page load']],
    sections: [
      ['Architecture', 'A thin FastAPI layer sits between the university portal and the student. It summarizes each page with Gemini 1.5 Flash before anything reaches the browser.'],
      ['The budget drove everything', 'With a hard limit of 50 KB per page load, the site sends summarized text instead of raw HTML and adds no framework overhead beyond Preact.'],
      ['Model choice', 'Gemini 1.5 Flash gives the best latency for its quality on short summaries. On slow connections, a larger model’s extra quality isn’t worth the slower round trip.'],
    ],
    links: [['Source', 'https://github.com/Amartya2005/OptifyV2']],
  },
  {
    id: 'sos',
    name: 'Women Safety SOS Platform',
    short: 'SOS Platform',
    tag: 'Safety',
    color: '#ff3b5c',
    summary: 'A one-tap SOS with live GPS tracking and a police response dashboard.',
    stack: ['React', 'FastAPI'],
    sections: [
      ['Architecture', 'One tap on the client broadcasts the user’s location to a FastAPI backend, which forwards it to a response dashboard used by monitoring staff.'],
      ['Critical path', 'The path from tap to delivered alert has as few steps and as little latency as possible, because every extra interaction costs time in an emergency.'],
    ],
    links: [['Source', 'https://github.com/Amartya2005/SoS---Women-Safety']],
  },
];

window.MORE_PROJECTS = [
  ['EPL 2026 Predictor', 'https://epl-2026-predictor.vercel.app'],
  ['AI Assistant', 'https://github.com/Amartya2005/AI-Assistant'],
  ['QuizJDBC (Java)', 'https://github.com/Amartya2005/QuizJDBC'],
];

window.EXPERIENCE = [
  {
    title: 'Co-Founder & Director',
    org: 'FocusTrigger Automation Pvt Ltd.',
    period: 'Oct 2026 – Present',
    place: 'Gunupur, Odisha',
    current: true,
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
  ['Languages', ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'Kotlin']],
  ['Backend', ['FastAPI', 'Flask', 'Node.js', 'Express.js', 'REST APIs', 'SQLAlchemy', 'JWT / RBAC', 'WebSockets', 'Socket.IO']],
  ['AI / ML', ['scikit-learn', 'Pandas', 'NumPy', 'DistilBERT', 'CatBoost', 'YOLOv8', 'LlamaIndex', 'FAISS', 'Gemini API', 'Cohere API', 'Agentic systems']],
  ['Frontend', ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'HTML5', 'CSS3']],
  ['Data', ['PostgreSQL', 'MySQL', 'Supabase', 'Redis', 'Excel', 'Tableau']],
  ['Infra & tooling', ['Docker', 'Docker Compose', 'GitHub Actions', 'Nginx', 'Pytest', 'Postman', 'Sentry', 'Linux', 'Vercel', 'Railway', 'Netlify', 'Hostinger']],
  ['Beyond code', ['Start-up leadership', 'System architecture', 'NFC / QR product engineering']],
];
