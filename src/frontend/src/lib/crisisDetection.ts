const CRISIS_KEYWORDS = [
  // Obvious / explicit
  "suicide",
  "suicidal",
  "end my life",
  "kill myself",
  "don't want to be here",
  "dont want to be here",
  "want to die",
  "better off dead",
  "can't go on",
  "cant go on",
  "take my own life",
  "end it all",
  "not worth living",
  "wish i was dead",
  "wish i were dead",
  "rather be dead",
  "life is not worth",
  "no point in living",
  "thinking about suicide",
  "thinking about ending",

  // Subtle / indirect
  "i can't go on",
  "i cant go on",
  "no reason to live",
  "tired of everything",
  "i give up",
  "i give up on life",
  "nothing matters anymore",
  "nobody cares",
  "no one would miss me",
  "i feel empty",
  "i don't want to feel anymore",
  "i dont want to feel anymore",
  "what's the point",
  "whats the point",
  "i'm done",
  "im done",
  "can't take it anymore",
  "cant take it anymore",
  "i hate myself",
  "i want to disappear",
  "i want to vanish",
  "feel like a burden",
  "everyone would be better without me",
  "life has no meaning",
  "i have nothing to live for",
  "there's no hope",
  "theres no hope",
  "i feel like giving up",
  "i don't see a way out",
  "i dont see a way out",
  "no way out",
  "suffering too much",
  "can't keep going",
  "cant keep going",
];

/**
 * Detects crisis-related keywords in a given text string.
 * Returns true if any crisis phrase is found (case-insensitive).
 */
export function detectCrisisKeywords(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
