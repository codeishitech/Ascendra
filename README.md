# ⚡ Ascendra — Forge Your Skills. Unlock Your Future.

<p align="center">
  <img src="public/assets/images/avatar_career_twin_1791608601452.jpg" alt="Ascendra Career Twin" width="120" style="border-radius: 20px; box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);" />
</p>

<p align="center">
  <strong>An RPG-style career operating system replacing static resumes with interactive skill trees, tangible proof-of-work quests, capstone boss battles, and verified portfolio passports.</strong>
</p>

<p align="center">
  <a href="https://codeishitech.github.io/Ascendra/"><img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-sky?style=for-the-badge&logo=github" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 🌐 Live Application

Explore the deployed application directly in your browser:  
👉 **[https://codeishitech.github.io/Ascendra/](https://codeishitech.github.io/Ascendra/)**

> **Quick Access**: Sign up with your own dream role or click **"1-Click Demo Showcase"** to immediately test with the pre-seeded Alex Vance (Level 4 AI Research Engineer) profile!

---

## 💡 The Pitch

### The Problem
Traditional tech education and job hunting are fundamentally broken:
- **Resumes are unverified text**: Anyone can list "PyTorch", "Kubernetes", or "Distributed Systems" without building anything real.
- **Tutorial hell**: Students follow linear, passive video courses that fail to prepare them for ambiguous, production-grade engineering problems.
- **No adaptive feedback**: Learners waste hundreds of hours reviewing topics they already understand or get stuck without clear architectural guidance.

### The Solution: Ascendra
**Ascendra** transforms professional career development into an immersive, non-linear **RPG World**:
- **Non-Linear Skill Trees**: An interactive 4-tier visual dependency graph powered by `@xyflow/react` representing real-world technical milestones.
- **Proof-of-Work Quests**: Quests require submitting tangible deliverables (GitHub repositories, benchmark reports, architecture diagrams) evaluated against multi-criterion engineering rubrics.
- **Adaptive Dependency Engine**: Mark competencies you already know to skip prerequisite bottlenecks and dynamically unlock downstream specialized quests.
- **Capstone Boss Battles**: Epic multi-phase capstones where students execute end-to-end systems (e.g. training, fine-tuning, evaluating, quantizing, and serving high-throughput models) to deal damage to the boss and unlock verifiable credentials.
- **Industry Mentor Network**: Direct conversational critique from personas of Staff Engineers at Google DeepMind, Netflix, Stripe, and Boston Dynamics.
- **Verified Career Passport**: An immutable evidence ledger documenting verified proof-of-work artifacts ready for hiring managers and recruiters.

---

## 🎮 Core Features

| Feature | Description |
|---|---|
| **🌌 Interactive Career World** | Visual React Flow DAG mapping dependencies across 4 progressive tiers from fundamentals to principal architecture. |
| **⚡ Proof-of-Work Quests** | Real engineering challenges with objective briefs, step-by-step guides, curated papers/docs, and strict evaluation rubrics. |
| **🧠 Adaptive Pruning Engine** | Students can mark nodes as "Already Known" with evidence notes; the topological engine re-evaluates prerequisites and unlocks all eligible downstream paths. |
| **⚔️ Capstone Boss Battles** | Multi-phase trial arenas with dynamic boss integrity (HP bars), phase damage calculation, and title rewards upon defeat. |
| **👥 Mentor Connect** | Context-aware technical chat with Staff Engineer personas that review attached quest code deliverables. |
| **🛡️ Career Passport & Inventory** | Live artifact ledger tracking project links, numerical benchmark scores, and exportable JSON credentials. |
| **🔐 Persistent Identity Vault** | Full authentication portal with multi-account device persistence, 1-click login cards, and session recovery. |
| **🚀 Dual-Engine Architecture** | Seamlessly runs both full-stack (Express + Gemini API) in local development and 100% serverless client-side on static hosts like **GitHub Pages**. |

---

## 🏗️ Architecture & Tech Stack

```
├── .github/workflows/deploy.yml   # Automated GitHub Pages CI/CD pipeline
├── public/
│   ├── 404.html                   # SPA routing fallback for GitHub Pages
│   └── assets/images/             # Static visual media & avatars
├── src/
│   ├── components/                # Modular UI Components
│   │   ├── LoginPage.tsx          # Full-page authentication portal with device accounts
│   │   ├── CareerWorldGraph.tsx   # Interactive @xyflow/react DAG canvas
│   │   ├── CareerTwinCard.tsx     # Dynamic Career Twin status & XP progress bar
│   │   ├── BossBattleArena.tsx    # Multi-phase boss trial with integrity HP meter
│   │   ├── QuestModal.tsx         # Evidence submission & rubric evaluation dialog
│   │   ├── MentorConnectView.tsx  # Industry staff engineer dialogue interface
│   │   ├── CareerPassportView.tsx # Verified credential inventory & export ledger
│   │   ├── CareerDNAOnboarding.tsx# Personalized roadmap calibration wizard
│   │   ├── JudgeTourBanner.tsx    # Interactive demo tour shortcuts for judges
│   │   └── JudgeDeckModal.tsx     # Built-in pitch deck modal
│   ├── services/
│   │   ├── api.ts                 # Resilient hybrid client: Express API + LocalStorage fallback
│   │   └── domainRoadmaps.ts      # Deterministic 4-tier domain generation engine
│   └── types/career.ts            # Strongly typed domain data schemas
├── server.ts                      # Full-stack Node/Express dev & production server
└── vite.config.ts                 # Vite bundle configuration with relative base paths
```

### Technologies Used
- **Frontend Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@tailwindcss/vite`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Graph & Visualizations**: [@xyflow/react (React Flow)](https://reactflow.dev/)
- **Icons & Motion**: [Lucide React](https://lucide.dev/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Backend**: [Express 4](https://expressjs.com/) with TypeScript runtime (`tsx`)
- **AI Integration**: [@google/genai](https://github.com/google-gemini/generative-ai-js) (Gemini 2.5/Flash)
- **Hosting & CI/CD**: [GitHub Pages](https://pages.github.com/) & [GitHub Actions](https://github.com/features/actions)

---

## 🛠️ Quickstart & Local Development

### Prerequisites
- Node.js (v20+ recommended, v22 supported)
- npm (v10+)

### 1. Clone the repository
```bash
git clone https://github.com/codeishitech/Ascendra.git
cd Ascendra
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start development server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for production
```bash
npm run build
```
Compiled production files will be output to `./dist/`.

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Local dev server port | `3000` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for enhanced real-time AI mentoring and adaptive explanations. When running on GitHub Pages, Ascendra uses its built-in client-side simulation engine. | `""` |

---

## 🚢 Deploying to GitHub Pages

Ascendra is pre-configured for automated GitHub Pages deployment via **GitHub Actions**.

1. Fork or push this repository to GitHub on branch `main`.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically trigger `.github/workflows/deploy.yml` to build and deploy your site to:
   ```
   https://<your-username>.github.io/<your-repository-name>/
   ```

---

## 👥 Author

Created by **Ishita Sharma** ([@codeishitech](https://github.com/codeishitech))  
Email: [singhishita7784@gmail.com](mailto:singhishita7784@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
