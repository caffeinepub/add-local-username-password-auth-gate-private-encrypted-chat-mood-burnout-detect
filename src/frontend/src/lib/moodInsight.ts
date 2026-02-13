import { MoodCategory } from '../backend';
import { pickRandomTemplate, getFallbackReassuranceTemplate, getFallbackInsightTemplate, getCategoryLabel } from './moodPresets';

export interface MoodInsight {
  category: MoodCategory;
  categoryLabel: string;
  reassuranceMessage: string;
  insightMessage?: string;
}

export interface MoodTemplateSelection {
  reassurance: string;
  insight: string;
}

/**
 * Select one reassurance and one insight from backend templates or fallbacks
 */
export function selectMoodTemplates(
  category: MoodCategory,
  backendTemplates: { reassuranceTemplates: string[]; insightTemplates: string[] } | null
): MoodTemplateSelection {
  let reassurance: string;
  let insight: string;

  // Select reassurance
  if (backendTemplates?.reassuranceTemplates && backendTemplates.reassuranceTemplates.length > 0) {
    reassurance = pickRandomTemplate(backendTemplates.reassuranceTemplates);
  } else {
    reassurance = getFallbackReassuranceTemplate(category);
  }

  // Select insight
  if (backendTemplates?.insightTemplates && backendTemplates.insightTemplates.length > 0) {
    insight = pickRandomTemplate(backendTemplates.insightTemplates);
  } else {
    insight = getFallbackInsightTemplate(category);
  }

  return { reassurance, insight };
}

/**
 * Generate mood insight for display (legacy function for backward compatibility)
 */
export function generateMoodInsight(
  category: MoodCategory,
  templates: string[] | null
): MoodInsight {
  let reassuranceMessage: string;

  if (templates && templates.length > 0) {
    reassuranceMessage = pickRandomTemplate(templates);
  } else {
    // Fallback if templates are unavailable
    reassuranceMessage = getFallbackReassuranceTemplate(category);
  }

  const categoryLabel = getCategoryLabel(category);

  return {
    category,
    categoryLabel,
    reassuranceMessage,
  };
}
