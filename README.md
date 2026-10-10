# Ascendra — Forge Your Skills. Unlock Your Future.

> An RPG-style career development world with interactive skill trees, AI quests, boss battles, and adaptive progression.

---

## 🚀 Deploying to GitHub Pages

Ascendra is pre-configured and 100% deployment-ready for **GitHub Pages**. 
Because GitHub Pages is a static host, Ascendra includes an intelligent **client-side engine** that operates fully in the browser with `localStorage` persistence, while still supporting full-stack development when run locally.

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

This repository includes a ready-to-use GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Push your repository to GitHub (e.g. `main` branch).
2. On GitHub, navigate to your repository **Settings**.
3. Under the **Code and automation** section in the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. That's it! Every time you push to `main`, GitHub Actions will automatically:
   - Install dependencies (`npm ci` / `npm install`)
   - Build the production bundle (`npm run build`)
   - Deploy your site to `https://<your-username>.github.io/<your-repo-name>/`

---

### Method 2: Manual Deploy / gh-pages Branch

If you prefer deploying via the `gh-pages` branch:

1. Install `gh-pages` as a dev dependency (optional):
   ```bash
   npm install --save-dev gh-pages
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder:
   ```bash
   npx gh-pages -d dist
   ```
4. In GitHub repository **Settings** > **Pages**, ensure the source is set to branch `gh-pages` and folder `/ (root)`.

---

## 🛠️ Local Development

To run the application locally with the Express server and live preview:

```bash
# Install dependencies
npm install

# Start local server with Vite middleware on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- `PORT`: Server port (default: `3000`)
- `GEMINI_API_KEY`: Optional Google Gemini API key for enhanced real-time AI mentoring and adaptive explanations. When running statically on GitHub Pages, built-in intelligent simulated personas and topological guidance provide immediate feedback without requiring an API key.

---

## 🌟 Key Features

- **Interactive 4-Tier Career World**: Visual dependency graph built with `@xyflow/react` and interactive skill nodes.
- **Adaptive Pruning & Replanning**: Mark already-known competencies to skip prerequisite chains and dynamically re-calculate downstream unlocks.
- **Quest Deliverables & Rubrics**: Submit project evidence (GitHub URLs, benchmark flamegraphs) evaluated against multi-criterion rubrics.
- **Boss Battle Capstone Arena**: Multi-phase boss trials with damage tracking, phase deliverables, and title rewards.
- **Mentor Connect**: Chat with industry staff engineers across foundation models, distributed systems, MLOps, robotics, and security.
- **Career Passport & Inventory**: Verified competencies, artifact credentials, and exportable JSON portfolio.
- **Zero-Server Client Fallback**: Seamless operation on static hosts like GitHub Pages with persistent `localStorage`.
