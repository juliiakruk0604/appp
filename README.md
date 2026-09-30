# Двоє — relationship psychology prototype

Current prototype of **Двоє**, a relationship psychology product with Solo and Couple flows.

## Current product direction

Solo is built around:

```
real situation
→ assisted interpretation
→ psychological routing
→ route-specific next step
→ real-world outcome
→ evidence memory
→ future comparison
```

The product should not behave like a generic AI chat or a personality test.

## Core files

- `App.tsx` — product flow and UI
- `clinicalBrain.ts` — psychological routing, protocol cards and gold cases
- `solo.css` — Solo-specific UI styles
- `index.css` — shared visual system
- `index.tsx` — React entry
- `package.json` — dependencies
- `tailwind.config.js` — Tailwind config

## Psychological routes

The current engine routes cases into:

- UNDERSTAND
- CLARIFY
- SAY
- REGULATE
- CHANGE
- DECIDE
- SAFETY

Internal protocol IDs and confidence should stay hidden from end users.

## Latest Solo UX changes

- Solo can start from a real situation without completing the relationship map first.
- The first input is one free-text situation.
- Dvoe then presents an assisted interpretation:
  - what happened;
  - what may be central;
  - what is still unknown.
- The user confirms/corrects the interpretation.
- Only contextual follow-up questions are shown.
- Different psychological jobs produce different outputs.
- Follow-up stores a real outcome.
- Solo Home is centered on Relationship Evidence rather than generic modules.
- History stores `situation → action → outcome`.
- No stable pattern should be claimed from a single case.

## Important product constraints

- Do not diagnose users or absent partners.
- Do not infer partner motives from one person's story.
- Do not force every route into a message-builder.
- Safety signals override ordinary relationship communication flows.
- Decision mode supports the user's reasoning but never decides whether they should stay or leave.
- Couple flow should not be rewritten unless necessary for the task.
- Preserve the current warm editorial visual language.

## Current status

This repository is synced from the latest active Magic Patterns prototype as of 2026-09-30.
