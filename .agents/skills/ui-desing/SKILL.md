---
name: ui-desing
description: Use when the user asks to polish, restyle, or build user interfaces with modern CSS.
---
# Rules for Modern UI Design

## 1. Typography & Hierarchy
- Avoid generic fonts (like Arial). Always use professional, characterful typefaces.
- Enforce strict contrast between headers (bold, distinct) and body text (clean, readable).
- Maintain an explicit hierarchical scale (e.g., `h1` is 2.5rem, `p` is 1rem).

## 2. Color & Theme (Cohesive Aesthetic)
- Never use random hex codes. Everything must derive from clean CSS custom variables (`:root`).
- Use a dominant dark or light shade (60%), a structural text/border color (30%), and ONE single punchy accent color (10%) for CTA buttons or focus states.
- Prioritize sophisticated palettes: slate, emerald, indigo, zinc, or amber.

## 3. Spatial Composition & Spacing
- Use generous negative space (padding/margin). Let elements breathe.
- Avoid borders everywhere. Use fine shadows (`box-shadow`) or subtle background shifts (`bg-zinc-50` vs `bg-white`) to separate sections.
- Ensure all interactive elements have highly polished `:hover`, `:focus-visible`, and `:active` transitions.
