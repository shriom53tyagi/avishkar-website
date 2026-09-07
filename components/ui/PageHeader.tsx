import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Shared header for every page below the home page. Deliberately plain: a
 * label, a headline, one supporting paragraph, no hero furniture.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** CTA row or status line, rendered under the description. */
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-canvas pb-14 pt-14 md:pb-20 md:pt-20">
      <Container>
        <div className="max-w-measure">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-h1 text-ink">{title}</h1>
          {description && (
            <p className="mt-5 text-lead text-ink-muted">{description}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
