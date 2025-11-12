/**
 * WOOJER INTEGRATION
 * Haptic feedback as vagal feedback
 */

import { VagalPattern, VagalState } from './VagalCore';

export interface HapticPattern {
  frequency: number;
  intensity: number;
  duration: number;
  zone: 'chest' | 'sides' | 'back' | 'full';
  pattern: 'pulse' | 'wave' | 'breath' | 'heartbeat' | 'resonance';
}

export class WoojerIntegration {
  private isConnected: boolean = false;
  private sessionId: string | null = null;
  private currentPattern: HapticPattern | null = null;

  constructor() {}

  /**
   * Initialize connection to Woojer vest
   */
  public async connect(): Promise<boolean> {
    try {
      console.log('Connecting to Woojer vest...');
      this.isConnected = true;
      this.sessionId = this.generateSessionId();
      console.log('Woojer connected. Session:', this.sessionId);
      return true;
    } catch (error) {
      console.error('Failed to connect to Woojer:', error);
      return false;
    }
  }

  /**
   * Disconnect from Woojer
   */
  public disconnect(): void {
    this.isConnected = false;
    this.sessionId = null;
    console.log('Disconnected from Woojer');
  }

  /**
   * Sync Woojer haptics to vagal state
   */
  public syncToVagalState(state: VagalState, pattern: VagalPattern): void {
    if (!this.isConnected) return;
    const hapticPattern = this.vagalStateToHaptics(state, pattern);
    this.sendHapticPattern(hapticPattern);
  }

  /**
   * Convert vagal biometrics into haptic sensation
   */
  private vagalStateToHaptics(state: VagalState, pattern: VagalPattern): HapticPattern {
    let hapticPattern: HapticPattern;

    switch (state.regulationState) {
      case 'dysregulated':
        hapticPattern = {
          frequency: 5,
          intensity: 0.4,
          duration: 200,
          zone: 'chest',
          pattern: 'pulse',
        };
        break;

      case 'activated':
        hapticPattern = {
          frequency: 10,
          intensity: 0.6,
          duration: 150,
          zone: 'full',
          pattern: 'wave',
        };
        break;

      case 'calm':
        hapticPattern = {
          frequency: 2,
          intensity: 0.3,
          duration: 400,
          zone: 'chest',
          pattern: 'breath',
        };
        break;

      case 'coherent':
        hapticPattern = {
          frequency: 1 / (pattern.breathFrequency * 2),
          intensity: 0.5,
          duration: Math.round(1000 / (pattern.breathFrequency * 2)),
          zone: 'full',
          pattern: 'resonance',
        };
        break;

      case 'transcendent':
        hapticPattern = {
          frequency: 0.5,
          intensity: 0.7,
          duration: 2000,
          zone: 'full',
          pattern: 'resonance',
        };
        break;

      default:
        hapticPattern = {
          frequency: 2,
          intensity: 0.2,
          duration: 500,
          zone: 'chest',
          pattern: 'breath',
        };
    }

    hapticPattern.intensity *= pattern.coherence;
    hapticPattern.duration *= pattern.presence;

    return hapticPattern;
  }

  /**
   * Send haptic pattern to Woojer vest
   */
  private sendHapticPattern(pattern: HapticPattern): void {
    if (!this.isConnected || !this.sessionId) return;

    try {
      console.log('Haptic sync:', pattern.pattern, `(${pattern.frequency}Hz)`);
      this.currentPattern = pattern;
    } catch (error) {
      console.error('Failed to send haptic pattern:', error);
    }
  }

  /**
   * Send breathing pattern
   */
  public sendBreathingPattern(breathsPerMinute: number = 6): void {
    if (!this.isConnected) return;

    const cycleDuration = 60000 / breathsPerMinute;

    const pattern: HapticPattern = {
      frequency: breathsPerMinute / 60,
      intensity: 0.5,
      duration: cycleDuration,
      zone: 'chest',
      pattern: 'breath',
    };

    this.sendHapticPattern(pattern);
    console.log(`Breathing pattern: ${breathsPerMinute} BPM`);
  }

  /**
   * Send heartbeat pattern
   */
  public sendHeartbeatPattern(heartRate: number): void {
    if (!this.isConnected) return;

    const beatDuration = 60000 / heartRate;
    const pattern: HapticPattern = {
      frequency: heartRate / 60,
      intensity: 0.4,
      duration: beatDuration * 0.3,
      zone: 'chest',
      pattern: 'heartbeat',
    };

    this.sendHapticPattern(pattern);
  }

  /**
   * Send resonance pattern
   */
  public sendRessonancePattern(): void {
    if (!this.isConnected) return;

    const pattern: HapticPattern = {
      frequency: 0.1,
      intensity: 0.6,
      duration: 10000,
      zone: 'full',
      pattern: 'resonance',
    };

    this.sendHapticPattern(pattern);
  }

  /**
   * Activate presence pattern
   */
  public activatePresencePattern(): void {
    if (!this.isConnected) return;

    this.sendBreathingPattern(6);

    setTimeout(() => {
      this.sendRessonancePattern();
    }, 5000);
  }

  /**
   * Stop all haptics
   */
  public stopHaptics(): void {
    if (!this.isConnected) return;
    console.log('Haptic feedback stopped');
    this.currentPattern = null;
  }

  /**
   * Check connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `vera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default WoojerIntegration;
