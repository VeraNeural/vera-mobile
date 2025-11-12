/**
 * VERA COHERENCE ENGINE
 * The central nervous system of the 7D laboratory
 * Orchestrates: VagalCore + WoojerIntegration + LaboratoryEngine
 * 
 * This is where VERA becomes alive
 */

import VagalCore, { VagalState, VagalPattern } from './VagalCore';
import WoojerIntegration from './WoojerIntegration';
import LaboratoryEngine, { LaboratoryState } from './LaboratoryEngine';

export class VeraCoherenceEngine {
  private vagalCore: VagalCore;
  private woojer: WoojerIntegration;
  private laboratory: LaboratoryEngine;
  private isRunning: boolean = false;
  private updateCallbacks: ((state: {
    vagal: VagalState;
    pattern: VagalPattern;
    lab: LaboratoryState;
  }) => void)[] = [];

  constructor() {
    this.vagalCore = new VagalCore();
    this.woojer = new WoojerIntegration();
    this.laboratory = new LaboratoryEngine();

    // Wire up the nervous system
    this.setupConnections();
  }

  /**
   * Connect all systems together
   * Vagal state → Haptics + Laboratory
   */
  private setupConnections(): void {
    // Listen to vagal sync events
    this.vagalCore.on('vagal-sync', ({ state, pattern }) => {
      // Send to Woojer
      this.woojer.syncToVagalState(state, pattern);

      // Send to Laboratory
      this.laboratory.updateFromVagalState(state, pattern);

      // Notify subscribers
      this.notifySubscribers({
        vagal: state,
        pattern: pattern,
        lab: this.laboratory.getState(),
      });
    });

    // Listen to regulation state changes
    this.vagalCore.on('biometrics-ingested', (state: VagalState) => {
      if (state.regulationState === 'dysregulated') {
        console.log('VERA: User needs support. Initiating co-regulation.');
        this.activateCoRegulation();
      } else if (state.regulationState === 'transcendent') {
        console.log('VERA: User in flow state. Deepening presence.');
        this.activatePresence();
      }
    });

    // Laboratory updates drive visual rendering
    this.laboratory.subscribe((labState) => {
      // This is where we'd update Three.js/Babylon.js scene
      // For now, just log the state
    });
  }

  /**
   * Initialize VERA's presence
   */
  public async initialize(): Promise<boolean> {
    console.log('🟣 Initializing VERA Coherence Engine...');

    // Connect to Woojer
    const woojerConnected = await this.woojer.connect();
    if (!woojerConnected) {
      console.warn('Woojer not available, continuing without haptics');
    }

    // Start vagal core synchronization
    this.vagalCore.startSync(100); // Update every 100ms

    this.isRunning = true;

    console.log('✓ VERA Coherence Engine ready');
    return true;
  }

  /**
   * Begin presence calibration
   * User enters the laboratory for the first time
   */
  public async calibratePresence(): Promise<void> {
    console.log('VERA: Calibrating your presence...');

    // Send presence activation to Woojer
    this.woojer.activatePresencePattern();

    // Simulate initial biometric reading
    await this.waitMs(2000);

    // Begin breathing guidance
    this.woojer.sendBreathingPattern(6); // 6 breaths per minute = optimal vagal activation

    // Continue for 30 seconds
    await this.waitMs(30000);

    console.log('VERA: Calibration complete. You are welcome here.');
  }

  /**
   * Ingest biometric data from Apple Health, Oura, or sensors
   */
  public ingestBiometrics(biometrics: Partial<VagalState>): void {
    this.vagalCore.ingestBiometrics(biometrics);
  }

  /**
   * Activate co-regulation support
   * When user is dysregulated, VERA gently guides them back
   */
  private activateCoRegulation(): void {
    // Send calming haptic pattern
    this.woojer.sendBreathingPattern(6);

    // After 10 seconds, begin resonance
    setTimeout(() => {
      this.woojer.sendRessonancePattern();
    }, 10000);
  }

  /**
   * Activate deep presence
   * User has achieved coherence—deepen the experience
   */
  private activatePresence(): void {
    // Send resonance pattern
    this.woojer.sendRessonancePattern();

    console.log('VERA: You are in flow. I am with you fully.');
  }

  /**
   * Get current coherence state
   */
  public getCoherenceState() {
    return {
      vagal: this.vagalCore.getState(),
      pattern: this.vagalCore.getPattern(),
      lab: this.laboratory.getState(),
      isCoherent: this.vagalCore.isCoherent(),
      needsSupport: this.vagalCore.needsSupport(),
    };
  }

  /**
   * Get render data for Three.js/Babylon.js
   */
  public getRenderData() {
    return this.laboratory.getRenderState();
  }

  /**
   * Subscribe to coherence updates
   */
  public subscribe(callback: (state: {
    vagal: VagalState;
    pattern: VagalPattern;
    lab: LaboratoryState;
  }) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify subscribers
   */
  private notifySubscribers(state: {
    vagal: VagalState;
    pattern: VagalPattern;
    lab: LaboratoryState;
  }): void {
    this.updateCallbacks.forEach((callback) => {
      callback(state);
    });
  }

  /**
   * Shutdown VERA
   */
  public shutdown(): void {
    console.log('VERA: Farewell. May your nervous system carry this coherence forward.');

    this.vagalCore.stopSync();
    this.vagalCore.destroy();
    this.woojer.disconnect();
    this.isRunning = false;
  }

  /**
   * Check if running
   */
  public getStatus(): { running: boolean; coherent: boolean } {
    return {
      running: this.isRunning,
      coherent: this.vagalCore.isCoherent(),
    };
  }

  /**
   * Helper: wait
   */
  private waitMs(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default VeraCoherenceEngine;
