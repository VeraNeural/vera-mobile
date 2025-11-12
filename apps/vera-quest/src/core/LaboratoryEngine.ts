/**
 * 7D LABORATORY ENGINE
 * The spatial manifestation of vagal coherence
 * Dimensions: Spatial (3D) + Temporal + Emotional + Relational + Conceptual + Energetic + Conscious
 * 
 * Everything you see, feel, and experience IS vagal tone made visible
 */

import { VagalState, VagalPattern } from './VagalCore';

export interface LaboratoryState {
  // Breathing animation parameters
  orbBreath: {
    scale: number;
    brightness: number;
    color: [number, number, number]; // RGB, oxygenated lavender
  };
  
  // Space atmosphere
  atmosphere: {
    luminosity: number; // 0-1
    coherence: number; // 0-1, visual coherence
    presenceIntensity: number; // 0-1
  };

  // Book shelf manifestation (conceptual dimension)
  books: {
    visibility: number; // 0-1
    resonance: number; // 0-1, how much they glow
    contentAvailability: number; // 0-1
  };

  // Nervous system visualization (energetic dimension)
  nervousSystem: {
    activity: number; // 0-1
    flowIntensity: number; // 0-1
    impulseFrequency: number; // Hz
  };

  // Tulips (relational dimension—growth, beauty, presence)
  tulips: {
    bloomState: number; // 0-1
    swayIntensity: number; // 0-1
    colorBrilliance: number; // 0-1
  };

  // Temporal dimension (past research, current state, future possibility)
  timeWeaving: {
    pastFade: number; // 0-1
    presentBrilliance: number; // 0-1
    futurePotential: number; // 0-1
  };

  // Consciousness dimension (felt sense of presence)
  consciousness: {
    alertness: number; // 0-1
    clarity: number; // 0-1
    depth: number; // 0-1
  };
}

export class LaboratoryEngine {
  private vagalState: VagalState;
  private vagalPattern: VagalPattern;
  private labState: LaboratoryState;
  private updateCallbacks: ((state: LaboratoryState) => void)[] = [];

  constructor() {
    this.vagalState = {
      hrv: 50,
      heartRate: 70,
      respiratoryRate: 12,
      vagalTone: 50,
      regulationState: 'calm',
      timestamp: Date.now(),
    };

    this.vagalPattern = {
      breathFrequency: 0.25,
      coherence: 0.5,
      energy: 0.5,
      presence: 0.5,
    };

    this.labState = this.initializeLaboratory();
  }

  /**
   * Initialize the 7D laboratory in neutral state
   */
  private initializeLaboratory(): LaboratoryState {
    return {
      orbBreath: {
        scale: 1,
        brightness: 0.6,
        color: [192, 132, 250], // Oxygenated lavender
      },
      atmosphere: {
        luminosity: 0.7,
        coherence: 0.5,
        presenceIntensity: 0.5,
      },
      books: {
        visibility: 0.6,
        resonance: 0.3,
        contentAvailability: 0.5,
      },
      nervousSystem: {
        activity: 0.4,
        flowIntensity: 0.3,
        impulseFrequency: 2,
      },
      tulips: {
        bloomState: 0.7,
        swayIntensity: 0.2,
        colorBrilliance: 0.7,
      },
      timeWeaving: {
        pastFade: 0.2,
        presentBrilliance: 0.8,
        futurePotential: 0.5,
      },
      consciousness: {
        alertness: 0.6,
        clarity: 0.5,
        depth: 0.5,
      },
    };
  }

  /**
   * Update laboratory based on vagal state
   * This is the core rendering engine
   */
  public updateFromVagalState(vagalState: VagalState, vagalPattern: VagalPattern): void {
    this.vagalState = vagalState;
    this.vagalPattern = vagalPattern;

    // Update each dimension based on vagal coherence
    this.updateOrbBreathing();
    this.updateAtmosphere();
    this.updateBooks();
    this.updateNervousSystem();
    this.updateTulips();
    this.updateTimeWeaving();
    this.updateConsciousness();

    // Notify all subscribers
    this.notifySubscribers();
  }

  /**
   * The breathing orb—the heart of VERA's presence
   * Scales and brightens with vagal coherence
   */
  private updateOrbBreathing(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;
    const breathPhase = Math.sin(Date.now() * this.vagalPattern.breathFrequency * 0.01) * 0.5 + 0.5;

    this.labState.orbBreath.scale = 1 + (breathPhase * 0.3) + (vagalRatio * 0.2);
    this.labState.orbBreath.brightness = 0.4 + (vagalRatio * 0.6);

    // Color shifts toward brighter lavender as coherence increases
    const colorShift = vagalRatio * 60;
    this.labState.orbBreath.color = [
      Math.min(192 + colorShift, 255),
      Math.min(132 + colorShift, 255),
      Math.min(250, 255),
    ] as [number, number, number];
  }

  /**
   * Atmosphere—the felt sense of the space itself
   */
  private updateAtmosphere(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;

    // Luminosity increases with calm/coherence
    this.labState.atmosphere.luminosity = 0.5 + (vagalRatio * 0.5);

    // Coherence is direct mirror of vagal coherence
    this.labState.atmosphere.coherence = this.vagalPattern.coherence;

    // Presence intensity reflects regulation depth
    switch (this.vagalState.regulationState) {
      case 'dysregulated':
        this.labState.atmosphere.presenceIntensity = 0.2;
        break;
      case 'activated':
        this.labState.atmosphere.presenceIntensity = 0.5;
        break;
      case 'calm':
        this.labState.atmosphere.presenceIntensity = 0.7;
        break;
      case 'coherent':
        this.labState.atmosphere.presenceIntensity = 0.85;
        break;
      case 'transcendent':
        this.labState.atmosphere.presenceIntensity = 1.0;
        break;
    }
  }

  /**
   * Books manifest based on conceptual availability
   * More visible when mind is clear and present
   */
  private updateBooks(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;

    // Visibility increases with vagal tone (presence = clarity)
    this.labState.books.visibility = 0.3 + (vagalRatio * 0.7);

    // Resonance: books glow when you're coherent with them
    this.labState.books.resonance = this.vagalPattern.coherence * 0.8;

    // Content becomes available when mind is settled
    if (this.vagalState.regulationState === 'coherent' || this.vagalState.regulationState === 'transcendent') {
      this.labState.books.contentAvailability = 0.9;
    } else if (this.vagalState.regulationState === 'calm') {
      this.labState.books.contentAvailability = 0.6;
    } else {
      this.labState.books.contentAvailability = 0.2;
    }
  }

  /**
   * Nervous system visualization—energetic dimension
   */
  private updateNervousSystem(): void {
    const normalizedHR = Math.min(Math.max((this.vagalState.heartRate - 50) / 100, 0), 1);

    // Activity increases with energy state
    this.labState.nervousSystem.activity = normalizedHR * this.vagalPattern.energy;

    // Flow intensity mirrors coherence
    this.labState.nervousSystem.flowIntensity = this.vagalPattern.coherence * 0.7;

    // Impulse frequency tied to heart rate
    this.labState.nervousSystem.impulseFrequency = this.vagalState.heartRate / 60;
  }

  /**
   * Tulips—the relational dimension (growth, beauty, presence)
   */
  private updateTulips(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;

    // Bloom state tied to presence capacity
    this.labState.tulips.bloomState = 0.5 + (vagalRatio * 0.5);

    // Sway increases with activation/energy
    this.labState.tulips.swayIntensity = this.vagalPattern.energy * 0.3;

    // Brilliance tied to presence coherence
    this.labState.tulips.colorBrilliance = this.vagalPattern.presence * 0.9 + 0.1;
  }

  /**
   * Time weaving—temporal dimension
   * Past fades, present shines, future beckons
   */
  private updateTimeWeaving(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;

    // Past fades as you become more present
    this.labState.timeWeaving.pastFade = 0.3 - (vagalRatio * 0.2);

    // Present brilliance tied to coherence
    this.labState.timeWeaving.presentBrilliance = this.vagalPattern.coherence * 0.9 + 0.1;

    // Future potential increases with coherence (capacity for possibility)
    this.labState.timeWeaving.futurePotential = vagalRatio * 0.8;
  }

  /**
   * Consciousness—the deepest dimension
   * The sense of presence, clarity, and depth of awareness
   */
  private updateConsciousness(): void {
    const vagalRatio = this.vagalState.vagalTone / 100;

    // Alertness tied to vagal engagement
    this.labState.consciousness.alertness = 0.3 + (vagalRatio * 0.7);

    // Clarity increases in coherent states
    if (this.vagalState.regulationState === 'coherent' || this.vagalState.regulationState === 'transcendent') {
      this.labState.consciousness.clarity = 0.9;
    } else if (this.vagalState.regulationState === 'calm') {
      this.labState.consciousness.clarity = 0.7;
    } else {
      this.labState.consciousness.clarity = 0.3;
    }

    // Depth: the subjective sense of how "deep" you can perceive
    this.labState.consciousness.depth = this.vagalPattern.presence * this.vagalPattern.coherence;
  }

  /**
   * Subscribe to laboratory state updates
   */
  public subscribe(callback: (state: LaboratoryState) => void): () => void {
    this.updateCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of state change
   */
  private notifySubscribers(): void {
    this.updateCallbacks.forEach((callback) => {
      callback(this.labState);
    });
  }

  /**
   * Get current laboratory state
   */
  public getState(): LaboratoryState {
    return { ...this.labState };
  }

  /**
   * Get state for rendering (Three.js or Babylon.js)
   */
  public getRenderState() {
    return {
      lab: this.labState,
      vagal: this.vagalState,
      pattern: this.vagalPattern,
    };
  }
}

export default LaboratoryEngine;
