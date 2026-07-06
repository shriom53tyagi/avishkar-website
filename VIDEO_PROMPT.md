# Avishkar AI — Landing-Page Hero Video Prompt

A Ramp-style **product-demo video** for the hero. The goal is a clean, premium,
screen-recording-feeling animation (not live-action) that tells the audit-first
story in ~12–20 seconds and loops seamlessly.

Works with: **Sora, Runway Gen-3, Kling, Luma Dream Machine, Pika, Google Veo.**
Use the "Master prompt" first; the per-shot breakdown is for tools that accept
multi-shot / keyframe input.

---

## Master prompt (paste this)

> A sleek, minimal **product-demo animation** for a healthcare revenue-intelligence
> SaaS called **Avishkar AI**, in the visual style of ramp.com's hero video. Clean
> **warm off-white (#FBFAF7) background** with a faint dotted grid. A single
> floating **glassmorphic dashboard window** sits center-frame with soft rounded
> corners and a subtle drop shadow. The UI animates like a real screen recording,
> driven by a smooth animated cursor.
>
> Sequence: (1) the cursor clicks **"Run Audit"** and a soft **cyan scan line**
> sweeps across a network of connected system nodes labeled *EMR, Billing,
> Scheduling, Voice AI, Follow-up*; (2) small red **"revenue leak" cards** fly in
> and stack neatly — *No-shows $1.84M, Denials $1.12M, Call drop-off $0.61M* — as a
> big counter **counts up to $4.2M**; (3) the leak cards flip to **green "agent
> deployed"** chips with checkmarks; (4) a **revenue line chart sweeps upward** and
> the headline number settles on **"$4.2M recovered."**
>
> Color palette: warm ivory background, **cyan #0891B2** and **emerald #059669**
> accents, deep navy text, soft red for problems. Motion: gentle ease-in-out,
> elements glide and settle with light spring physics, micro-parallax depth.
> Aesthetic: Apple-keynote-clean, premium fintech, lots of whitespace, crisp
> Inter-style typography, no clutter, no stock people. 4K, 30fps, seamless loop,
> shallow depth of field, soft studio lighting. **No text artifacts, no gibberish
> UI labels, no watermarks.**

---

## Per-shot breakdown (for keyframe / multi-clip tools)

**Shot 1 — Scan (0–4s)**
Floating dashboard on ivory. Cursor clicks a cyan "Run Audit" button. A glowing
cyan scan line sweeps left-to-right over 6 connected nodes (EMR, Billing,
Scheduling, Voice AI, Intake, Follow-up). Nodes light up cyan one by one. Calm,
confident pace.

**Shot 2 — Detect (4–9s)**
Four red-tinted "leak" cards fly in from the right and stack: *Missed appointments
$1.84M*, *Claim denials $1.12M*, *Call drop-off $0.61M*, *Documentation $0.63M*.
A large headline counter rolls up from $0 to **$4.2M / yr**. Subtle red glow.

**Shot 3 — Deploy (9–14s)**
The red cards smoothly flip / morph into **emerald green chips** with checkmarks:
*Patient Access · live*, *Revenue Recovery · live*, *Clinical Ops · live*,
*Engagement · live*. A small "12 agents live" badge pulses.

**Shot 4 — Recover (14–19s)**
An emerald revenue line chart sweeps upward filling with a soft gradient. Headline
resolves to **"$4.2M recovered · 12 weeks to impact."** Everything settles; the
frame holds for a beat, then gently resets for a seamless loop.

---

## Negative prompt (if supported)
`live-action people, faces, hospital footage, photorealistic humans, cluttered UI,
distorted text, gibberish letters, watermark, logo, low contrast, dark background,
shaky camera, harsh flashing`

---

## How to add the finished video to the site

1. Export as **MP4 (H.264)** and a **WebM** fallback; keep it muted-autoplay-safe
   and ideally < 6 MB (it loops). Add a **poster.jpg** first frame.
2. Drop files in `public/`: `public/hero-demo.mp4`, `public/hero-demo.webm`,
   `public/hero-demo-poster.jpg`.
3. In `components/sections/Hero.tsx`, replace the `<ProductDemo />` inside the
   demo canvas with:

   ```tsx
   <video
     className="w-full rounded-2xl"
     autoPlay
     muted
     loop
     playsInline
     poster="/hero-demo-poster.jpg"
   >
     <source src="/hero-demo.webm" type="video/webm" />
     <source src="/hero-demo.mp4" type="video/mp4" />
   </video>
   ```

   (Keep `ProductDemo` as the reduced-motion / no-video fallback if you like.)
4. No `next.config` change needed for local files in `public/`.
