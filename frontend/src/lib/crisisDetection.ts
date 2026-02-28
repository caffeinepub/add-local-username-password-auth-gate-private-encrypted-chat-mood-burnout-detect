const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'end my life',
  'kill myself',
  "don't want to be here",
  'dont want to be here',
  'want to die',
  'no reason to live',
  'better off dead',
  "can't go on",
  'cant go on',
  'take my own life',
  'end it all',
  'not worth living',
  'wish i was dead',
  'wish i were dead',
  'rather be dead',
  'life is not worth',
  'no point in living',
  'thinking about suicide',
  'thinking about ending',
];

/**
 * Detects crisis-related keywords in a given text string.
 * Returns true if any crisis phrase is found (case-insensitive).
 */
export function detectCrisisKeywords(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
