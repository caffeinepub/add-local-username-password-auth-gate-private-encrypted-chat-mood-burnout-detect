import { MoodCategory } from '../backend';

// Client-side fallback templates (used if backend fetch fails)
const FALLBACK_TEMPLATES: Record<MoodCategory, string[]> = {
  [MoodCategory.anxiety]: [
    "It's okay to feel anxious. Take a deep breath and remember you are not alone.",
    "This feeling will pass. Try to focus on what you can control right now.",
    "Acknowledging your anxiety is the first step to managing it.",
  ],
  [MoodCategory.depression]: [
    "Remember, you're not alone in this. There are people who care about you.",
    "It's okay to ask for help. Small steps count as progress.",
    "Try to be gentle with yourself today. You deserve compassion.",
  ],
  [MoodCategory.stress]: [
    "Stress is a natural response. Take a moment to breathe and regroup.",
    "Prioritize what needs to be done first, and don't hesitate to ask for help.",
    "Remember to take breaks and practice self-care.",
  ],
  [MoodCategory.neutral]: [
    "It's perfectly normal to have ups and downs. Take things one step at a time.",
    "Reflect on your achievements, no matter how small.",
    "Maintaining balance is important. Try to incorporate activities you enjoy.",
  ],
  [MoodCategory.positive]: [
    "Keep up the good work! Remember to take time to celebrate your successes.",
    "Share your positivity with others – it can have a ripple effect.",
    "Gratitude practices can help maintain a positive outlook.",
  ],
};

export function pickRandomTemplate(templates: string[]): string {
  if (templates.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export function getFallbackTemplate(category: MoodCategory): string {
  const templates = FALLBACK_TEMPLATES[category] || FALLBACK_TEMPLATES[MoodCategory.neutral];
  return pickRandomTemplate(templates);
}

export function getCategoryLabel(category: MoodCategory): string {
  switch (category) {
    case MoodCategory.anxiety:
      return 'Anxiety';
    case MoodCategory.depression:
      return 'Depression';
    case MoodCategory.stress:
      return 'Stress';
    case MoodCategory.positive:
      return 'Positive';
    case MoodCategory.neutral:
      return 'Neutral';
    default:
      return 'Neutral';
  }
}

export function getCategoryColor(category: MoodCategory): string {
  switch (category) {
    case MoodCategory.anxiety:
      return 'text-yellow-500';
    case MoodCategory.depression:
      return 'text-blue-500';
    case MoodCategory.stress:
      return 'text-orange-500';
    case MoodCategory.positive:
      return 'text-green-500';
    case MoodCategory.neutral:
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
}
