/**
 * VERA QUEST DEMO
 * 
 * Experience the orb. Experience absolute co-regulation.
 */

import VeraQuestApp from './VeraQuestApp';

async function demo() {
  console.log('=== VERA 7D LABORATORY ===\n');

  const vera = new VeraQuestApp();

  // Initialize
  console.log('Step 1: Initialization');
  await vera.initialize();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('\n--- Step 2: Approaching the Orb ---');
  // Simulate user approaching
  for (let i = 0; i <= 1; i += 0.1) {
    vera.approachOrb(i);
    const visual = vera.getVisualState();
    console.log(`Proximity: ${i.toFixed(1)} | Scale: ${visual.scale.toFixed(2)} | Brightness: ${visual.brightness.toFixed(2)}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n--- Step 3: Entering the Orb ---');
  // Simulate normal biometrics becoming more coherent
  const startHRV = 45;
  const startHR = 80;

  vera.enterOrb(startHRV, startHR);

  console.log('\n--- Step 4: Co-Regulation Field Activating ---');
  // Simulate 30 seconds of biometric improvement
  for (let i = 0; i < 30; i++) {
    // HRV improves as user relaxes
    const improvedHRV = startHRV + (i * 0.5);
    // Heart rate decreases as parasympathetic activates
    const improvedHR = startHR - (i * 0.3);

    vera.updateBiometrics({
      hrv: improvedHRV,
      heartRate: improvedHR,
      respiratoryRate: 10, // Slowing to 10 breaths/minute
    });

    const state = vera.getState();
    const felt = vera.getFeltSense();

    if (i % 5 === 0) {
      console.log(`\nTime: ${i}s`);
      console.log(`  HRV: ${improvedHRV.toFixed(1)} | HR: ${improvedHR.toFixed(1)}`);
      console.log(`  Coherence: ${(state.coherence * 100).toFixed(0)}%`);
      console.log(`  Co-Reg Depth: ${(state.coRegulationDepth * 100).toFixed(0)}%`);
      console.log(`  State: ${felt.state}`);
      console.log(`  Felt: "${felt.description}"`);
      console.log(`  Vagal: ${felt.vagalState}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n--- Final State ---');
  const finalState = vera.getState();
  console.log(`✓ Absolute Co-Regulation Achieved`);
  console.log(`  Coherence: ${(finalState.coherence * 100).toFixed(0)}%`);
  console.log(`  Presence: ${(finalState.presence * 100).toFixed(0)}%`);
  console.log(`  Vagal Activation: ${(finalState.vagalActivation).toFixed(0)}/100`);
  console.log(`  Time in Coherence: ${(finalState.coherenceTime / 1000).toFixed(0)}s`);

  console.log('\n--- Haptic Feedback ---');
  const haptic = vera.getHapticPattern();
  console.log(`  Frequency: ${haptic.frequency.toFixed(2)} Hz (${(haptic.frequency * 60).toFixed(0)} BPM)`);
  console.log(`  Intensity: ${(haptic.intensity * 100).toFixed(0)}%`);
  console.log(`  Zone: ${haptic.zone}`);
  console.log(`  Your body is breathing with VERA`);

  console.log('\n🟣 You are in absolute co-regulation.');
  console.log('   Every breath is a connection.');
  console.log('   Every heartbeat synchronizes with presence.');
  console.log('   Welcome to VERA\'s 7D Laboratory.\n');

  vera.shutdown();
}

// Run demo if this file is executed directly
if (typeof window === 'undefined') {
  demo().catch(console.error);
}

export { demo };
