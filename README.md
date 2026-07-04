# The Crucible

An epistemology game where you propose explanations, defend them against an AI, and watch them survive or break. It is inspired by David Deutsch's book "The Beginning of Infinity" and its idea that good explanations are hard to vary and reach far beyond the thing they were invented to explain.

## 🎯 Overview

The Crucible hands you a real phenomenon, for example why stars twinkle while planets do not, or why hot water can sometimes freeze faster than cold. You write an explanation. An AI opponent, powered by Claude, then challenges it across several rounds, probing weak points and pushing you to refine. At the end your explanation is scored on how well it holds up.

## 🧠 How it plays

1. You are given a phenomenon with a prompt and some seed facts.
2. You propose an explanation.
3. Claude challenges it, round by round, surfacing naive traps and pressing on the reasoning.
4. You refine your explanation in response.
5. After the final round you receive a score.

Explanations are judged on three axes drawn from Deutsch's epistemology:

* **Reach**, how far the explanation extends beyond the original case
* **Falsifiability**, whether it makes claims that could be tested and shown wrong
* **Resilience**, how well it survives challenge

The result also includes a verdict, your best moment, and a growth edge to work on.

## ✨ Features

* A curated set of real world phenomena, each with seed facts, naive traps, and reach opportunities
* A multi round conversation with an AI challenger, streamed token by token for a live feel
* Structured scoring across reach, falsifiability, and resilience
* A clean, focused game interface built with the Next.js App Router

## 🛠️ Tech Stack

* **Framework**: Next.js 14 with the App Router and TypeScript
* **Styling**: Tailwind CSS, with the Geist font family
* **AI**: the Anthropic SDK, running Claude Sonnet server side
* **Streaming**: a Next.js API route that streams challenge and score events to the client

## 🚀 Getting Started

```bash
git clone https://github.com/panoskokmotos/Beginning-of-Infinity-game.git
cd Beginning-of-Infinity-game
npm install
```

Add your Anthropic API key to a local env file. The key is read server side only and is never exposed to the browser.

```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local
```

Then run the dev server and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## 📂 Project Structure

```
Beginning-of-Infinity-game/
├── src/
│   ├── app/
│   │   ├── page.tsx           Main game page
│   │   ├── layout.tsx         Root layout and metadata
│   │   └── api/challenge/     Server route that calls Claude and streams responses
│   ├── components/game/       Conversation thread, score panel, inputs, round indicator
│   ├── lib/
│   │   ├── phenomena.ts       The set of phenomena to explain
│   │   ├── prompts.ts         The AI challenger system prompt
│   │   ├── gameReducer.ts     Game state machine
│   │   └── streamParser.ts    Parser for the streamed events
│   └── types/game.ts          Game types, phases, and scoring shape
└── next.config.mjs            Next.js config
```

## 📄 License

Open source under the MIT License. See [LICENSE](LICENSE).

## 👤 Author

Panos Kokmotos, co-founder at Givelink.
Email: panos@givelink.app
Portfolio: [panoskokmotos.com](https://panoskokmotos.com)
