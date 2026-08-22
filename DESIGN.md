---
name: Paisa Bachat
description: A concise, professional system for converting visitors into users by clearly communicating value and making signup/first-use frictionless.
colors:
  primary: "#2B6CB0"
  neutral-bg: "#F7F8FA"
  neutral-900: "#0F1724"
  neutral-700: "#334155"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 600
  body:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    fontSize: "16px"
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
---

## Overview

Paisa Bachat is a focused, professional-facing product whose first surface must quickly communicate trust and value to small-business owners and convert them to act (signup, upload receipts). The creative north star is: "Clear, trustworthy, and efficient — make taking the next step obvious." This seed DESIGN.md establishes a muted, professional palette, restrained typography, and component primitives that prioritize clarity and conversion.

## Colors

- Primary: {colors.primary} — used for primary CTAs, links, and interactive highlights.
- Neutral background: {colors.neutral-bg} — page canvas and large surfaces.
- Text: {colors.neutral-900} / {colors.neutral-700} — primary and secondary text.

Usage notes:
- Use Primary for main calls-to-action (signup, save, confirm). Reserve strong color for one dominant action per viewport.
- Surface contrasts should be achieved by neutral ramps and micro-shadow rather than saturated accent colors.

## Typography

- Display: used for hero headings and marketing banners. Generous scale and 600 weight to establish hierarchy.
- Body: readable 16px base, 1.5 line-height for comfortable scanning on marketing pages.
- Keep UI labels and form text compact; use medium weight for CTAs and semibold for key facts.

## Layout

- Centered content column on marketing pages: max-width 960px with 24px gutters on mobile and 48–64px on desktop.
- Rhythm: use spacing.md (16px) as the baseline unit; compose multiples for larger groupings.
- Responsive breakpoints: stack mobile-first at ~640px; wide layouts progressively expose secondary content.

## Elevation & Depth

- Minimal elevation: soft ambient shadow for floating cards and modals (subtle, low-contrast).
- Primary CTA may receive a slight lift on hover; avoid heavy drop shadows to maintain a professional, printed feel.

## Shapes

- Rounded corners favor modest radii: sm (6px) for buttons and inputs, md (12px) for cards and large surfaces.
- Avoid extreme pills or sharp rectangles; maintain a consistent, courteous geometry across components.

## Components

- Button (button-primary): background {colors.primary}, text {colors.neutral-bg}, rounded {rounded.sm}, padding as in the frontmatter. Include :hover with slightly deeper primary tone and accessible focus ring.

- Card: neutral background (white or slightly elevated neutral), rounded {rounded.md}, subtle shadow, internal padding md/lg.

- Input: single-line text fields with 1px neutral-700 border, 8–12px internal padding, clear label above and concise helper text below.

## Do's and Don'ts

### Do:
- Do use the primary color for one clear CTA per page.
- Do prefer readable, conservative type scales for marketing copy.
- Do rely on spacing and hierarchy instead of heavy color blocks to indicate importance.

### Don't:
- Don't use multiple competing accent colors on the same viewport.
- Don't rely on heavy shadows or saturated gradients; keep contrast measured and legible.


*Seed DESIGN.md generated from PRODUCT.md and a short new-work workshop (mode: Persuade; mood: Professional & muted). Edited by an AI assistant using Copilot CLI runtime in VS Code.*
