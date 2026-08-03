<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/logo/logo-NMT-comfundo.svg">
  <source media="(prefers-color-scheme: light)" srcset="public/logo/logo-NMT-horizontal.svg">
  <img alt="Not My Typo" src="public/logo/logo-NMT-horizontal.svg" width="360">
</picture>

# NOT MY TYPO

<p><em>a monkeytype.com-style clone</em></p>

![react](https://img.shields.io/badge/react-black?style=flat-square&logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-black?style=flat-square&logo=typescript&logoColor=white)
![vite](https://img.shields.io/badge/vite-black?style=flat-square&logo=vite&logoColor=white)
![tailwindcss](https://img.shields.io/badge/tailwindcss-black?style=flat-square&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-black?style=flat-square&logo=pnpm&logoColor=white)

<picture>
  <a href="https://not-my-typo.vercel.app">
  <img alt="Not My Typo" src="public/misc/play-it-button.png" width="180px" >
  </a>
</picture>

## About

**Not My Typo** is a from-scratch clone of the [monkeytype.com](monkeytype.com) typing-test
experience: words stream across the screen, you type them, and the app tracks your words-per-minute,
accuracy, consistency, and misses.

It was built as a practice/learning project first, with an deep customization layer bolted
on second: themes, fonts, radius, caret style, keystroke sounds, and stat display are all first-class,
user-facing settings rather than an afterthought.

There is no account system, no backend, and no leaderboard. Everything runs client-side and persists
to `localStorage`.

## Preview

<picture>
  <img alt="Not My Typo" src="public/screenshots/screenshot3.png" >
</picture>

## Features

- **Four test modes**: fixed word count (30/60/90), timed (15s/30s/60s), zen (untimed, infinite), and
  quotes;
- **Live and final stats that can never disagree**: raw and correct-only WPM, accuracy, consistency, and miss count are computed by the same
  pure functions for both the running HUD and the results screen;
- **Six languages**: English, Portuguese (Brazil), French, Spanish, German, and Italian. Word lists
  are fetched live from a [free word API](https://random-word-api.herokuapp.com/home) and instantly fall back to bundled local word lists if that
  API is slow or unreachable, so a test never stalls or breaks mid-run;
- **Word rarity filter**: an optional difficulty dial (from very common to
  intentionally rare words);
- **Config-driven customization**: 14 color palettes, 11 font families (mono, sans, and serif),
  4 corner-radius presets, light/dark/system theme, 3 caret styles, and a mechanical-keyboard-style
  keystroke sound pack with adjustable volume.

<picture>
  <img alt="Not My Typo" src="public/screenshots/screenshot2.png" >
</picture>

## Tech stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [zustand](https://zustand.docs.pmnd.rs/) for the one piece of keystroke-rate state that needs to
  re-render independently of everything else
- [Phosphor Icons](https://phosphoricons.com/) and [Lucide](https://lucide.dev/)

---

Built and designed by [zenvv](https://github.com/zenvv) :-)
