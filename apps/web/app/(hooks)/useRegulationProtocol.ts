'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🎯 GUIDED REGULATION PROTOCOLS
 * 
 * Evidence-based sequences that train vagal tone and nervous system regulation.
 * 
 * Based on research from:
 * - Polyvagal Theory (Stephen Porges)
 * - HeartMath Institute coherence training
 * - Vagal nerve stimulation protocols
 * - Trauma-informed somatic practices
 */

// ============================================================================
// PROTOCOL TYPES
// ============================================================================

export interface RegulationStep {
  id: string;
  duration: number; // seconds
  type: 'breathing' | 'visualization' | 'movement' | 'sound' | 'pause';
  instruction: string;
  voiceGuidance: string;
  visualCue: {
    type: 'orb_breathing' | 'color_shift' | 'particle_flow' | 'environment';
    params: Record<string, any>;
  };
  biometricTarget?: {
    vagalTone?: { min?: number; max?: number };
    coherence?: { min?: number; max?: number };
    breathingRate?: { target: number }; // breaths per minute
  };
}

export interface RegulationProtocol {
  id: string;
  name: string;
  description: string;
  duration: number; // total seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: 'activation' | 'regulation' | 'calming' | 'integration';
  steps: RegulationStep[];
  successCriteria: {
    vagalToneIncrease: number; // minimum % increase
    coherenceTarget: number; // minimum coherence score
    completionRate: number; // % of protocol completed
  };
}

// ============================================================================
// PROTOCOL LIBRARY
// ============================================================================

export const REGULATION_PROTOCOLS: Record<string, RegulationProtocol> = {
  // ============================================================================
  // BEGINNER: Coherent Breathing
  // ============================================================================
  coherent_breathing: {
    id: 'coherent_breathing',
    name: 'Coherent Breathing',
    description: 'The foundation of vagal tone training. 5.5-second breath cycles optimize heart rate variability.',
    duration: 300, // 5 minutes
    difficulty: 'beginner',
    goal: 'regulation',
    steps: [
      {
        id: 'intro',
        duration: 30,
        type: 'visualization',
        instruction: 'Settle into a comfortable position. Notice your breath without changing it.',
        voiceGuidance: 'Welcome. Find a comfortable position. For the next few moments, simply notice your natural breath. No need to change anything yet.',
        visualCue: {
          type: 'orb_breathing',
          params: { speed: 'natural', color: 'purple' }
        }
      },
      {
        id: 'breathing_1',
        duration: 270, // 4.5 minutes
        type: 'breathing',
        instruction: 'Breathe in for 5.5 seconds, out for 5.5 seconds. Follow the orb.',
        voiceGuidance: 'Now, breathe in... 2, 3, 4, 5... and out... 2, 3, 4, 5. Let the orb guide your rhythm.',
        visualCue: {
          type: 'orb_breathing',
          params: { 
            inhale: 5.5,
            exhale: 5.5,
            color: 'blue',
            expansion: 1.3
          }
        },
        biometricTarget: {
          breathingRate: { target: 5.5 }, // ~5.5 breaths per minute
          coherence: { min: 50 }
        }
      }
    ],
    successCriteria: {
      vagalToneIncrease: 10,
      coherenceTarget: 50,
      completionRate: 80
    }
  },
  
  // ============================================================================
  // INTERMEDIATE: Vagal Tone Builder
  // ============================================================================
  vagal_tone_builder: {
    id: 'vagal_tone_builder',
    name: 'Vagal Tone Builder',
    description: 'Progressive breathing patterns that strengthen the vagus nerve through varied rhythms.',
    duration: 480, // 8 minutes
    difficulty: 'intermediate',
    goal: 'activation',
    steps: [
      {
        id: 'warmup',
        duration: 60,
        type: 'breathing',
        instruction: 'Natural breathing to establish baseline',
        voiceGuidance: 'Begin with natural, relaxed breathing. Let your body find its rhythm.',
        visualCue: {
          type: 'orb_breathing',
          params: { speed: 'natural', color: 'purple' }
        }
      },
      {
        id: 'activate_phase',
        duration: 180,
        type: 'breathing',
        instruction: 'Box breathing: 4 seconds in, 4 hold, 4 out, 4 hold',
        voiceGuidance: 'Breathe in for 4... hold for 4... out for 4... hold for 4. This activates your vagal brake.',
        visualCue: {
          type: 'orb_breathing',
          params: {
            inhale: 4,
            holdTop: 4,
            exhale: 4,
            holdBottom: 4,
            color: 'blue',
            expansion: 1.4
          }
        },
        biometricTarget: {
          vagalTone: { min: 50 },
          coherence: { min: 60 }
        }
      },
      {
        id: 'deepen_phase',
        duration: 180,
        type: 'breathing',
        instruction: 'Extended exhale: 4 in, 8 out (vagal activation)',
        voiceGuidance: 'Now, breathe in for 4... and out for 8. This extended exhale directly stimulates your vagus nerve.',
        visualCue: {
          type: 'orb_breathing',
          params: {
            inhale: 4,
            exhale: 8,
            color: 'purple',
            expansion: 1.5
          }
        },
        biometricTarget: {
          vagalTone: { min: 60 },
          coherence: { min: 65 }
        }
      },
      {
        id: 'integration',
        duration: 60,
        type: 'pause',
        instruction: 'Return to natural breathing. Notice the changes.',
        voiceGuidance: 'Return to your natural breath. Notice how your body feels different now. More settled. More regulated.',
        visualCue: {
          type: 'orb_breathing',
          params: { speed: 'natural', color: 'green' }
        }
      }
    ],
    successCriteria: {
      vagalToneIncrease: 20,
      coherenceTarget: 65,
      completionRate: 85
    }
  },
  
  // ============================================================================
  // ADVANCED: Trauma Release Protocol
  // ============================================================================
  trauma_release: {
    id: 'trauma_release',
    name: 'Gentle Trauma Release',
    description: 'Advanced protocol for processing stored stress. Uses pendulation between activation and settling.',
    duration: 600, // 10 minutes
    difficulty: 'advanced',
    goal: 'integration',
    steps: [
      {
        id: 'grounding',
        duration: 90,
        type: 'visualization',
        instruction: 'Ground into present moment awareness',
        voiceGuidance: 'Feel your body supported. Notice where you contact the ground. You are safe here, now.',
        visualCue: {
          type: 'environment',
          params: { scene: 'garden', stability: 'high' }
        }
      },
      {
        id: 'titration_1',
        duration: 120,
        type: 'breathing',
        instruction: 'Gentle activation: Notice any sensation without judgment',
        voiceGuidance: 'As you breathe, if any sensation arises in your body, simply notice it. You don\'t need to fix or change anything.',
        visualCue: {
          type: 'particle_flow',
          params: { speed: 'slow', color: 'amber' }
        },
        biometricTarget: {
          vagalTone: { min: 40, max: 70 } // Stay in window of tolerance
        }
      },
      {
        id: 'pendulation_1',
        duration: 90,
        type: 'breathing',
        instruction: 'Return to resource: Deep, slow breaths',
        voiceGuidance: 'Now, return to your breath. Deep, slow, safe. You can always return here.',
        visualCue: {
          type: 'orb_breathing',
          params: { inhale: 6, exhale: 8, color: 'purple' }
        },
        biometricTarget: {
          vagalTone: { min: 55 }
        }
      },
      {
        id: 'titration_2',
        duration: 90,
        type: 'visualization',
        instruction: 'Gently revisit activation, with more capacity',
        voiceGuidance: 'You have more capacity now. If you\'re ready, notice that sensation again. With compassion.',
        visualCue: {
          type: 'color_shift',
          params: { from: 'purple', to: 'amber', speed: 'slow' }
        }
      },
      {
        id: 'integration_final',
        duration: 210,
        type: 'breathing',
        instruction: 'Coherent breathing for integration',
        voiceGuidance: 'Breathe naturally now. Allow your nervous system to integrate what it processed. You did good work.',
        visualCue: {
          type: 'orb_breathing',
          params: { inhale: 5.5, exhale: 5.5, color: 'green' }
        },
        biometricTarget: {
          coherence: { min: 70 },
          vagalTone: { min: 60 }
        }
      }
    ],
    successCriteria: {
      vagalToneIncrease: 15,
      coherenceTarget: 70,
      completionRate: 75 // Lower because this is challenging
    }
  },
  
  // ============================================================================
  // QUICK: Emergency Regulation
  // ============================================================================
  emergency_regulation: {
    id: 'emergency_regulation',
    name: 'Emergency Regulation',
    description: 'Fast-acting protocol for acute stress or panic. Gets you regulated in 3 minutes.',
    duration: 180, // 3 minutes
    difficulty: 'beginner',
    goal: 'calming',
    steps: [
      {
        id: 'immediate_grounding',
        duration: 30,
        type: 'movement',
        instruction: 'Press feet firmly into ground. Feel solid support.',
        voiceGuidance: 'You\'re safe. Press your feet down. Feel the ground beneath you. You\'re here.',
        visualCue: {
          type: 'environment',
          params: { scene: 'solid', color: 'earth' }
        }
      },
      {
        id: 'physiological_sigh',
        duration: 60,
        type: 'breathing',
        instruction: 'Double inhale, long exhale (physiological sigh)',
        voiceGuidance: 'Breathe in... in again... and out slowly. This resets your nervous system immediately.',
        visualCue: {
          type: 'orb_breathing',
          params: { 
            pattern: 'double_inhale', // Special pattern
            exhale: 8,
            color: 'blue'
          }
        },
        biometricTarget: {
          vagalTone: { min: 45 }
        }
      },
      {
        id: 'stabilization',
        duration: 90,
        type: 'breathing',
        instruction: 'Coherent breathing for stabilization',
        voiceGuidance: 'Keep breathing. In... and out. You\'re doing great. Your body is regulating.',
        visualCue: {
          type: 'orb_breathing',
          params: { inhale: 5.5, exhale: 5.5, color: 'purple' }
        },
        biometricTarget: {
          coherence: { min: 50 }
        }
      }
    ],
    successCriteria: {
      vagalToneIncrease: 15,
      coherenceTarget: 50,
      completionRate: 90
    }
  }
};

// ============================================================================
// PROTOCOL RUNNER HOOK
// ============================================================================

export function useRegulationProtocol(protocolId: string) {
  const protocol = REGULATION_PROTOCOLS[protocolId];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<SpeechSynthesisUtterance>();
  
  const currentStep = protocol.steps[currentStepIndex];
  const progress = (elapsedTime / protocol.duration) * 100;
  
  // Text-to-speech for voice guidance
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for calm delivery
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      audioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, []);
  
  // Start protocol
  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);
    setCurrentStepIndex(0);
    
    // Speak first instruction
    if (protocol.steps[0]) {
      speak(protocol.steps[0].voiceGuidance);
    }
  }, [protocol, speak]);
  
  // Pause/Resume
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    if (isPaused) {
      speak('Resuming');
    } else {
      speak('Paused');
      window.speechSynthesis.cancel();
    }
  }, [isPaused, speak]);
  
  // Stop protocol
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setCurrentStepIndex(0);
    window.speechSynthesis.cancel();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (!isRunning || isPaused) return;
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Check if current step is complete
        let stepElapsed = newTime;
        for (let i = 0; i < currentStepIndex; i++) {
          stepElapsed -= protocol.steps[i].duration;
        }
        
        if (stepElapsed >= currentStep.duration) {
          // Move to next step
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < protocol.steps.length) {
            setCurrentStepIndex(nextIndex);
            speak(protocol.steps[nextIndex].voiceGuidance);
          } else {
            // Protocol complete
            stop();
            speak('Protocol complete. Notice how you feel.');
          }
        }
        
        // Check if entire protocol is done
        if (newTime >= protocol.duration) {
          stop();
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, currentStep, currentStepIndex, protocol, speak, stop]);
  
  return {
    protocol,
    currentStep,
    currentStepIndex,
    elapsedTime,
    progress,
    isRunning,
    isPaused,
    start,
    togglePause,
    stop,
  };
}
