# Aquib Mahmood — portfolio

A local-first React/TypeScript portfolio with an original Context Constellation, résumé-grounded case studies, self-hosted typography, dark/light themes, and accessible project and command dialogs. No backend, analytics, authentication, or AI API is used.

## Run

Use Node 26.11.1 (`.nvmrc`) and npm 11.20.0. Dependencies and a production build are included in the delivered local directory. For a clean checkout:

```sh
npm ci
npm run dev
```

Open the printed local address, normally http://127.0.0.1:5173. The port is strict: stop an existing server or explicitly choose a free port rather than accidentally testing another process.

```sh
npm run typecheck
npm run build
npm run preview
```

Production output is `dist/`; `npm run preview` serves it at http://127.0.0.1:4173. Static hosting will need an SPA fallback to `index.html` for the application routes. No deployment is configured or performed.

## Content and design

`src/content.ts` is the single content authority used by the constellation, cards, palette, filters and detail views. Edit the typed records there. Employer work is distinguished from the personal EasySLR project; only EasySLR has source/demo URLs because those are the project links supplied in the résumé.

The supplied `Aquib-Mahmood-Resume.pdf` is bundled unchanged. Its original phone number remains inside the downloadable document, although the webpage does not separately display it. Reported metrics are from that résumé, not independently audited measurements.

`src/styles.css` owns the visual tokens, editorial shell, responsive composition and reduced-motion rules. Illustrations and the AM identity are authored SVG/HTML, not screenshots of internal employer products. There are no third-party visitor counters, blank writing pages, stock portraits or copied personal photos.

Fonts are self-hosted in `public/fonts`; original licenses are retained in `public/licenses`. Sources:

- Amiamie: https://gitlab.com/Mirat-Masson1/Amiamie-Typeface (OIFL, original License.txt retained).
- Instrument Serif: https://github.com/google/fonts/tree/main/ofl/instrumentserif (OFL).
- JetBrains Mono: https://github.com/JetBrains/JetBrainsMono (OFL).

The visual reference is the previously analysed Harshit portfolio. Its fonts, palette and narrow editorial composition informed this implementation; the interactive concept, diagrams, copy and identity were authored for Aquib.

## Interactions

- Constellation: choose a theme; select the three nodes in any order; open the related work. Replay and theme switching reset progress. It is a content exploration, not a live AI system.
- Work: `search`, `category` and `project` are URL query parameters. Filters combine and survive reload; opening and closing a case study preserves them.
- Command palette: Cmd/Ctrl+K, arrow keys and Enter. Search navigation, work, theme, email, résumé and animation actions.
- Dialogs: native modal dialogs provide background inertness; explicit Tab wrapping, Escape, backdrop dismissal, scroll locking and focus restoration are included.
- Motion: OS reduced-motion is respected, and an explicit pause control is available in the header and constellation. Ambient star animation and role rotation pause when offscreen/hidden. Theme changes use View Transitions where available.
- Contact: direct mailto links and clipboard feedback. No simulated form submission.

## Verification

See `verification/REPORT.md` and the JPEG captures in that directory for executed checks and limitations. The production build and TypeScript check passed. Sixteen Playwright tests are included; discovery passed, but execution was not approved in the implementation session. **The Playwright suite has not been reported as passing.**

To run it yourself with Google Chrome installed, first start the local server in a separate terminal, then:

```sh
npm test
```

The config uses the installed `chrome` channel and does not download a browser. The test suite covers route rendering, constellation themes, URL state, keyboard palette selection, modal focus, clipboard outcomes, reduced motion, fallbacks and four responsive widths. Automated captures and HTML reports are generated when the suite runs.
