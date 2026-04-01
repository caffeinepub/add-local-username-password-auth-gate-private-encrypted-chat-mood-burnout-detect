import { MoodCategory } from "../backend";

/**
 * Client-side fallback templates (used if backend fetch fails)
 *
 * This update intentionally includes only the first nine user-provided presets
 * as medium-length reassurance templates (and no additional presets), to keep
 * scope constrained and avoid runaway template expansion.
 *
 * The nine presets are:
 * 1. Happiness → positive
 * 2. Sadness → depression
 * 3. Anger → stress
 * 4. Fear → anxiety
 * 5. Disgust → neutral
 * 6. Surprise → neutral
 * 7. Joyful → positive
 * 8. Anxious/Stressed → anxiety
 * 9. Irritable/Angry → stress
 */
const FALLBACK_TEMPLATES: Record<MoodCategory, string[]> = {
  [MoodCategory.anxiety]: [
    "It's okay to feel anxious. Take a deep breath and remember you are not alone.",
    "This feeling will pass. Try to focus on what you can control right now.",
    "Acknowledging your anxiety is the first step to managing it.",
    // New medium-length templates (Fear, Anxious/Stressed)
    "Fear and anxiety are natural protective responses, but they don't have to control your day. Take a moment to ground yourself in the present, notice what's around you, and remind yourself that you have the strength to face whatever comes next.",
    "When anxiety or apprehension builds, it can feel overwhelming. Remember that these feelings are temporary, and you have tools to manage them. Reach out to someone you trust, practice deep breathing, or engage in an activity that brings you calm.",
    "Feeling anxious or stressed is a sign that your mind is processing a lot right now. Be patient with yourself, take things one step at a time, and don't hesitate to seek support when you need it. You're doing better than you think.",
  ],
  [MoodCategory.depression]: [
    "Remember, you're not alone in this. There are people who care about you.",
    "It's okay to ask for help. Small steps count as progress.",
    "Try to be gentle with yourself today. You deserve compassion.",
    // New medium-length templates (Sadness)
    "Sadness, melancholy, and grief are all part of the human experience. It's okay to feel these emotions deeply. Allow yourself the space to process them without judgment, and remember that brighter days will come, even if they feel distant right now.",
    "When sadness weighs heavy on your heart, it can be hard to see a way forward. But you are not alone in this feeling. Reach out to loved ones, engage in gentle self-care, and remind yourself that healing takes time. You are worthy of support and compassion.",
    "Nostalgia and longing for the past can bring both comfort and pain. Honor these feelings as part of your journey, but also try to stay present and open to new experiences. Your story is still being written, and there is hope ahead.",
  ],
  [MoodCategory.stress]: [
    "Stress is a natural response. Take a moment to breathe and regroup.",
    "Prioritize what needs to be done first, and don't hesitate to ask for help.",
    "Remember to take breaks and practice self-care.",
    // New medium-length templates (Anger, Irritable/Angry)
    "Anger and frustration are valid emotions that signal something needs attention. Instead of suppressing these feelings, try to understand what's triggering them. Take a step back, breathe deeply, and consider healthy ways to express and release this energy.",
    "When irritability or aggression surfaces, it's often a sign of underlying stress or unmet needs. Acknowledge these feelings without judgment, and explore constructive outlets like physical activity, journaling, or talking to someone you trust. You have the power to channel this energy positively.",
    "Feeling annoyed or disappointed is a natural part of life, especially when things don't go as planned. Give yourself permission to feel these emotions, then shift your focus to what you can control. Small acts of self-compassion can make a big difference in how you navigate these moments.",
  ],
  [MoodCategory.neutral]: [
    "It's perfectly normal to have ups and downs. Take things one step at a time.",
    "Reflect on your achievements, no matter how small.",
    "Maintaining balance is important. Try to incorporate activities you enjoy.",
    // New medium-length templates (Disgust, Surprise)
    "Feelings of aversion or repulsion can be uncomfortable, but they often serve as important signals about your boundaries and values. Honor these feelings, and take steps to distance yourself from situations or influences that don't align with your well-being.",
    "Surprise and astonishment can shake up our sense of stability, whether the surprise is positive or challenging. Take a moment to process what's happened, and allow yourself to adjust at your own pace. Change can be an opportunity for growth, even when it feels unexpected.",
    "Neutral or indifferent moods are a natural part of life's rhythm. Use this time to check in with yourself, maintain healthy routines, and stay open to new experiences. Balance and stability are valuable, and they provide a foundation for future growth.",
  ],
  [MoodCategory.positive]: [
    "Keep up the good work! Remember to take time to celebrate your successes.",
    "Share your positivity with others – it can have a ripple effect.",
    "Gratitude practices can help maintain a positive outlook.",
    // New medium-length templates (Happiness, Joyful)
    "Happiness, contentment, and joy are precious gifts. Savor these moments, share them with others, and let them remind you of the good that exists in your life. Gratitude for these feelings can help them last even longer.",
    "When you feel joyful, delighted, or full of love, embrace it fully. These positive emotions nourish your spirit and strengthen your connections with others. Celebrate the things that bring you happiness, and let this energy inspire you to keep moving forward.",
    "Gratification and tenderness are signs that you're aligned with what matters most to you. Take time to appreciate these feelings, and consider how you can cultivate more of them in your daily life. You deserve to experience joy and fulfillment.",
  ],
};

export function pickRandomTemplate(templates: string[]): string {
  if (!templates || templates.length === 0) return "";
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export function getFallbackTemplate(category: MoodCategory): string {
  const templates =
    FALLBACK_TEMPLATES[category] || FALLBACK_TEMPLATES[MoodCategory.neutral];
  return pickRandomTemplate(templates);
}

export function getCategoryLabel(category: MoodCategory): string {
  switch (category) {
    case MoodCategory.anxiety:
      return "Anxiety";
    case MoodCategory.depression:
      return "Depression";
    case MoodCategory.stress:
      return "Stress";
    case MoodCategory.positive:
      return "Positive";
    case MoodCategory.neutral:
      return "Neutral";
    default:
      return "Neutral";
  }
}

export function getCategoryColor(category: MoodCategory): string {
  switch (category) {
    case MoodCategory.anxiety:
      return "text-yellow-500";
    case MoodCategory.depression:
      return "text-blue-500";
    case MoodCategory.stress:
      return "text-orange-500";
    case MoodCategory.positive:
      return "text-green-500";
    case MoodCategory.neutral:
      return "text-slate-300";
    default:
      return "text-slate-300";
  }
}
