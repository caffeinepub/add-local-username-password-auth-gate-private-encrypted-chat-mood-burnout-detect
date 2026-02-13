# Specification

## Summary
**Goal:** Gate the Anonymous Chat experience behind a custom local username/password auth flow, add simplified private message encryption, provide rule-based mood/burnout detection with supportive responses, and introduce a therapist-connection prompt step.

**Planned changes:**
- Add local sign-up/sign-in UI flow triggered by the existing CTA before entering chat, with logout and authenticated routing.
- Enforce strict password complexity and a password-rotation policy in the auth UX; ensure secure credential handling so passwords are never stored/returned in plaintext and are not logged or placed in URLs/local storage.
- Add a simple local CAPTCHA-style challenge to auth screens that regenerates on demand and after repeated failures.
- Extend the single-actor Motoko backend to support local user accounts/sessions and to gate chat/data-entry write operations behind local authentication, persisting state across upgrades.
- Implement a simplified private encryption layer so chat messages are encrypted client-side before sending, stored/returned as ciphertext, and decrypted client-side for display (with a clear placeholder when decryption isn’t possible), without breaking existing polling/refresh behavior.
- Add a rule-based (no external AI) classifier that analyzes submitted chat text for mood/burnout signals and generates a deterministic supportive response shown as a system/assistant message.
- After showing the supportive response, present a dedicated screen/modal offering to connect to a licensed therapist and stating the first session is free, allowing proceed/decline without losing conversation state.

**User-visible outcome:** Users must create an account and sign in (with a local CAPTCHA challenge and strong password rules) before accessing chat; chat messages are handled with simplified private encryption; the app provides an in-chat supportive response based on rule-based mood/burnout detection and then offers an optional therapist-connection prompt stating the first session is free.
