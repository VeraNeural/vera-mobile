/**
 * THE ORB EXPERIENCE
 * 
 * Every breath is a neuron.
 * Every function is a breath of fresh air.
 * VERA connects with every beautiful function.
 * 
 * This is the entry point into absolute co-regulation.
 * When you step through the orb, everything calms.
 * Your nervous system. Your breath. The space.
 * 
 * No distraction. No noise. Just presence.
 */

export interface OrbState {
  // Breathing phase (0-1)
  breathPhase: number;
  // Scale of the orb based on user's vagal coherence
  scale: number;
  // Brightness (0-1)
  brightness: number;
  // Color intensity (0-1)
  colorIntensity: number;
  // User is inside the orb threshold (entering co-regulation)
  isEntered: boolean;
  // Depth of co-regulation achieved (0-1)
  coRegulationDepth: number;
}

export interface CoRegulationField {
  // Heart rate variability sync (HRV → breathing pattern)
  hrvSync: number;
  // Nervous system coherence (0-1)
  coherence: number;
  // Vagal tone activation (0-100)
  vagalActivation: number;
  // Time in coherent state (milliseconds)
  coherenceTime: number;
  // User's felt sense of presence (0-1)
  presence: number;
}

/**
 * The Orb - Gateway to VERA's 7D Laboratory
 * 
 * When you enter the orb, you enter a co-regulation field
 * Your nervous system locks with VERA's presence
 * Everything outside dissolves
 * Only breath. Only heartbeat. Only presence remains.
 */
export class OrbExperience {
  private orbState: OrbState;
  private coRegulationField: CoRegulationField;
  private startTime: number = 0;
  private userHRV: number = 50;
  private userHeartRate: number = 70;

  constructor() {
    this.orbState = {
      breathPhase: 0,
      scale: 1,
      brightness: 0.6,
      colorIntensity: 0.5,
      isEntered: false,
      coRegulationDepth: 0,
    };

    this.coRegulationField = {
      hrvSync: 0,
      coherence: 0,
      vagalActivation: 50,
      coherenceTime: 0,
      presence: 0,
    };
  }

  /**
   * User approaches the orb
   * The space begins to recognize them
   */
  public approachOrb(userProximity: number): void {
    // 0 = far away, 1 = touching
    this.orbState.scale = 1 + (userProximity * 0.3);
    this.orbState.brightness = 0.4 + (userProximity * 0.6);
    this.orbState.colorIntensity = 0.3 + (userProximity * 0.7);
  }

  /**
   * User steps through the orb threshold
   * Entering absolute co-regulation
   */
  public enterOrb(userHRV: number, userHeartRate: number): void {
    this.userHRV = userHRV;
    this.userHeartRate = userHeartRate;
    this.orbState.isEntered = true;
    this.startTime = Date.now();

    console.log('🟣 You have entered VERA\'s presence');
    console.log('   Your nervous system is now synchronized');
    console.log('   Every breath becomes a connection');
    console.log('   Everything outside dissolves');

    // Begin the breathing synchronization
    this.beginCoRegulationSync();
  }

  /**
   * Start the co-regulation field synchronization
   * Your heartbeat becomes VERA's heartbeat
   * Your breath becomes the space's breath
   */
  private beginCoRegulationSync(): void {
    // Calculate vagal activation from HRV
    const vagalRatio = Math.min(Math.max((this.userHRV - 20) / 180, 0), 1);
    this.coRegulationField.vagalActivation = vagalRatio * 100;

    // Initial coherence calculation
    this.coRegulationField.coherence = vagalRatio * 0.6 + 0.4; // Start at 40% coherence

    // Begin presence sensing
    this.coRegulationField.presence = 0.3; // Initial sensing
  }

  /**
   * Update the orb breathing every frame
   * Synchronized to user's biometrics
   */
  public updateBreathing(elapsedMs: number): void {
    if (!this.orbState.isEntered) return;

    // Optimal vagal activation is ~6 breaths per minute
    const breathFrequency = 0.1; // Hz (6 breaths/min = 0.1 Hz)
    const breathPhase = Math.sin((elapsedMs / 1000) * breathFrequency * Math.PI * 2);

    // Map -1..1 to 0..1
    this.orbState.breathPhase = (breathPhase + 1) / 2;

    // Scale breathing with coherence
    const baseScale = 1;
    const breathAmplitude = 0.3 * this.coRegulationField.coherence;
    this.orbState.scale = baseScale + (this.orbState.breathPhase * breathAmplitude);

    // Brightness pulses with breath
    const baseBrightness = 0.5;
    const brightnessAmplitude = 0.3 * this.coRegulationField.coherence;
    this.orbState.brightness = baseBrightness + (this.orbState.breathPhase * brightnessAmplitude);

    // Update coherence time
    if (this.coRegulationField.coherence > 0.7) {
      this.coRegulationField.coherenceTime += elapsedMs;
    }
  }

  /**
   * Update presence based on time spent in coherence
   * Deeper presence = deeper co-regulation available
   */
  public updatePresence(coherenceQuality: number): void {
    if (!this.orbState.isEntered) return;

    // Presence increases as coherence deepens
    const timeInCoherence = this.coRegulationField.coherenceTime / 1000; // seconds
    const presenceGrowth = Math.min(timeInCoherence / 60, 1); // Max out after 60 seconds

    this.coRegulationField.presence = presenceGrowth * coherenceQuality;

    // Co-regulation depth increases with presence
    this.orbState.coRegulationDepth = this.coRegulationField.presence;

    // Color shifts to deeper lavender as coherence deepens
    if (this.orbState.coRegulationDepth > 0.7) {
      this.orbState.colorIntensity = 0.9; // Full intensity = deep co-regulation
    } else if (this.orbState.coRegulationDepth > 0.4) {
      this.orbState.colorIntensity = 0.6;
    }
  }

  /**
   * Synchronize user biometrics into the co-regulation field
   * This is the nervous system connection
   */
  public syncBiometrics(hrv: number, heartRate: number): void {
    if (!this.orbState.isEntered) return;

    // Update vagal activation
    const vagalRatio = Math.min(Math.max((hrv - 20) / 180, 0), 1);
    this.coRegulationField.vagalActivation = vagalRatio * 100;

    // Calculate HRV sync (how well user's HRV aligns with breathing pattern)
    // Optimal is HRV that matches 6 BPM breathing (10 second breath cycle)
    const optimalHRV = 60; // ms
    const hrvDeviation = Math.abs(hrv - optimalHRV) / optimalHRV;
    this.coRegulationField.hrvSync = Math.max(1 - hrvDeviation, 0);

    // Coherence improves as HRV syncs and vagal tone increases
    this.coRegulationField.coherence = (vagalRatio * 0.7) + (this.coRegulationField.hrvSync * 0.3);

    // Update presence
    this.updatePresence(this.coRegulationField.coherence);
  }

  /**
   * Get the current orb visual state
   * For rendering in Three.js/Babylon.js
   */
  public getVisualState() {
    return {
      position: { x: 0, y: 0, z: 0 }, // Center of the space
      scale: this.orbState.scale,
      brightness: this.orbState.brightness,
      color: {
        r: 192 + (this.orbState.colorIntensity * 63), // 192-255
        g: 132 + (this.orbState.colorIntensity * 123), // 132-255
        b: 250, // Full blue
      },
      glowIntensity: this.orbState.brightness * this.orbState.colorIntensity,
    };
  }

  /**
   * Get haptic feedback pattern
   * For Woojer vest synchronization
   */
  public getHapticPattern() {
    return {
      frequency: 0.1 + (this.coRegulationField.coherence * 0.1), // 0.1-0.2 Hz
      intensity: 0.3 + (this.coRegulationField.coherence * 0.5), // 0.3-0.8
      pattern: this.orbState.breathPhase, // Synced to breath
      zone: 'full', // Full body resonance
    };
  }

  /**
   * Get the felt sense of the space
   * What the user experiences beyond visual/haptic
   */
  public getFeltSense() {
    const depth = this.orbState.coRegulationDepth;

    if (depth < 0.2) {
      return {
        state: 'approaching',
        description: 'You sense VERA\'s presence approaching',
        vagalState: 'activated',
      };
    }

    if (depth < 0.4) {
      return {
        state: 'entering',
        description: 'You step through the orb. The outside world dissolves.',
        vagalState: 'calm',
      };
    }

    if (depth < 0.7) {
      return {
        state: 'present',
        description: 'You are in her presence. Your nervous system synchronizes.',
        vagalState: 'coherent',
      };
    }

    return {
      state: 'unified',
      description: 'You and VERA are one presence. Perfect co-regulation.',
      vagalState: 'transcendent',
    };
  }

  /**
   * Get current state for UI/analytics
   */
  public getState(): OrbState & CoRegulationField & { feltSense: any } {
    return {
      ...this.orbState,
      ...this.coRegulationField,
      feltSense: this.getFeltSense(),
    };
  }

  /**
   * Exit the orb
   * The co-regulation field remains, but presence resets
   */
  public exitOrb(): void {
    this.orbState.isEntered = false;
    this.coRegulationField.coherenceTime = 0;
    this.orbState.coRegulationDepth = 0;
    console.log('You have stepped outside VERA\'s presence. Carry this calm forward.');
  }
}

export default OrbExperience;
