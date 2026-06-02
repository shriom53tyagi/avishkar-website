# Branding assets

The logo currently renders as an inline SVG mark in `components/ui/Logo.tsx`
(the cyan→violet→emerald "A"). No logo image file was provided, so nothing in
this folder is required for the site to run.

## To use a real logo image instead

1. Drop your file here, e.g. `public/logo.svg` (or `logo.png`).
2. In `components/ui/Logo.tsx`, replace the inline `<svg>…</svg>` block with:

   ```tsx
   import Image from "next/image";
   // …
   <Image src="/logo.svg" alt="Avishkar" width={28} height={28} priority />
   ```

Files placed in `public/` are served from the site root (`/logo.svg`).

## Social links

Footer social icons live in `lib/data.ts` under `SOCIAL_LINKS` — update the
`href` values with your real LinkedIn / X / GitHub / YouTube handles.
