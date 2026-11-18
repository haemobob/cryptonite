# Cryptonite

Landing page for **Cryptonite**, an Indonesian crypto media brand (Instagram, Facebook, Threads).

Built with Next.js 16, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis smooth scroll and a small three.js shader.

```bash
npm install
npm run dev
```

## What's where

- `src/components/HalftoneStage.tsx` — WebGL halftone of the hero photos in brand blue; the cursor reveals the real photo.
- `src/lib/data.ts` — all copy, stories, radar topics and social links. **Everything in it is placeholder content** — replace before launch.
- `public/media/` — photos from [Unsplash](https://unsplash.com) (Unsplash License).
- `public/logo-alpha.png`, `public/gem.png` — derived from the Cryptonite logo.

The price ticker tries CoinGecko's public API in the visitor's browser and falls back to sample prices labelled "Contoh".

Project scaffold from [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) (MIT, see `LICENSE`).
