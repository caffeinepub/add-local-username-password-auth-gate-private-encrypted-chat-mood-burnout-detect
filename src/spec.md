# Specification

## Summary
**Goal:** Fix the intermittent crash when reopening “Start Anonymously” after navigating through login and anonymous chat, and make landing/experience navigation state reliable across repeated open/close and back navigation.

**Planned changes:**
- Identify and fix the root cause of the “Something unexpected happened” ErrorBoundary crash triggered by clicking “Start Anonymously” after traversing login/chat flows.
- Make MindVaultLandingPage’s “Experience open/closed” UI state consistently synchronized with browser history state during open, close, and back-button navigation (including repeated cycles).
- Improve runtime diagnostics when the ErrorBoundary is hit by logging the underlying error plus navigation context (URL, history.state, intended Experience open state), while keeping user-facing copy unchanged in meaning.
- Ensure “Try Again” produces deterministic recovery (either clean re-render into a valid state or a full reload) rather than returning to a broken navigation state.

**User-visible outcome:** Users can click “Start Anonymously” from the landing page—even after entering login and using the anonymous chat tab and after using browser back/close cycles—and the Experience view opens reliably without intermittent ErrorBoundary crashes.
