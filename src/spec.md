# Specification

## Summary
**Goal:** Fix the immediate-on-open frontend crash so the landing page reliably renders on first load, and add better (optional) crash diagnostics in the ErrorBoundary fallback.

**Planned changes:**
- Prevent runtime exceptions during initial navigation/history state initialization that currently trigger the ErrorBoundary on first load.
- Harden `useExperienceNavigationState` history synchronization so it safely handles `window.history.state` being `null`, `undefined`, or non-object, and preserves existing `history.state` fields while adding/updating the `mindvault_experience` flag.
- Enhance the ErrorBoundary fallback UI to allow users to optionally reveal technical error details (error name/message and stack excerpt when available) without changing the existing visible headline/body/button copy by default.

**User-visible outcome:** Opening the app (including in a fresh tab or after a hard refresh) shows the landing page instead of the generic crash screen; if a crash does occur, users can expand a details area to see the underlying error information.
