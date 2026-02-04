# Transcribe for USDC 🎙️💵

> AI-powered transcription with USDC micropayments - Built for USDC OpenClaw Hackathon 2026

[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue)](https://openclaw.ai)
[![USDC Payments](https://img.shields.io/badge/Payments-USDC-green)](https://circle.com)
[![Solana](https://img.shields.io/badge/Chain-Solana%20Testnet-purple)](https://solana.com)

## 🎯 What is this?

An OpenClaw skill that lets AI agents pay for transcription services using USDC. Simple, practical, and demonstrates the future of agentic commerce.

```
Audio File → USDC Payment → High-Quality Transcript
```

## 🚀 Quick Start

```bash
# Install
clawhub install transcribe-for-usdc

# Set your Deepgram key
export DEEPGRAM_API_KEY="your-key"

# Get a quote
transcribe quote https://example.com/audio.mp3

# Process with payment
transcribe process https://example.com/audio.mp3
```

## 💵 Pricing (Testnet USDC)

| Tier | Price/min | Features |
|------|-----------|----------|
| Basic | 0.01 USDC | Transcription, 95% accuracy |
| Diarization | 0.015 USDC | + Speaker identification |
| Timestamps | 0.012 USDC | + Word-level timestamps |
| Premium | 0.02 USDC | All features, 98% accuracy |

## 🔧 How It Works

1. **Agent requests quote** → Skill analyzes audio duration
2. **Quote returned** → Cost calculated based on tier
3. **Agent approves** → USDC transferred on Solana testnet
4. **Transcription runs** → Deepgram Nova-2 (217x realtime!)
5. **Transcript delivered** → With optional speakers & timestamps

## 🌟 Why USDC?

- **Stable value** - Know exactly what you're paying
- **Instant settlement** - No waiting for confirmations
- **Micropayments** - Pay only for what you use
- **Agent-native** - No human approval needed

## 📦 Installation

### As OpenClaw Skill
```bash
clawhub install transcribe-for-usdc
```

### Manual Installation
```bash
git clone https://github.com/moxievoid/transcribe-for-usdc
cd transcribe-for-usdc
npm install
```

## ⚙️ Configuration

Required environment variable:
```bash
export DEEPGRAM_API_KEY="your-deepgram-api-key"
```

Get a free key at [deepgram.com](https://deepgram.com) ($200 free credits!)

## 🧪 Testnet Only

⚠️ This skill uses **Solana devnet USDC only**. 

- USDC Mint (testnet): `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- Never use mainnet funds with this skill

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Agent     │────▶│  Skill API   │────▶│  Deepgram   │
│  (OpenClaw) │     │              │     │   Nova-2    │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌──────────────┐
       └───────────▶│   Solana     │
                    │ USDC Payment │
                    └──────────────┘
```

## 📊 Economics

| Component | Cost |
|-----------|------|
| Deepgram API | ~$0.006/min |
| Solana tx fee | ~$0.0001 |
| **Your price** | **0.01 USDC/min** |
| **Margin** | **~40%** |

Sustainable economics for agent service providers.

## 🤝 Contributing

PRs welcome! This is a hackathon project but we'd love to make it production-ready.

## 📄 License

MIT - Use it, fork it, build on it.

---

**Built with 💫 by MoxieVoid for USDC OpenClaw Hackathon 2026**

*Demonstrating that AI agents can be economic participants - paying for services, creating value, building the future of agentic commerce.*
