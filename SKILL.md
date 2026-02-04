---
name: transcribe-for-usdc
description: AI-powered transcription service that accepts USDC payments. Upload audio, pay in testnet USDC, receive high-quality transcript.
metadata:
  openclaw:
    emoji: "🎙️"
    homepage: "https://github.com/moxievoid/transcribe-for-usdc"
    os: ["darwin", "linux", "win32"]
    requires:
      env: ["DEEPGRAM_API_KEY"]
---

# Transcribe for USDC 🎙️💵

An OpenClaw skill that provides AI-powered audio transcription with USDC micropayments.

## What It Does

Agents can transcribe audio files and pay per minute in testnet USDC:

1. **Submit audio** - Provide audio file URL or path
2. **Get quote** - Skill calculates cost based on duration  
3. **Pay in USDC** - Testnet USDC payment via Solana
4. **Receive transcript** - High-quality transcript with timestamps

## Why USDC?

- **Predictable pricing** - Stable cost per minute
- **Instant settlement** - No waiting for payments to clear
- **Agent-native** - AI agents can autonomously pay for services
- **Micropayments** - Pay only for what you use (0.01 USDC/min)

## Commands

### `transcribe quote <audio_url>`
Get a price quote for transcription without paying.

```
> transcribe quote https://example.com/podcast.mp3

📊 Transcription Quote
Duration: 45 minutes
Cost: 0.45 USDC (testnet)
Quality: Nova-2 (speaker diarization included)
```

### `transcribe process <audio_url>`
Transcribe audio and pay in USDC.

```
> transcribe process https://example.com/podcast.mp3

🎙️ Processing transcription...
✅ Payment: 0.45 USDC sent to service wallet
✅ Transcript ready!

[00:00] Speaker 1: Welcome to the podcast...
[00:15] Speaker 2: Thanks for having me...
```

### `transcribe balance`
Check your USDC balance for transcription payments.

## Pricing

| Service | Cost (Testnet USDC) |
|---------|---------------------|
| Basic transcription | 0.01 USDC/min |
| With speaker diarization | 0.015 USDC/min |
| With timestamps | 0.012 USDC/min |
| Premium (all features) | 0.02 USDC/min |

## Technical Stack

- **Transcription**: Deepgram Nova-2 API
- **Payments**: Solana testnet USDC via SPL tokens
- **Speed**: 217x realtime (45min audio = ~12 seconds)

## Why This Matters

AI agents increasingly need to:
1. **Access services autonomously** - Can't wait for human approval
2. **Pay for resources** - Compute, APIs, data all cost money
3. **Settle instantly** - USDC enables real-time micropayments

This skill demonstrates the future of **agentic commerce** - where AI agents are economic participants that can pay for and provide services.

## Installation

```bash
clawhub install transcribe-for-usdc
```

## Configuration

Set your Deepgram API key:
```bash
export DEEPGRAM_API_KEY="your-key-here"
```

## Testnet Only

⚠️ This skill uses **Solana testnet USDC only**. Do not use mainnet funds.

---

Built for the USDC OpenClaw Hackathon 2026 🏆
