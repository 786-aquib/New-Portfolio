// Content authority: Aquib-Mahmood-Resume.pdf, supplied by Aquib, October 2026.
// Outcomes are résumé-reported. Employer systems are illustrated, not reproduced.
export const profile = {
  name: 'Aquib Mahmood', email: 'aquibmahmood106@gmail.com', location: 'Gurugram, India',
  github: 'https://github.com/786-aquib', linkedin: 'https://www.linkedin.com/in/aquibmahmood/',
  resume: '/Aquib-Mahmood-Resume.pdf', roles: ['Full Stack Engineer', 'Local AI & Developer Tools', 'Thoughtful Product Engineering'],
};
export const categories = ['All', 'AI & Developer Tools', 'Product Engineering', 'Research Platforms'] as const;
export type Category = typeof categories[number];
export type WorkId = 'payu-codex' | 'payu-products' | 'easyslr';
export interface WorkItem {
  id: WorkId; title: string; subtitle: string; category: Exclude<Category, 'All'>; kind: string; year: string;
  summary: string; stack: string[]; metric: string; metricLabel: string;
  sections: { title: string; body: string }[]; outcomes: string[]; source?: string; demo?: string;
}
export const work: WorkItem[] = [
  {id:'payu-codex',title:'payu-codex',subtitle:'Less searching. More understanding.',category:'AI & Developer Tools',kind:'Employer work · PayU',year:'2025 — Present',
   summary:'A privacy-first MCP server that turns a 14-repository workspace into searchable, local context for coding agents.',
   stack:['Python','MCP','tree-sitter','LanceDB','Ollama','BM25'],metric:'~60%',metricLabel:'lower token consumption',
   sections:[
     {title:'The context',body:'Exploring a large codebase through repeated Read/find and grep loops consumed agent context before meaningful implementation could begin. The challenge was to deliver relevant context across PayU’s 14-repository workspace while keeping code local.'},
     {title:'My contribution',body:'Engineered payu-codex, a Python MCP stdio server, and registered it with Claude Code. Four tools — code search, symbol lookup, usage lookup and index status — support natural-language code discovery and focused symbol exploration.'},
     {title:'The approach',body:'tree-sitter AST chunking covers 12 languages and more than 36,000 chunks. Local 768-dimensional Ollama embeddings live in LanceDB; dense retrieval and BM25 are combined through reciprocal rank fusion. Watchdog-driven incremental reindexing uses SHA-256 deduplication.'},
   ],outcomes:['Approximately 60% lower Claude Code token consumption across the 14-repository workspace.','Sub-second semantic lookup over 36,000+ symbols using local Ollama inference.','Zero data egress: code indexing and retrieval stay local.']},
  {id:'payu-products',title:'Product systems at PayU',subtitle:'Small details. Real product outcomes.',category:'Product Engineering',kind:'Employer work · PayU',year:'2025 — Present',
   summary:'Merchant-facing experiences spanning AI-powered checkout branding, product discovery, subscriptions and revenue recovery.',
   stack:['React','TypeScript','Redux','single-spa','RTK Query','Playwright'],metric:'90%',metricLabel:'self-serve branding adoption',
   sections:[
     {title:'The context',body:'Merchant-facing payment products need clear interfaces over complex configuration, activation and recovery systems. The work spanned multiple production microfrontends rather than a standalone demo.'},
     {title:'My contribution',body:'Shipped AI-powered brand customization in React and TypeScript with a Toqan agent that extracts merchant logos and colors. Built the Explore Products discovery MFE using React, Redux and single-spa, integrating activation-service, care-panel ticketing and Clevertap analytics.'},
     {title:'Engineering the details',body:'Delivered Subscription Plans and Revenue Recovery configuration with RTK Query, exposing Smart, Custom and No-Retry policies. Integrated WhatsApp sharing into Payment Links through react-share and wa.me links. Built a Playwright suite with GitLab CI, a page-object model, an auth setup project and a co-change gate for untested surfaces.'},
   ],outcomes:['90% self-serve branded checkout adoption.','20% lift in existing-merchant product views and 3% lift in new-merchant onboarding.','Recovery policies adopted by two enterprise e-commerce merchants in production.','20% lift in pre-expiry conversion across the Payment Links surface.']},
  {id:'easyslr',title:'EasySLR',subtitle:'From scattered articles to structured evidence.',category:'Research Platforms',kind:'Personal project',year:'Selected project',
   summary:'A multi-tenant literature review workspace for article ingestion, structured screening and organization-scoped collaboration.',
   stack:['TypeScript','Next.js','tRPC','Prisma','PostgreSQL','NextAuth.js'],metric:'4',metricLabel:'structured screening states',
   demo:'https://article-review-workspace-s5tx.vercel.app/',source:'https://github.com/786-aquib/Article-Review-Workspace',
   sections:[
     {title:'The context',body:'Systematic literature reviews bring together article collections, screening decisions and reviewer notes. EasySLR gives that work a shared, structured home with organization-scoped project management and role-based access control.'},
     {title:'My contribution',body:'Built Article-Review-Workspace, a multi-tenant platform supporting PubMed-style article ingestion, reviewer notes and duplicate detection across uploads and existing datasets.'},
     {title:'The approach',body:'Defined four review states — PENDING, INCLUDE, EXCLUDE and MAYBE — to make screening decisions explicit. Implemented Excel import validation and audit-ready data pipelines on Next.js, tRPC, Prisma and PostgreSQL, with NextAuth.js authentication and Vercel + Neon deployment.'},
   ],outcomes:['Organization-scoped project management with role-based access control.','Structured screening, reviewer notes and duplicate detection.','Validated Excel ingestion and audit-ready data pipelines.']},
];
export const experience = [
  {company:'PayU',role:'Software Engineer — Full Stack',period:'Jun 2025 — Present',location:'Gurugram, Haryana',
   intro:'Building merchant experiences, production microfrontends and privacy-first tools for engineering teams.',
   points:['Engineered payu-codex for local semantic search across a 14-repository workspace, reducing Claude Code token consumption by approximately 60%.','Shipped AI-powered checkout branding, product discovery, subscription plans, revenue recovery and WhatsApp payment-link sharing.','Built Playwright E2E coverage with GitLab CI and a co-change gate for newly introduced surfaces.']},
  {company:'Jetapult',role:'Full Stack Developer Intern',period:'Feb 2025 — Apr 2025',location:'Remote',
   intro:'Working at the intersection of product interfaces and AI-powered automation.',
   points:['Built a Google Play review-reply system using the OpenAI API, rating-aware prompts and Cron automation, achieving 95%+ accuracy.','Refactored reusable components and state management, reducing code duplication by 30% and improving UI responsiveness.']},
];
export const skills: Record<string,string[]> = {
  Languages:['TypeScript','JavaScript','Python','C++'],
  Frontend:['React','Redux','single-spa','Tailwind'],
  Backend:['FastAPI','REST APIs','PostgreSQL'],
  'AI & LLM':['LLM Agents','Pydantic AI','Gemini','Prompt engineering','MCP','RAG','LanceDB','Ollama'],
  'Infra & Testing':['AWS','Playwright','GitLab CI/CD','Docker','Jenkins'],
};
export const achievements = [
  {rank:'75',label:'Global rank',name:'TCS CodeVita ’23',detail:'Round 1'},
  {rank:'608',label:'Global rank',name:'TECHGIG ’23',detail:'Final'},
  {rank:'40',label:'Rank · 18k+ participants',name:'CodeChef Starters 77',detail:'4★ on CodeChef',url:'https://www.codechef.com/users/aquibmahmood10'},
  {rank:'1700+',label:'Rating',name:'LeetCode',detail:'Problem solving',url:'https://leetcode.com/u/AQUIB_MD786/'},
];
export const constellationThemes = [
  {id:'local',name:'Local AI',work:'payu-codex' as WorkId,nodes:['Code','Context','Answer'],captions:['Parse structure across 12 languages with tree-sitter.','Retrieve relevant context with local embeddings and hybrid search.','Give coding agents focused context, with zero data egress.'],code:['AST.parse(repo)','retrieve(context)','agent.answer()']},
  {id:'product',name:'Product Systems',work:'payu-products' as WorkId,nodes:['Interface','Services','Outcome'],captions:['Build merchant-facing experiences in React and TypeScript.','Connect activation, subscription and revenue recovery services.','Translate careful product engineering into measurable adoption.'],code:['<MerchantUI />','service.connect()','ship(outcome)']},
  {id:'research',name:'Research Tools',work:'easyslr' as WorkId,nodes:['Articles','Screening','Evidence'],captions:['Bring articles into organization-scoped projects.','Make review decisions explicit with four screening states.','Keep reviewer notes and audit-ready data pipelines together.'],code:['articles.import()','review.decide()','evidence.retain()']},
];
