# Staking Education Onboarding — Design

**Date:** 2026-05-16
**Status:** Approved for implementation planning

## Summary

Add four educational screens to the intro onboarding flow that explain crypto staking to non-technical users using a savings-account analogy. The screens sit between the existing "investment experience" question (step 1) and "investment goal" question (now step 6), creating a single 6-step flow followed by personalization and welcome screens.

The goal is to leave the user both **understanding** what staking is and **motivated** to start. No risk disclosures appear in this flow (per product decision); they will be surfaced later at the point of action.

## Scope

**In scope:**

- Four new educational screens with heading + description (plus optional bullets on the last one) and a static illustration.
- A new `OnboardingInfoStep` React component for screens without answer options.
- Restructuring `Onboarding.tsx` around a single mixed-type step list (question + info).
- Shared progress indicator across all six steps.
- Four new illustration assets in `/public/`.

**Out of scope:**

- Personalization based on experience level (single content set for everyone).
- Risk disclosures (explicit product decision to skip in onboarding).
- Animated diagrams (static illustrations only).
- Changes to `OnboardingPersonalization` and `OnboardingWelcome`.
- Final CTA conversion — that remains in `OnboardingWelcome`.

## User Flow

```
Step 1/6: "What's your investment experience?"        [question]   — existing
Step 2/6: "Staking is like a savings account"         [info]       — new
Step 3/6: "But it works a bit differently"            [info]       — new
Step 4/6: "Your crypto earns, day after day"          [info]       — new
Step 5/6: "You're ready to start"                     [info]       — new
Step 6/6: "What's your main investment goal?"         [question]   — existing
        → OnboardingPersonalization                                — existing
        → OnboardingWelcome                                        — existing
```

Back navigation works across the full range (step 5 → 4 → 3 → 2 → 1). The dot progress indicator shows all six steps as a single sequence.

## Content

### Step 2/6 — Hook through analogy

- **Heading:** Staking is like a savings account
- **Description:** You set money aside, and over time it earns interest. Staking works the same way — except you set aside crypto, and it earns rewards while you hold it.
- **Illustration key:** `staking-savings`

### Step 3/6 — The key difference

- **Heading:** But it works a bit differently
- **Description:** There's no bank in the middle. Your crypto helps secure the network, and the network rewards you directly — which is why the returns tend to be higher than a typical savings account.
- **Illustration key:** `staking-different`

### Step 4/6 — Concrete value

- **Heading:** Your crypto earns, day after day
- **Description:** Stake $1,000 and earn around $100 over a year — paid automatically as crypto added to your balance. The more you stake, the more it grows.
- **Illustration key:** `staking-earns`

### Step 5/6 — Transition to action

- **Heading:** You're ready to start
- **Description:** It only takes three things:
- **Bullets:**
  1. Pick a strategy that fits your goals
  2. Choose how much to stake
  3. Watch your rewards grow
- **Illustration key:** `staking-ready`

## Components

### New: `OnboardingInfoStep`

Located at `src/components/OnboardingInfoStep.tsx`. Mirrors the layout and animation behavior of `OnboardingStep`, minus the answer-option machinery (no selection state, no keyboard option-cycling, no `canProceed` gating).

**Props:**

```ts
interface OnboardingInfoStepProps {
  step: number;                    // 1..totalSteps (shared count)
  totalSteps: number;              // 6
  heading: string;
  description: string;
  bullets?: string[];              // optional, used on step 5/6
  backgroundImageType:
    | 'staking-savings'
    | 'staking-different'
    | 'staking-earns'
    | 'staking-ready';
  onNext: () => void;
  onBack: () => void;
}
```

**Behavior:**

- Continue is always enabled (no answer required).
- Back is always rendered (step is never first in the overall flow when info screens appear).
- Enter key triggers Continue.
- Same Framer Motion transitions (`containerVariants`, `contentVariants`) as `OnboardingStep` for visual consistency.

**Layout:**

- Desktop: 50/50 split — text on the left, illustration in a rounded card on the right.
- Mobile: text stack, controls (progress dots + Continue + Back) fixed at the bottom, matching `OnboardingStep`.
- Where `OnboardingStep` renders answer buttons, `OnboardingInfoStep` renders either empty space (steps 2–4) or the bullets list (step 5).

### Modified: `OnboardingStep`

Extend the `backgroundImageType` union to include the four new keys, so the same image-resolution logic stays consistent if it's ever reused for question screens. No other changes.

### New (optional): `src/lib/getBackgroundImage.ts`

Extract the image-key → file-path mapping from `OnboardingStep` into a shared utility so both components use the same source of truth. Returns a URL string built from `import.meta.env.BASE_URL`.

```ts
type BackgroundImageType =
  | 'setup' | 'rewards' | 'freedom' | 'transparent' | 'oak'
  | 'staking-savings' | 'staking-different' | 'staking-earns' | 'staking-ready';

export function getBackgroundImage(type: BackgroundImageType): string;
```

### Modified: `Onboarding.tsx`

Replace the existing `onboardingSteps` array with a single mixed-type list:

```ts
type OnboardingStepDef =
  | {
      type: 'question';
      heading: string;
      description: string;
      options: string[];
      backgroundImageType: BackgroundImageType;
    }
  | {
      type: 'info';
      heading: string;
      description: string;
      bullets?: string[];
      backgroundImageType: BackgroundImageType;
    };
```

Render logic uses a switch on `step.type`:

- `question` → render `<OnboardingStep>` with selection wiring as today.
- `info` → render `<OnboardingInfoStep>` with `onNext` and `onBack` only.

State:

- `currentStep: number` — index 0..5 across the unified list.
- `answers: (string | null)[]` — sized to the full step list. Info-type steps stay `null` and are ignored.
- `canProceed` — derived per step: true for info, true-if-answered for question.

Transitions:

- After step 6 (the second question) completes → `OnboardingPersonalization`, as today.
- Back from step 2 goes to step 1; back from step 6 goes to step 5; etc.

## Assets

Four new illustrations to be added to `/public/`:

| File | Used on | Concept |
|------|---------|---------|
| `staking-savings.png` | Step 2 | Savings/jar/coin growing over time |
| `staking-different.png` | Step 3 | Direct peer-to-network connection (no middleman) |
| `staking-earns.png` | Step 4 | Growing balance, daily/recurring reward |
| `staking-ready.png` | Step 5 | "Get started" / launch / first step |

Illustrations should match the visual style of the existing `oak.png`, `setup.png`, `rewards.png`, `freedom.png`, `transparent.png` (warm, organic, illustrative — not flat icons).

## Testing notes

Manual checks before sign-off:

- All six steps render in order on desktop and mobile.
- Back works from every step including the new info screens.
- Dot progress shows correct filled state for each step (`step` filled when `index < step`).
- Step 5 bullets render correctly (proper spacing, no list collisions with controls).
- Continue button is enabled on info steps without selecting anything.
- Keyboard: Enter on info step advances; Up/Down do nothing problematic.
- Layout: illustrations load, fall back gracefully if a file is missing (placeholder acceptable until final assets arrive).

## Open questions for implementation phase

- Whether to use placeholder existing illustrations (e.g., `oak`) for the new keys until the four new assets are produced, or block the implementation on assets being ready. Recommendation: use `oak` as a temporary fallback and swap in final assets when they land.
