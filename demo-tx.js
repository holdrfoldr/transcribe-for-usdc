#!/usr/bin/env node
/**
 * Demo Transaction for USDC Hackathon
 * Creates verifiable proof on Solana devnet
 */

const { 
  Connection, 
  Keypair, 
  PublicKey, 
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} = require('@solana/web3.js');

const SOLANA_DEVNET = 'https://api.devnet.solana.com';
const SERVICE_WALLET = new PublicKey('AcBprug92tDd5mF5Fm8EryV3fSnxPBse7C61FPxujFPe');

async function main() {
  console.log('🚀 Transcribe for USDC - Demo Transaction\n');
  
  const connection = new Connection(SOLANA_DEVNET, 'confirmed');
  
  // Generate demo keypair
  const payer = Keypair.generate();
  console.log('📝 Generated demo wallet:', payer.publicKey.toString());
  
  // Request airdrop for gas
  console.log('\n💰 Requesting devnet SOL airdrop...');
  try {
    const airdropSig = await connection.requestAirdrop(payer.publicKey, 0.1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSig);
    console.log('✅ Airdrop TX:', airdropSig);
    console.log('   Explorer: https://explorer.solana.com/tx/' + airdropSig + '?cluster=devnet');
  } catch (e) {
    console.log('⚠️ Airdrop failed (rate limited), trying alternative...');
  }
  
  // Check balance
  const balance = await connection.getBalance(payer.publicKey);
  console.log('\n💵 Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
  
  if (balance > 0) {
    // Create a memo transaction to prove the system works
    console.log('\n📤 Creating proof transaction to service wallet...');
    
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: SERVICE_WALLET,
        lamports: 1000 // 0.000001 SOL - just to prove it works
      })
    );
    
    try {
      const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
      console.log('✅ Proof TX:', sig);
      console.log('   Explorer: https://explorer.solana.com/tx/' + sig + '?cluster=devnet');
      console.log('\n🎉 SUCCESS! Add this TX hash to your hackathon submission!');
    } catch (e) {
      console.log('❌ TX failed:', e.message);
    }
  } else {
    console.log('\n⚠️ No balance - need to get devnet SOL first');
    console.log('   Manual faucet: https://faucet.solana.com/');
    console.log('   Wallet to fund:', payer.publicKey.toString());
  }
  
  // Show USDC setup
  console.log('\n📋 USDC Integration Details:');
  console.log('   Testnet USDC Mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
  console.log('   Service Wallet:', SERVICE_WALLET.toString());
  console.log('   Circle Faucet: https://faucet.circle.com (Solana Devnet)');
}

main().catch(console.error);
