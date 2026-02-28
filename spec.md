# Specification

## Summary
**Goal:** Add a crisis support popup with keyword detection for suicidal ideation in the MindVault app.

**Planned changes:**
- Create a `CrisisSupportModal` component with a full-screen overlay featuring a compassionate message ("You Are Not Alone"), an offer for a free 30-minute session with a real therapist, and the contact number `90xoxo90xo`, with a visible dismiss/close button
- Implement a `detectCrisisKeywords` utility function that performs case-insensitive detection of crisis-related phrases (e.g., "suicide", "end my life", "kill myself", "want to die", etc.)
- Integrate keyword detection into `AnonymousChat.tsx` to trigger the modal on message submission when crisis phrases are detected
- Integrate keyword detection into `DataEntryPanel.tsx` to trigger the modal on text submission when crisis phrases are detected

**User-visible outcome:** When a user submits text containing crisis-related phrases in the chat or data entry areas, a prominent, warm-colored overlay popup immediately appears offering compassionate support, a free 30-minute therapist session, and the contact number `90xoxo90xo`. The user can freely dismiss the modal at any time.
