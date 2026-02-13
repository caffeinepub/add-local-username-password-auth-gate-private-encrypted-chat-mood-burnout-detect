import { MoodCategory } from '../../backend';

export interface ClassificationResult {
  category: MoodCategory;
  burnoutRisk: 'low' | 'medium' | 'high';
  shouldPromptTherapist: boolean;
}

const ANXIETY_KEYWORDS = [
  'anxious', 'anxiety', 'worried', 'nervous', 'panic', 'scared', 'afraid',
  'fear', 'terrified', 'overwhelmed', 'stressed', 'tense', 'uneasy'
];

const DEPRESSION_KEYWORDS = [
  'depressed', 'depression', 'sad', 'hopeless', 'helpless', 'worthless',
  'empty', 'numb', 'lonely', 'isolated', 'giving up', 'suicide', 'suicidal'
];

const STRESS_KEYWORDS = [
  'stressed', 'stress', 'exhausted', 'tired', 'burnout', 'burnt out',
  'drained', 'can\'t cope', 'too much', 'breaking point', 'overwhelmed'
];

const POSITIVE_KEYWORDS = [
  'happy', 'good', 'great', 'excited', 'hopeful', 'grateful', 'thankful',
  'better', 'improving', 'positive', 'optimistic', 'wonderful', 'amazing'
];

const NEGATIVE_KEYWORDS = [
  'angry', 'frustrated', 'upset', 'terrible', 'awful', 'horrible', 'bad'
];

export function classifyMoodAndBurnout(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  
  // Count keyword matches
  const anxietyMatches = ANXIETY_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const depressionMatches = DEPRESSION_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const stressMatches = STRESS_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const positiveMatches = POSITIVE_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
  const negativeMatches = NEGATIVE_KEYWORDS.filter(kw => lowerText.includes(kw)).length;

  // Determine primary category
  let category: MoodCategory = MoodCategory.neutral;
  const maxMatches = Math.max(anxietyMatches, depressionMatches, stressMatches, positiveMatches);
  
  if (maxMatches === 0) {
    // No strong keywords, check for general negative/positive
    if (negativeMatches > positiveMatches) {
      category = MoodCategory.stress;
    } else if (positiveMatches > 0) {
      category = MoodCategory.positive;
    }
  } else if (anxietyMatches === maxMatches) {
    category = MoodCategory.anxiety;
  } else if (depressionMatches === maxMatches) {
    category = MoodCategory.depression;
  } else if (stressMatches === maxMatches) {
    category = MoodCategory.stress;
  } else if (positiveMatches === maxMatches) {
    category = MoodCategory.positive;
  }

  // Determine burnout risk
  let burnoutRisk: 'low' | 'medium' | 'high' = 'low';
  const totalNegativeMatches = anxietyMatches + depressionMatches + stressMatches + negativeMatches;
  
  if (depressionMatches >= 2 || totalNegativeMatches >= 5) {
    burnoutRisk = 'high';
  } else if (totalNegativeMatches >= 2 || anxietyMatches >= 2 || stressMatches >= 2) {
    burnoutRisk = 'medium';
  }

  // Should prompt therapist if burnout risk is medium or high
  const shouldPromptTherapist = burnoutRisk === 'medium' || burnoutRisk === 'high';

  return {
    category,
    burnoutRisk,
    shouldPromptTherapist,
  };
}

// Classify from structured mood rating (e.g., 1-10 scale)
export function classifyFromMoodRating(rating: number): ClassificationResult {
  let category: MoodCategory = MoodCategory.neutral;
  let burnoutRisk: 'low' | 'medium' | 'high' = 'low';

  if (rating <= 3) {
    category = MoodCategory.depression;
    burnoutRisk = 'high';
  } else if (rating <= 5) {
    category = MoodCategory.stress;
    burnoutRisk = 'medium';
  } else if (rating <= 7) {
    category = MoodCategory.neutral;
    burnoutRisk = 'low';
  } else {
    category = MoodCategory.positive;
    burnoutRisk = 'low';
  }

  return {
    category,
    burnoutRisk,
    shouldPromptTherapist: burnoutRisk === 'medium' || burnoutRisk === 'high',
  };
}

// Classify from key/value entry
export function classifyFromEntry(key: string, value: string): ClassificationResult {
  const lowerKey = key.toLowerCase();
  const lowerValue = value.toLowerCase();

  // Check if key suggests a mood rating
  if (lowerKey.includes('mood') || lowerKey.includes('feeling') || lowerKey.includes('rating')) {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
      return classifyFromMoodRating(numericValue);
    }
  }

  // Otherwise treat value as free text
  return classifyMoodAndBurnout(value);
}
