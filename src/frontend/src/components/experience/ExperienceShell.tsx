import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ZoomTransition from '../motion/ZoomTransition';

interface ExperienceShellProps {
  children: ReactNode;
  className?: string;
}

export default function ExperienceShell({ children, className }: ExperienceShellProps) {
  return (
    <ZoomTransition>
      <div
        className={cn(
          'glass-card p-6 md:p-8 max-w-6xl mx-auto',
          className
        )}
      >
        {children}
      </div>
    </ZoomTransition>
  );
}
