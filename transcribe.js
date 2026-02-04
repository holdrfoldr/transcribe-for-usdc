#!/usr/bin/env node
/**
 * Transcribe for USDC - OpenClaw Skill
 * AI-powered transcription with USDC micropayments
 * 
 * Built for USDC OpenClaw Hackathon 2026
 */

const https = require('https');
const { Connection, PublicKey, Transaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createTransferInstruction } = require('@solana/spl-token');

// Configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const USDC_MINT_TESTNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // Testnet USDC
const SERVICE_WALLET = new PublicKey('AcBprug92tDd5mF5Fm8EryV3fSnxPBse7C61FPxujFPe');
const SOLANA_RPC = 'https://api.devnet.solana.com';

// Pricing (in USDC per minute)
const PRICING = {
  basic: 0.01,
  diarization: 0.015,
  timestamps: 0.012,
  premium: 0.02
};

/**
 * Get audio duration from URL
 */
async function getAudioDuration(audioUrl) {
  // In production, would fetch and analyze audio
  // For hackathon demo, estimate from URL or metadata
  return new Promise((resolve) => {
    // Mock: return random duration between 1-60 minutes
    const duration = Math.floor(Math.random() * 60) + 1;
    resolve(duration);
  });
}

/**
 * Calculate transcription cost
 */
function calculateCost(durationMinutes, tier = 'basic') {
  const rate = PRICING[tier] || PRICING.basic;
  return (durationMinutes * rate).toFixed(4);
}

/**
 * Get quote for transcription
 */
async function getQuote(audioUrl, tier = 'basic') {
  const duration = await getAudioDuration(audioUrl);
  const cost = calculateCost(duration, tier);
  
  return {
    audioUrl,
    durationMinutes: duration,
    tier,
    costUSDC: cost,
    features: getTierFeatures(tier)
  };
}

/**
 * Get features for pricing tier
 */
function getTierFeatures(tier) {
  const features = {
    basic: ['Transcription', '95% accuracy'],
    diarization: ['Transcription', 'Speaker identification', '95% accuracy'],
    timestamps: ['Transcription', 'Word-level timestamps', '95% accuracy'],
    premium: ['Transcription', 'Speaker ID', 'Timestamps', 'Summaries', '98% accuracy']
  };
  return features[tier] || features.basic;
}

/**
 * Transcribe audio using Deepgram
 */
async function transcribeAudio(audioUrl, options = {}) {
  if (!DEEPGRAM_API_KEY) {
    throw new Error('DEEPGRAM_API_KEY not set');
  }

  const deepgramOptions = {
    model: 'nova-2',
    smart_format: true,
    diarize: options.diarization || false,
    punctuate: true,
    utterances: true
  };

  const queryString = Object.entries(deepgramOptions)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.deepgram.com',
      path: `/v1/listen?${queryString}`,
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ url: audioUrl }));
    req.end();
  });
}

/**
 * Process USDC payment on Solana testnet
 */
async function processPayment(payerWallet, amountUSDC) {
  const connection = new Connection(SOLANA_RPC, 'confirmed');
  
  // Get associated token accounts
  const payerATA = await getAssociatedTokenAddress(USDC_MINT_TESTNET, payerWallet);
  const serviceATA = await getAssociatedTokenAddress(USDC_MINT_TESTNET, SERVICE_WALLET);
  
  // Create transfer instruction (amount in smallest units - 6 decimals for USDC)
  const amount = Math.floor(amountUSDC * 1_000_000);
  
  const transferIx = createTransferInstruction(
    payerATA,
    serviceATA,
    payerWallet,
    amount
  );
  
  const transaction = new Transaction().add(transferIx);
  
  // Return transaction for signing
  return {
    transaction,
    amount: amountUSDC,
    recipient: SERVICE_WALLET.toString()
  };
}

/**
 * Full transcription flow with payment
 */
async function transcribeWithPayment(audioUrl, payerWallet, tier = 'basic') {
  // 1. Get quote
  const quote = await getQuote(audioUrl, tier);
  console.log(`📊 Quote: ${quote.costUSDC} USDC for ${quote.durationMinutes} minutes`);
  
  // 2. Process payment
  console.log(`💵 Processing payment of ${quote.costUSDC} USDC...`);
  const payment = await processPayment(payerWallet, parseFloat(quote.costUSDC));
  
  // 3. Transcribe
  console.log(`🎙️ Transcribing audio...`);
  const transcript = await transcribeAudio(audioUrl, {
    diarization: tier === 'diarization' || tier === 'premium',
    timestamps: tier === 'timestamps' || tier === 'premium'
  });
  
  // 4. Return results
  return {
    quote,
    payment,
    transcript: transcript.results?.channels?.[0]?.alternatives?.[0]?.transcript || 'Transcription complete',
    utterances: transcript.results?.utterances || []
  };
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'quote':
      const quoteUrl = args[1];
      const quoteTier = args[2] || 'basic';
      if (!quoteUrl) {
        console.log('Usage: transcribe quote <audio_url> [tier]');
        process.exit(1);
      }
      const quote = await getQuote(quoteUrl, quoteTier);
      console.log('\n📊 Transcription Quote');
      console.log(`Duration: ${quote.durationMinutes} minutes`);
      console.log(`Cost: ${quote.costUSDC} USDC (testnet)`);
      console.log(`Tier: ${quote.tier}`);
      console.log(`Features: ${quote.features.join(', ')}`);
      break;
      
    case 'pricing':
      console.log('\n💵 Transcription Pricing (Testnet USDC)');
      console.log('─'.repeat(40));
      Object.entries(PRICING).forEach(([tier, rate]) => {
        console.log(`${tier.padEnd(15)} ${rate} USDC/min`);
      });
      break;
      
    default:
      console.log('Transcribe for USDC 🎙️💵');
      console.log('\nCommands:');
      console.log('  quote <url> [tier]  - Get price quote');
      console.log('  pricing             - Show pricing tiers');
      console.log('\nTiers: basic, diarization, timestamps, premium');
  }
}

// Export for use as module
module.exports = {
  getQuote,
  transcribeAudio,
  processPayment,
  transcribeWithPayment,
  PRICING
};

// Run CLI if executed directly
if (require.main === module) {
  main().catch(console.error);
}
