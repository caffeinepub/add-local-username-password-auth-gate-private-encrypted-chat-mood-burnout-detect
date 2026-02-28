import { MoodCategory } from '../backend';
import { pickRandomTemplate, getFallbackTemplate } from './moodPresets';

export interface MoodInsight {
  category: MoodCategory;
  categoryLabel: string;
  reassuranceMessage: string;
}

export function generateMoodInsight(
  category: MoodCategory,
  templates: string[] | null | undefined
): MoodInsight {
  let reassuranceMessage: string;

  // Harden template selection to handle empty/undefined arrays
  if (templates && Array.isArray(templates) && templates.length > 0) {
    reassuranceMessage = pickRandomTemplate(templates);
  } else {
    // Fallback if templates are unavailable, empty, or invalid
    reassuranceMessage = getFallbackTemplate(category);
  }

  // Ensure we always have a message
  if (!reassuranceMessage) {
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
