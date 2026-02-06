/**
 * Transcribe for USDC - Quote API (Vercel Edge Function)
 * Live demo: Returns USDC price quotes for transcription
 */

export const config = {
  runtime: 'edge',
};

const PRICING = {
  basic: 0.01,
  diarization: 0.015,
  timestamps: 0.012,
  premium: 0.02
};

const FEATURES = {
  basic: ['Transcription', '95% accuracy'],
  diarization: ['Transcription', 'Speaker identification', '95% accuracy'],
  timestamps: ['Transcription', 'Word-level timestamps', '95% accuracy'],
  premium: ['Transcription', 'Speaker ID', 'Timestamps', 'Summaries', '98% accuracy']
};

export default async function handler(request) {
  const url = new URL(request.url);
  const audioUrl = url.searchParams.get('url') || 'https://example.com/podcast.mp3';
  const tier = url.searchParams.get('tier') || 'basic';
  const durationMinutes = parseInt(url.searchParams.get('duration')) || 45;

  const rate = PRICING[tier] || PRICING.basic;
  const costUSDC = (durationMinutes * rate).toFixed(4);

  const quote = {
    service: 'Transcribe for USDC',
    version: '1.0.0',
    quote: {
      audioUrl,
      durationMinutes,
      tier,
      costUSDC,
      features: FEATURES[tier] || FEATURES.basic
    },
    payment: {
      chain: 'Solana Devnet',
      token: 'USDC',
      mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      recipient: 'AcBprug92tDd5mF5Fm8EryV3fSnxPBse7C61FPxujFPe'
    },
    pricing: PRICING,
    _meta: {
      timestamp: new Date().toISOString(),
      hackathon: 'USDC OpenClaw Hackathon 2026'
    }
  };

  return new Response(JSON.stringify(quote, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
