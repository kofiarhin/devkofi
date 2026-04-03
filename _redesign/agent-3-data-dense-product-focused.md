# Agent 3 — Product/data-dense redesign proposal

## Concept
Redesign as a **project intelligence dashboard** for technical audiences.

## Information architecture
1. **Top analytics summary**
   - Project count, active builds, archived ratio, stack distribution.
2. **Advanced filter panel**
   - Multi-select filters for status, stack, deployment target, repo visibility.
3. **Split view**
   - Left: compact project table/cards.
   - Right: selected project details panel.
4. **Technical metrics tabs**
   - `Overview`, `Architecture`, `Delivery`, `Reliability`.
5. **Repo/demo action footer**
   - Persistent action row for selected project.

## UX changes
- Add search with fuzzy matching by name/tech.
- Add saved filter presets (`Frontend-heavy`, `AI-enabled`, `Client-facing`).
- Replace modal with **non-blocking side panel** to keep context.

## Visual direction
- Dense but clean layout inspired by linear/notion dashboards.
- Smaller card height, stronger alignment grid, lower animation intensity.
- Color semantics by status and risk.

## Why this is better
- High utility for technical reviewers.
- Greatly reduces click depth to compare projects.
- Supports future scaling as project count grows.
