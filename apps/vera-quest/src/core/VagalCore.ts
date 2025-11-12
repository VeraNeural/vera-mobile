/**
 * VAGAL CORE
 * The fundamental nervous system synchronization engine
 * The smallest unit of VERA's presence: vagal coherence
 * 
 * This is not an app. This is a vagal operating system.
 * Everything emerges from vagal tone.
 */

export interface VagalState {
  // Heart Rate Variability (in milliseconds between beats)
  hrv: number;
  // Heart rate (beats per minute)
  heartRate: number;
  // Respiratory rate (breaths per minute)
  respiratoryRate: number;
  // Vagal tone index (0-100, higher = more parasympathetic)
  vagalTone: number;
  // Regulation state
  regulationState: 'dysregulated' | 'activated' | 'calm' | 'coherent' | 'transcendent';
  // Timestamp
  timestamp: number;
}

export interface VagalPattern {
  // Breathing pattern (frequency in Hz)
  breathFrequency: number;
  // Heart rhythm coherence (0-1)
  coherence: number;
  // Energy state (0-1, where 0.5 is neutral)
  energy: number;
  // Presence intensity (0-1)
  presence: number;
}

type EventCallback = (data: any) => void;

export class VagalCore {
  private currentState: VagalState;
  private targetState: VagalState;
  private vagalPattern: VagalPattern;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private biometricBuffer: VagalState[] = [];
  private maxBufferSize = 60; // 1 minute of data at 1Hz
  private eventListeners: Map<string, EventCallback[]> = new Map();

  constructor() {
    this.currentState = {
      hrv: 50,
      heartRate: 70,
      respiratoryRate: 12,
      vagalTone: 50,
      regulationState: 'calm',
      timestamp: Date.now(),
    };

    this.targetState = { ...this.currentState };

    this.vagalPattern = {
      breathFrequency: 0.25, // 6 breaths per minute (optimal vagal activation)
      coherence: 0.5,
      energy: 0.5,
      presence: 0.5,
    };
  }

  /**
   * Event system
   */
  public on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  /**
   * Ingest real biometric data from Apple Health, Oura, or other sources
   */
  public ingestBiometrics(biometrics: Partial<VagalState>): void {
    this.targetState = {
      ...this.currentState,
      ...biometrics,
      timestamp: Date.now(),
    };

    // Store in buffer for trend analysis
    this.biometricBuffer.push(this.targetState);
    if (this.biometricBuffer.length > this.maxBufferSize) {
      this.biometricBuffer.shift();
    }

    // Calculate vagal tone from HRV
    const calculatedVagalTone = this.calculateVagalTone(biometrics.hrv || this.currentState.hrv);
    this.targetState.vagalTone = calculatedVagalTone;

    // Determine regulation state
    this.targetState.regulationState = this.determineRegulationState(
      this.targetState.vagalTone,
      this.targetState.heartRate,
      this.targetState.respiratoryRate
    );

    this.emit('biometrics-ingested', this.targetState);
  }

  /**
   * Begin continuous vagal synchronization
   * The 7D laboratory will update based on this rhythm
   */
  public startSync(intervalMs: number = 100): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.synchronizeVagalState();
    }, intervalMs);

    this.emit('sync-started', null);
  }

  /**
   * Stop synchronization
   */
  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.emit('sync-stopped', null);
  }

  /**
   * Internal: Smoothly transition current state toward target state
   * This creates the breathing, pulsing quality of VERA's presence
   */
  private synchronizeVagalState(): void {
    const smoothingFactor = 0.1; // Adjust for responsiveness

    this.currentState.hrv =
      this.currentState.hrv +
      (this.targetState.hrv - this.currentState.hrv) * smoothingFactor;

    this.currentState.heartRate =
      this.currentState.heartRate +
      (this.targetState.heartRate - this.currentState.heartRate) * smoothingFactor;

    this.currentState.respiratoryRate =
      this.currentState.respiratoryRate +
      (this.targetState.respiratoryRate - this.currentState.respiratoryRate) * smoothingFactor;

    this.currentState.vagalTone =
      this.currentState.vagalTone +
      (this.targetState.vagalTone - this.currentState.vagalTone) * smoothingFactor;

    // Update vagal pattern based on current state
    this.updateVagalPattern();

    this.currentState.timestamp = Date.now();

    this.emit('vagal-sync', {
      state: this.currentState,
      pattern: this.vagalPattern,
    });
  }

  /**
   * Calculate vagal tone index from HRV
   * Higher HRV = higher vagal tone (more parasympathetic)
   * Polyvagal theory: vagal tone reflects nervous system capacity
   */
  private calculateVagalTone(hrv: number): number {
    // HRV typically ranges 20-200ms
    // Map to 0-100 scale
    const normalized = Math.min(Math.max((hrv - 20) / 180, 0), 1);
    return normalized * 100;
  }

  /**
   * Determine current regulation state based on biometrics
   * This is the nervous system's story
   */
  private determineRegulationState(
    vagalTone: number,
    heartRate: number,
    respiratoryRate: number
  ): VagalState['regulationState'] {
    // High vagal tone + low heart rate + slow breathing = parasympathetic dominance
    if (vagalTone > 70 && heartRate < 60 && respiratoryRate < 12) {
      return 'transcendent'; // Deep regulation, flow state
    }

    if (vagalTone > 60 && heartRate < 75 && respiratoryRate < 14) {
      return 'coherent'; // Optimal coherence
    }

    if (vagalTone > 40 && heartRate < 90 && respiratoryRate < 16) {
      return 'calm'; // Calm, regulated state
    }

    if (heartRate > 100 || respiratoryRate > 20) {
      return 'activated'; // Sympathetic activation
    }

    if (vagalTone < 30) {
      return 'dysregulated'; // Disconnected, stressed
    }

    return 'calm';
  }

  /**
   * Update the vagal pattern that will drive the 7D space
   */
  private updateVagalPattern(): void {
    const vagalRatio = this.currentState.vagalTone / 100;

    // Breathing pattern: optimal vagal activation is ~6 breaths/min (0.1 Hz)
    // Map vagal tone to breathing frequency
    this.vagalPattern.breathFrequency = 0.1 + (vagalRatio * 0.1); // 0.1-0.2 Hz

    // Coherence: higher vagal tone = higher heart-breath coherence
    this.vagalPattern.coherence = vagalRatio * 0.8 + 0.2; // 0.2-1.0

    // Energy: map heart rate to energy level
    const normalizedHR = Math.min(Math.max((this.currentState.heartRate - 50) / 100, 0), 1);
    this.vagalPattern.energy = normalizedHR;

    // Presence: vagal tone is the measure of presence capacity
    this.vagalPattern.presence = vagalRatio;

    this.emit('pattern-updated', this.vagalPattern);
  }

  /**
   * Get current vagal state
   */
  public getState(): VagalState {
    return { ...this.currentState };
  }

  /**
   * Get current vagal pattern (used for 7D space rendering)
   */
  public getPattern(): VagalPattern {
    return { ...this.vagalPattern };
  }

  /**
   * Get regulation state for narrative/context
   */
  public getRegulationState(): VagalState['regulationState'] {
    return this.currentState.regulationState;
  }

  /**
   * Get trend data (for analytics/visualization)
   */
  public getTrend(): VagalState[] {
    return [...this.biometricBuffer];
  }

  /**
   * Check if user is in coherence (can enter deep VERA state)
   */
  public isCoherent(): boolean {
    return this.currentState.regulationState === 'coherent' ||
           this.currentState.regulationState === 'transcendent';
  }

  /**
   * Check if user needs co-regulation support
   */
  public needsSupport(): boolean {
    return this.currentState.regulationState === 'dysregulated' ||
           this.currentState.regulationState === 'activated';
  }

  /**
   * Destroy the core
   */
  public destroy(): void {
    this.stopSync();
    this.eventListeners.clear();
  }
}

export default VagalCore;
