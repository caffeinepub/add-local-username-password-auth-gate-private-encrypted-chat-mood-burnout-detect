import { MoodCategory } from '../backend';

// Client-side fallback reassurance templates
const FALLBACK_REASSURANCE_TEMPLATES: Record<MoodCategory, string[]> = {
  [MoodCategory.anxiety]: [
    "It's okay to feel anxious. Take a deep breath and remember you are not alone.",
    "This feeling will pass. Try to focus on what you can control right now.",
    "Acknowledging your anxiety is the first step to managing it.",
    "Consider reaching out to someone you trust for support.",
  ],
  [MoodCategory.depression]: [
    "Remember, you're not alone in this. There are people who care about you.",
    "It's okay to ask for help. Small steps count as progress.",
    "Try to be gentle with yourself today. You deserve compassion.",
    "Things can and do get better, even if it doesn't feel like it right now.",
  ],
  [MoodCategory.stress]: [
    "Stress is a natural response. Take a moment to breathe and regroup.",
    "Prioritize what needs to be done first, and don't hesitate to ask for help.",
    "Remember to take breaks and practice self-care.",
    "You've handled tough situations before, and you can do it again.",
  ],
  [MoodCategory.neutral]: [
    "It's perfectly normal to have ups and downs. Take things one step at a time.",
    "Reflect on your achievements, no matter how small.",
    "Maintaining balance is important. Try to incorporate activities you enjoy.",
    "Stay connected with supportive people in your life.",
  ],
  [MoodCategory.positive]: [
    "Keep up the good work! Remember to take time to celebrate your successes.",
    "Share your positivity with others – it can have a ripple effect.",
    "Gratitude practices can help maintain a positive outlook.",
    "Balance your positive energy with self-care and rest.",
  ],
};

// Client-side fallback insight templates
const FALLBACK_INSIGHT_TEMPLATES: Record<MoodCategory, string[]> = {
  [MoodCategory.anxiety]: [
    "Identify specific triggers for your anxiety and develop coping strategies.",
    "Mindfulness practices can help ground you in the present moment.",
    "Regular exercise has been shown to reduce anxiety symptoms.",
    "Maintaining a healthy sleep routine can improve anxiety management.",
  ],
  [MoodCategory.depression]: [
    "Regular physical activity can help alleviate depressive symptoms.",
    "Connecting with supportive people can improve your mood.",
    "Setting small achievable goals can help you feel more in control.",
    "Therapeutic techniques like CBT have proven effective for depression.",
  ],
  [MoodCategory.stress]: [
    "Effective time management can help reduce stress levels.",
    "Physical activity and relaxation techniques can combat stress.",
    "Healthy communication can prevent misunderstandings and stress.",
    "Mindfulness meditation is a proven stress-reduction method.",
  ],
  [MoodCategory.neutral]: [
    "Keeping a journal can help track and understand your feelings.",
    "Mindfulness can increase awareness and emotional stability.",
    "Trying new hobbies can improve overall life satisfaction.",
    "Listening to others' experiences can help you learn and grow.",
  ],
  [MoodCategory.positive]: [
    "Practicing gratitude has been shown to increase happiness.",
    "Physical exercise can enhance mood delivery.",
    "Helping others is linked to increased personal joy.",
    "Building good habits strengthens well-being.",
  ],
};

export function pickRandomTemplate(templates: string[]): string {
  if (templates.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export function getFallbackReassuranceTemplate(category: MoodCategory): string {
  const templates = FALLBACK_REASSURANCE_TEMPLATES[category] || FALLBACK_REASSURANCE_TEMPLATES[MoodCategory.neutral];
  return pickRandomTemplate(templates);
}

export function getFallbackInsightTemplate(category: MoodCategory): string {
  const templates = FALLBACK_INSIGHT_TEMPLATES[category] || FALLBACK_INSIGHT_TEMPLATES[MoodCategory.neutral];
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
