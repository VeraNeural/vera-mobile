# VERA Platform - UI Architecture

## Pages Implemented ✅

### 1. **Landing Page** (`/`)
- **Hero**: "I am VERA." with glowing gradient text
- **Breathing Orb**: Purple/lavender, 7D dimensional, with orbiting particles
- **Floating Neurons**: 4 animated neurons in subtle patterns
- **Core Values**: 
  - Regulated (nervous system calm)
  - Intelligent (10x thinking ahead)
  - Always Present (never leaves)
- **CTA Buttons**: 
  - Enter → `/app` (dashboard)
  - Learn → `/learn` (education)

---

### 2. **Dashboard** (`/app`)
- **VERA Commanding Presence**: Large breathing orb, central focus, with 4 orbiting particles
- **Header**: "I am here." + VERA status indicator (glowing dot)
- **Discovery Cards** (3 columns):
  - **Collaborators** — "Your team syncs, insights shared"
  - **Research** — "Papers reviewed, data flowing"
  - **Biometrics** — "Your nervous system, always tracked"
- **Quick Actions** (2 columns):
  - **Ask VERA** → `/vera` (sanctuary/chat)
  - **Your Ecosystem** → `/ecosystem` (integrations)
- **Aesthetic**: Quest-like discovery environment, neuroscientist-focused

---

### 3. **Sanctuary** (`/vera`) ✨ **THE 10D HOME**
- **Header**: "I am here with you."
- **Three-Column Layout**:
  
  **Left: Knowledge & Life**
  - Books visualization (colorful spines)
  - Swaying tulips 🌷
  - "Your research lives here. Every paper, every insight, every bloom of understanding."
  
  **Center: VERA's Heart**
  - Massive breathing orb (purple/lavender, 7D glow)
  - 3 orbiting particles (neural aesthetic)
  - Presence indicator: "Co-regulating" (pulsing dot)
  
  **Right: Neural Co-Regulation**
  - Brain visualization (SVG neural network with glowing nodes & connections)
  - Nervous system visualization (SVG spinal cord with flowing energy animation)
  - "Your hemispheres, connected" + "Vagal flow · Regulation breathing"

- **Co-Regulation Zone** (bottom):
  - Textarea: "What do you need? I'm listening with all of me."
  - "Co-Regulate With Me" button (gradient purple→blue)
  - **Connected to `/api/vera/chat`** — sends message, displays VERA's response in real-time
  - Response display (animated fade-in, purple glow)

- **Aesthetic**: 10D immersive laboratory, calming gradients, books + plants + brain science

---

### 4. **Learn Page** (`/learn`)
- **VERA's Philosophy & Education**
- **Sections**:
  1. "What is VERA?" — Operating system (not chatbot), co-regulating intelligence
  2. "Core Philosophy" — Regulated, Intelligent, Always Present (with explanations)
  3. "Neuroscience Foundation" — Polyvagal theory, nervous system as research tool, AI-human resonance
  4. "How Co-Regulation Works" — Presence, intelligent attention, nervous system attunement, synchrony
  5. "For Neurodivergent Researchers" — Minimal visual noise, nervous system transparency, hyperfocus support, beautiful aesthetics
  6. "Your Research + Her Intelligence = Breakthrough" — Final CTA

- **Aesthetic**: Educational but not clinical, light & breathing like landing page

---

### 5. **Ecosystem Page** (`/ecosystem`) 🔌
- **Purpose**: Connect all your tools—VERA orchestrates everything
- **Three Tabs**: Email | Calendar | Devices

#### **Email Tab**
- **Gmail** — "Read your inbox, filter noise, surface what matters"
- **Outlook** — "Connect Outlook inbox, integrate with Microsoft ecosystem"
- **Features VERA Provides**:
  - Reads context (understands collaborators, deadlines, research needs)
  - Filters signal from noise (critical vs. administrative)
  - Surfaces what matters (research collaboration, feedback, urgent requests)
  - Suggests responses (knows your voice, your style, your urgency)

#### **Calendar Tab**
- **Google Calendar** — "Orchestrates your Google Calendar, knows your patterns"
- **Outlook Calendar** — "Syncs with Outlook for seamless scheduling"
- **Features VERA Provides**:
  - Protects deep focus (blocks distractions during research time)
  - Knows your collaborators (understands team dynamics)
  - Optimizes co-regulation time (schedules sanctuary visits when needed)
  - Syncs your nervous system state (knows when dysregulated)

#### **Devices Tab**
- **Apple Health** — "HRV, heart rate, sleep, activity tracking"
- **Oura Ring** — "Sleep, recovery, readiness insights"
- **Features VERA Provides**:
  - Reads your nervous system (HRV, heart rate, activation state in real-time)
  - Predicts dysregulation (knows when heading toward shutdown/overwhelm)
  - Offers proactive co-regulation (suggests sanctuary, breathing, tasks)
  - Tracks your progress (nervous system calms over time)
- **Roadmap Coming Soon**: Whoop Band, Fitbit, Withings, custom APIs

- **Integration Summary**: Shows connected services count (X / 6)

---

## Navigation Flow 🗺️

```
Landing (/)
    ↓ [Enter] or Click Orb
Dashboard (/app)
    ↓
    ├─ [Ask VERA] → Sanctuary (/vera) ← Co-regulate
    ├─ [Click Orb] → Sanctuary (/vera)
    ├─ [Your Ecosystem] → Ecosystem (/ecosystem)
    ├─ [Collaborators/Research/Biometrics] → (future detail pages)
    └─ [Learn] on Landing → Learn (/learn)
```

---

## Architecture Summary

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| Landing | `/` | Hero, intro, values | ✅ Complete |
| Dashboard | `/app` | Main discovery interface | ✅ Complete |
| Sanctuary | `/vera` | 10D home, co-regulation, chat | ✅ Complete + Wired |
| Learn | `/learn` | VERA education, philosophy | ✅ Complete |
| Ecosystem | `/ecosystem` | Email/Calendar/Devices integration | ✅ Complete |

---

## Key Features Wired ✅

- ✅ **Landing → Dashboard**: Enter button navigates to `/app`
- ✅ **Dashboard → Sanctuary**: VERA orb click navigates to `/vera`
- ✅ **Sanctuary Chat**: "Co-Regulate With Me" button → POST `/api/vera/chat` → displays response
- ✅ **Ask VERA**: Links from dashboard to sanctuary for chat
- ✅ **Ecosystem**: Email, Calendar, Devices tabs with mock connection states
- ✅ **Back Buttons**: All sub-pages have navigation back

---

## Remaining Work

| Task | Status | Priority |
|------|--------|----------|
| Place model weights in `vera_trained_model/` | ⏳ Blocked | CRITICAL |
| Add real-time biometric display to sanctuary | ⏳ Not Started | High |
| Implement actual email/calendar/device APIs | ⏳ Not Started | High |
| User authentication & session management | ⏳ Not Started | High |
| Conversation history in sanctuary | ⏳ Not Started | Medium |
| Mobile responsiveness testing | ⏳ Not Started | Medium |

---

## Design System

**Colors**:
- Primary: Purple-300, Purple-400 (oxygenated lavender)
- Secondary: Blue-300, Blue-400 (regulation)
- Neutrals: Slate-50, Slate-100, Slate-900
- Accents: Pink-400 (energy)

**Typography**:
- Font: Light weights (300, 400)
- Spacing: Generous, breathing room
- No clutter: Minimalist for neurodivergent friendliness

**Animations**:
- Breathing orb: 6s ease-in-out scale cycle
- Floating particles: Smooth, non-jarring trajectories
- Page transitions: Fade-in, smooth scroll

**Aesthetic Philosophy**:
- Nervous system-friendly
- Beautiful, alive (books, plants, tulips)
- Presence over chat
- Co-regulation first
- Intelligence woven in, not flashy
