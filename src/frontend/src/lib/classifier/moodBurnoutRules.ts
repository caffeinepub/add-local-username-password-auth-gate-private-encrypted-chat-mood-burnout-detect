export interface ClassificationResult {
  mood: string;
  burnoutRisk: 'low' | 'medium' | 'high';
  supportiveResponse: string;
}

const BURNOUT_KEYWORDS = [
  'exhausted', 'tired', 'overwhelmed', 'stressed', 'burnout', 'burnt out',
  'drained', 'can\'t cope', 'too much', 'breaking point', 'giving up',
  'hopeless', 'helpless', 'anxious', 'depressed', 'struggling'
];

const NEGATIVE_MOOD_KEYWORDS = [
  'sad', 'angry', 'frustrated', 'upset', 'worried', 'scared', 'afraid',
  'lonely', 'isolated', 'worthless', 'failure', 'terrible', 'awful'
];

const POSITIVE_MOOD_KEYWORDS = [
  'happy', 'good', 'great', 'excited', 'hopeful', 'grateful', 'thankful',
  'better', 'improving', 'positive', 'optimistic'
];

export function classifyMoodAndBurnout(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  
  // Count keyword matches
  const burnoutMatches = BURNOUT_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const negativeMatches = NEGATIVE_MOOD_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const positiveMatches = POSITIVE_MOOD_KEYWORDS.filter(kw => lowerText.includes(kw)).length;

  // Determine burnout risk
  let burnoutRisk: 'low' | 'medium' | 'high' = 'low';
  if (burnoutMatches >= 3) {
    burnoutRisk = 'high';
  } else if (burnoutMatches >= 1 || negativeMatches >= 3) {
    burnoutRisk = 'medium';
  }

  // Determine mood
  let mood = 'neutral';
  if (positiveMatches > negativeMatches) {
    mood = 'positive';
  } else if (negativeMatches > positiveMatches) {
    mood = 'negative';
  }

  // Generate supportive response
  const supportiveResponse = generateSupportiveResponse(mood, burnoutRisk, text);

  return {
    mood,
    burnoutRisk,
    supportiveResponse,
  };
}

function generateSupportiveResponse(
  mood: string,
  burnoutRisk: 'low' | 'medium' | 'high',
  originalText: string
): string {
  if (burnoutRisk === 'high') {
    return "I hear that you're going through a really difficult time right now. What you're experiencing sounds overwhelming, and it's completely valid to feel this way. Please know that you don't have to face this alone. Taking care of your mental health is important, and reaching out for professional support can make a real difference.";
  }

  if (burnoutRisk === 'medium') {
    return "Thank you for sharing what's on your mind. It sounds like you're dealing with some challenging feelings right now. Remember that it's okay to not be okay, and seeking support is a sign of strength. Taking small steps to care for yourself can help, and professional guidance might provide valuable perspective.";
  }

  if (mood === 'positive') {
    return "It's wonderful to hear some positive energy in your message! While things may be going well, remember that maintaining your mental wellness is an ongoing journey. If you ever need support or just want to talk things through, professional guidance can be valuable at any stage.";
  }

  return "Thank you for sharing your thoughts. Everyone's mental health journey is unique, and it's important to check in with yourself regularly. Whether you're feeling great or facing challenges, having a professional to talk to can provide valuable insights and support.";
}
