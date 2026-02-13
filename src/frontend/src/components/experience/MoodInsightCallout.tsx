import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, Heart, Sparkles, Minus } from 'lucide-react';
import { MoodCategory } from '../../backend';
import { cn } from '@/lib/utils';

interface MoodInsightCalloutProps {
  category: MoodCategory;
  categoryLabel: string;
  reassuranceMessage: string;
  className?: string;
}

export default function MoodInsightCallout({
  category,
  categoryLabel,
  reassuranceMessage,
  className,
}: MoodInsightCalloutProps) {
  const { icon: Icon, colorClass, gradientClass } = getCategoryStyle(category);

  return (
    <Alert className={cn('popup-surface border-0', className)}>
      <Icon className={cn('h-5 w-5', colorClass)} />
      <AlertTitle className="flex items-center gap-2">
        <span className={cn('popup-text-gradient', gradientClass)}>Detected: {categoryLabel}</span>
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm leading-relaxed popup-text-high-contrast">
        {reassuranceMessage}
      </AlertDescription>
    </Alert>
  );
}

function getCategoryStyle(category: MoodCategory) {
  switch (category) {
    case MoodCategory.anxiety:
      return {
        icon: Brain,
        colorClass: 'text-yellow-600 dark:text-yellow-400',
        gradientClass: 'from-yellow-700 to-yellow-600 dark:from-yellow-400 dark:to-yellow-300',
      };
    case MoodCategory.depression:
      return {
        icon: Heart,
        colorClass: 'text-blue-600 dark:text-blue-400',
        gradientClass: 'from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300',
      };
    case MoodCategory.stress:
      return {
        icon: Brain,
        colorClass: 'text-orange-600 dark:text-orange-400',
        gradientClass: 'from-orange-700 to-orange-600 dark:from-orange-400 dark:to-orange-300',
      };
    case MoodCategory.positive:
      return {
        icon: Sparkles,
        colorClass: 'text-green-600 dark:text-green-400',
        gradientClass: 'from-green-700 to-green-600 dark:from-green-400 dark:to-green-300',
      };
    case MoodCategory.neutral:
    default:
      return {
        icon: Minus,
        colorClass: 'text-gray-600 dark:text-gray-400',
        gradientClass: 'from-gray-700 to-gray-600 dark:from-gray-400 dark:to-gray-300',
      };
  }
}
