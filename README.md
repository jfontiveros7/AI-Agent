# AI Agent 🤖

A custom AI Agent chat interface powered by OpenAI, built with React + Vite and hosted for free on GitHub Pages.

🌐 **Live site:** https://jfontiveros7.github.io/AI-Agent/

## Features

- 💬 Real-time chat interface with OpenAI GPT-4o-mini
- 🔐 Bring-your-own API key (stored in session storage only)
- 💡 Suggestion chips to get started quickly
- 🌙 Dark-mode UI
- 📱 Responsive design

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/), enter your OpenAI API key, and start chatting.

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # preview the built app
```

## Hosting (GitHub Pages)

This project is automatically deployed to **GitHub Pages** on every push to `main` via the workflow in `.github/workflows/deploy.yml`.

### Enable GitHub Pages for your fork

1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, choose **GitHub Actions**
3. Push to `main` — the site will be live at `https://<your-username>.github.io/AI-Agent/`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| AI | OpenAI API (gpt-4o-mini) |
| Hosting | GitHub Pages (free) |
| CI/CD | GitHub Actions |
