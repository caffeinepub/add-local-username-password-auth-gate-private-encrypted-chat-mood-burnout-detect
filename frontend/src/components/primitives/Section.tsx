import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ eyebrow, title, description, children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-20 px-4', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          {(eyebrow || title || description) && (
            <div className="text-center mb-16 space-y-4">
              {eyebrow && (
                <p className="text-sm font-semibold text-accent uppercase tracking-wider">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="section-headline text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="section-body text-muted-foreground max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
