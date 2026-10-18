# Implementation verification — 18 October 2026

## Executed

- `npm run typecheck`: passed.
- `npm run build`: passed; production Vite output emitted successfully.
- `npm test -- --list`: discovered 16 tests without executing a browser.
- Direct content integrity check: three unique case studies, two employers, five skill groups, valid HTTPS external URL syntax, and a byte-identical copy of the supplied résumé.
- Font file signatures checked: genuine TTF/WOFF2; license text retained for all three typefaces.

## Browser observations

Performed in Codex's in-app browser using its Playwright locators and native accessibility/screenshot APIs, against the local Vite application.

- Home, work, experience, contact and custom 404 rendered.
- All three constellation themes completed and produced the correct case-study URL; replay/theme changes reset progress.
- Local AI and EasySLR detail dialogs opened; Escape closed them. Shift+Tab from the first case-study control wrapped to Back to work; closing restored focus to an appropriate initiating control/card.
- Searching EasySLR in the command palette and pressing Enter opened EasySLR's details.
- Python search plus Research Platforms category produced the intentional empty state; resetting restored all three cards.
- Direct URL search/category values survived reload. Opening/closing a filtered card preserved the filter URL and Python input. Browser Back reopened the preceding detail state.
- Dark and light themes rendered; light theme survived a full reload. Computed heading/body font families matched Instrument Serif and Amiamie.
- Mobile navigation opened and navigated to Contact, then dismissed. Contact's copy-email control displayed Email copied.
- The 404 Home link returned to the home page.
- Animation pause changed the document motion mode to reduced.
- Home viewport widths of 320, 390, 768 and 1440px had matching document scrollWidth/clientWidth after the registration-mark fix: no horizontal page overflow at these samples.
- Mobile long-form case study and contact layouts visually inspected. Browser console inspection returned no captured warnings or errors in the inspected session.

JPEG captures record home layouts, both themes, selected work and case-study/experience views. They are viewport captures rather than a claim of exhaustive visual coverage.

## Limits

The headless `npm test` execution was rejected at the permission step; no tests ran and there is no automated pass count. The suite was subsequently listed only, not rerun through another launch mechanism.

Runtime clipboard failure, unavailable View Transitions, OS-level reduced-motion changes, browser storage denial and missing font responses are implemented/test-authored but were not independently exercised in this session. Desktop viewport resizing does not establish real iOS/Android touch-device behavior. External destination availability was not exhaustively checked, and no email was sent. No deployment, Lighthouse run, cross-browser sweep or CPU/memory benchmark was performed.
