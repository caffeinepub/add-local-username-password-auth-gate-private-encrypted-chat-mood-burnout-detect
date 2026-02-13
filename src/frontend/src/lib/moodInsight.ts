import { MoodCategory } from '../backend';
import { pickRandomTemplate, getFallbackTemplate } from './moodPresets';

export interface MoodInsight {
  category: MoodCategory;
  categoryLabel: string;
  reassuranceMessage: string;
}

export function generateMoodInsight(
  category: MoodCategory,
  templates: string[] | null
): MoodInsight {
  let reassuranceMessage: string;

  if (templates && templates.length > 0) {
    reassuranceMessage = pickRandomTemplate(templates);
  } else {
    // Fallback if templates are unavailable
    reassuranceMessage = getFallbackTemplate(category);
  }

  const categoryLabel = getCategoryLabelForInsight(category);

  return {
    category,
    categoryLabel,
    reassuranceMessage,
  };
}

function getCategoryLabelForInsight(category: MoodCategory): string {
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
