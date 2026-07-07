import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Section({ eyebrow, title, children, className, contentClassName }: SectionProps) {
  return (
    <section className={cn("px-5 py-20 sm:px-8 lg:px-12 lg:py-28", className)}>
      <div className={cn("mx-auto max-w-7xl", contentClassName)}>
        {(eyebrow || title) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="mb-4 text-xs uppercase tracking-luxe text-gold">{eyebrow}</p>}
            {title && (
              <h2 className="font-display text-4xl uppercase leading-none tracking-wider text-ink sm:text-5xl lg:text-6xl">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
