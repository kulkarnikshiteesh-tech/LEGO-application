# LEGO PO page — build state & next steps

*Updated 2026-06-16, end of session.*

## Where the page is
`index.html`, single file, dark aesthetic, LEGO accents (yellow/red/blue/green), Bricolage + Inter.

- **Hero = landscape "device card"** (game left, "Hej there" intro right). No designer/engineer pitch. No rail on first screen.
- **KIDO game:** squircle KIDO, 5x5 grid (full grid lines), apple + house. Direct up/down/left/right (triangle-in-circle buttons) + reset. Walk to apple, carry it home → confetti + happy KIDO.
- **KIDO continuity (the signature move):** one fixed element. Lives in the grid; on scroll past hero he walks out to the station rail and rides it; scroll back up and he walks into his exact remembered cell. Transition logic: glued (transition none) while tracking grid on scroll, animated (WALK_T) during the grid↔rail walk and on the rail, STEP_T for button hops. Mode decided by board on-screen visibility (not scroll distance) — this fixed the "lands in a random cell" bug.
- **Station rail** (desktop >1240px) appears after hero; mobile = sticky chip bar. Section content shifted right (margin-left 300px) so rail never overlaps copy.
- **Sections (content locked, from content-stories.md):** 01 What to build (Amazon data → Dust Ninja), 02 Test with kids (speaker + MEEBO/PYBO, before/after image slots), 03 Makeable, 04 The numbers (Gobble Bot), 05 The platform (standardisation), 06 Proof grid, 07 Contact/close.

## Waiting on Kshiteesh
- **Project images** (he is filling the project folders in the morning): speaker before/after, Gobble Bot before/after, MEEBO/PYBO, proof-grid thumbs. Image slots are dashed placeholders now.
- **Makeable Supabase session stats** to drop into section 03.

## Next: interactive experience + animation (brief to develop)
The page still feels static below the hero. Sam Coates is ex-PlayStation, high polish bar. Ideas to design and pitch next session (pick the few that earn their place, no gratuitous motion):

1. **KIDO reacts on the rail** — small idle behaviours per section (looks at the content, nods), maybe a tiny speech bubble at one or two sections.
2. **Section entrance choreography** — staggered, directional reveals with intent (not just fade-up), tied to the LEGO stud/brick motif (pieces snapping in).
3. **Count-up + bar-fill stats** (like the Design Manager allocation bars) for the numbers/roadmap sections — numbers animate when scrolled in.
4. **Before/after image interaction** — slider or hover wipe to compare speaker/Gobble Bot old vs new, rather than two static frames.
5. **The roadmap as a live thing** — a small interactive "what the data picked" visual (keyword → product), maybe a mini bar/keyword viz.
6. **Hero polish** — cursor-reactive parallax on the card, subtle grid shimmer, stud cursor, magnetic buttons.
7. **Win-state payoff** — once the game is solved, unlock/reveal something (echo the Design Manager scroll-lock idea, lighter: a "thanks for playing" flourish or a hidden line).
8. **Micro-interactions** — button press feedback, card tilt, link magnetism, smooth anchor scrolling with rail sync.
9. **Page-level cohesion** — KIDO as the consistent guide; consider him "carrying" the apple into the first section as a callback.

Decide with him which to build; keep spacing generous, no information overload.
