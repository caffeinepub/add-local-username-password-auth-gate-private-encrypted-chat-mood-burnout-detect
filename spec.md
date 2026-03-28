# MindVault

## Current State
The app has a crisis popup on the data entry form that triggers on obvious suicidal keywords and offers a 30-minute free session with crisis line 90xoxo90xo. The anonymous chat page exists but has no crisis detection.

## Requested Changes (Diff)

### Add
- Expanded keyword detection list in the anonymous chat component (subtle + obvious phrases)
- Full-screen overlay crisis popup component triggered from within the anonymous chat
- 60-minute free consultation offer with crisis line 90xoxo90xo displayed in the popup

### Modify
- AnonymousChat component: integrate keyword scanning on every message the user types/sends
- Crisis popup: upgrade to full-screen warm overlay, compassionate copy, 60-min offer

### Remove
- Nothing removed

## Implementation Plan
1. Create/update a CrisisOverlay component: full-screen warm gradient overlay, large compassionate heading, body text, crisis line 90xoxo90xo, 60-min free offer CTA, freely dismissible close button
2. Add expanded keyword list covering obvious and subtle suicidal ideation phrases
3. Wire keyword scanner into AnonymousChat — scan each message before/after send and show the overlay if triggered
4. Ensure overlay renders above all other content (z-index) with smooth fade-in animation
