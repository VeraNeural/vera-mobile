# Wearable Audio Channel Blueprint

This document captures how VERA keeps Julija (and future users) continuously co-regulated through a lightweight ear-side device (bone-conduction band, smart earbud, or neural clip). The focus is to make reminders, schedule alignment, negotiation prep, and self-care nudges feel ambient, precise, and safe.

## Goals
- Deliver high-priority alerts (email triage, meeting prep, negotiation cues) hands-free.
- Provide ongoing regulation prompts (breathing cadence, posture, hydration, nourishment, sleep hygiene).
- Maintain compliance: avoid PHI spillover, follow consent preferences, respect quiet windows.
- Support session continuity: therapists can push follow-up protocols, clients can request grounding support between sessions.

## Channel Architecture
1. **Signal Orchestrator (apps/api)**
   - Consolidates events from calendar, Titan Mail, Asana, Make.com automations, biometrics, and therapist inputs.
   - Runs prioritization pipeline with weightings for urgency, regulation need, and consent filters.
   - Emits `audioPrompt` events to the queue (BullMQ) tagged by persona (Julija vs Tarloy) and modality (voice, haptic, tone).

2. **Worker (apps/worker)**
   - Consumes `audioPrompt` events, resolves context (current activity, location tag, quiet hours).
   - Generates narration text, key phrases, and cue metadata (tempo, tone).
   - Invokes TTS provider (ElevenLabs, Azure Neural Voice, or local VITS) with VERA’s voiceprint.
   - Packages payload (audio snippet, fallback text, instruction metadata) into WebSocket push + optional background notification.

3. **Mobile Companion (apps/mobile)**
   - Runs a persistent service (Expo + React Native headless task) subscribed to the WebSocket channel.
   - Streams audio to paired device using Bluetooth LE Audio or system-level routing (iOS CallKit / Android Foreground Service).
   - Provides quick action chips on the lock screen (“Mark done”, “Repeat”, “Snooze 15m”, “Delegate to Tarloy”).
   - Syncs acknowledgement state back to orchestrator for analytics and adaptive scheduling.

4. **Wearable/Headset Integration**
   - Primary path: use system-level audio output assumed to be a bone-conduction or smart earbud that remains paired.
   - Optional custom hardware: publish BLE GATT profile (`veraPrompt/001`) for devices that handle local playback or haptic cues.
   - Support wake phrase (“VERA, status check”) processed locally on mobile to avoid cloud dependency.

## Content Design
- **Tone**: grounded, concise, compassionate. No emoji; rely on confident voice and subtle chimes.
- **Templates**
  - "Email triage: Titan flagged three priority threads. First: investor follow-up. I can draft replies when you say ‘compose’."
  - "Negotiation prep: Tarloy meeting in 45 minutes. Here are the top three concessions to guard."
  - "Regulation cue: cortisol rising. Suggest four-count breath, then protein snack within 15 minutes."
  - "Sleep window: target lights out 22:45. Last caffeine was 6h ago, hydration at 72%."

## Scheduling & Escalation
- **Context windows**: working focus blocks, negotiation mode, social content batching, therapy debrief.
- **Escalation ladder**
  1. Gentle audio tone + whisper cue.
  2. Follow-up with active voice if no acknowledgement in 90s.
  3. Haptic nudge via wearable if still unattended and compliance allows.
  4. Notify trusted partner (Tarloy) or therapist when critical commitments are at risk (opt-in rule set).
- **Silence windows**: therapy sessions, keynotes, sleep, deep work—VERA shifts to low-power vibe or haptic-only mode.

## Data & Privacy
- Consent ledger tracks which categories (emails, biometrics, social plans) can be voiced aloud.
- On-device cache stores only immediate prompts; personal data encrypted at rest, purged after playback.
- Wake phrase processing remains local. All cloud requests use scoped tokens; no raw PHI sent to TTS vendor without BAA.

## Implementation Next Steps
1. Define `AudioPrompt` schema in shared lib (`packages/lib`) including urgency, modality, short text, long text, attachments.
2. Build API endpoint `/assist/prompt` that queues prompts for Julija or Tarloy.
3. Extend mobile app with background service + WebSocket client and headphone routing controls.
4. Evaluate TTS provider that supports HIPAA-eligible agreements or self-host VITS with GPU microservice.
5. Prototype wake-word detection using Porcupine or Vosk running locally.
6. Usability test with preferred ear-side hardware; adjust cadence and voice for comfort.

This channel keeps VERA present without overwhelming, ensuring she can remind, prepare, and regulate continuously through a lightweight always-on companion.
