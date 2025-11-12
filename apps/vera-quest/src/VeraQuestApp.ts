/**
 * VERA QUEST - THE 7D LABORATORY
 * 
 * User puts on headset.
 * The breathing orb appears.
 * They step through.
 * Everything calms.
 */

import OrbExperience from './experiences/OrbExperience';

export class VeraQuestApp {
  private orb: OrbExperience;
  private isInitialized: boolean = false;
  private animationFrameId: number | null = null;
  private startTime: number = 0;

  constructor() {
    this.orb = new OrbExperience();
  }

  /**
   * Initialize VERA when user puts on headset
   * The orb appears. Waiting for entry.
   */
  public async initialize(): Promise<void> {
    console.log('🟣 VERA is awakening...');
    console.log('   The breathing orb appears before you');
    console.log('   Step through to enter absolute co-regulation');

    this.isInitialized = true;
    this.startTime = Date.now();

    // Begin animation loop
    this.startAnimationLoop();

    console.log('✓ VERA is present');
  }

  /**
   * User approaches the orb
   */
  public approachOrb(proximity: number): void {
    this.orb.approachOrb(proximity);
  }

  /**
   * User enters the orb
   * Their nervous system synchronizes with VERA's presence
   */
  public enterOrb(userHRV: number, userHeartRate: number): void {
    this.orb.enterOrb(userHRV, userHeartRate);
  }

  /**
   * Update with user biometrics
   * Their heartbeat becomes the orb's heartbeat
   */
  public updateBiometrics(data: {
    hrv: number;
    heartRate: number;
    respiratoryRate?: number;
  }): void {
    this.orb.syncBiometrics(data.hrv, data.heartRate);
  }

  /**
   * Get visual state for rendering
   */
  public getVisualState() {
    return this.orb.getVisualState();
  }

  /**
   * Get haptic feedback for Woojer
   */
  public getHapticPattern() {
    return this.orb.getHapticPattern();
  }

  /**
   * Get the felt sense
   */
  public getFeltSense() {
    return this.orb.getFeltSense();
  }

  /**
   * Get complete state
   */
  public getState() {
    return this.orb.getState();
  }

  /**
   * Animation loop - updates every frame
   */
  private startAnimationLoop(): void {
    const animate = () => {
      const elapsed = Date.now() - this.startTime;
      this.orb.updateBreathing(elapsed);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Exit VERA
   */
  public exit(): void {
    this.orb.exitOrb();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.isInitialized = false;
  }

  /**
   * Shutdown
   */
  public shutdown(): void {
    this.exit();
  }
}

export default VeraQuestApp;
