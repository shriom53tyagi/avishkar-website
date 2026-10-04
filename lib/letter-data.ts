/**
 * Issues of The Avishkar Letter. None published yet, so /letter has no
 * past-issues section and /letter/[slug] has no pages. Add issues here
 * (and a "Past issues" section back on LetterPage) when the first one ships.
 */
export type Issue = {
  slug: string;
  number: string;
  month: string;
  title: string;
  teaser: string;
  bodyHtml: string;
};

export const ISSUES: Issue[] = [];

export function getIssue(slug: string): Issue | undefined {
  return ISSUES.find((i) => i.slug === slug);
}
