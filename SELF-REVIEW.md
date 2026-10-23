# Self-review

I reviewed the deployed site the way an interviewer would, then fixed what I found.

Tested on the live site: https://frontend-project-zh5b.onrender.com/

| # | Check | Result |
|---|---|---|
| 1 | Resize | Nothing broke |
| 2 | Console | Clean (one earlier bug fixed during the build) |
| 3 | Keyboard | Two bugs found and fixed |
| 4 | Slow 3G | Nothing broke |
| 5 | Lighthouse | All 90+ everywhere |
| 6 | View source | Nothing left over |

## 1. Resize
**Tested:** dragged the width slowly from 1440 down to about 280px on Browse, Detail and Saved (with saved characters), plus 200% and 300% browser zoom and landscape phone (844 x 390) on all three pages.
**Found:** no horizontal scrollbar, clipped text or broken layout at any width.
**Fixed:** nothing needed.

## 2. Console
**Tested:** live site in Chrome Incognito with Preserve log on. Loaded all three pages, searched (including `zzzzzz`, a long string, spaces and `<script>alert(1)</script>`), cycled the Status filter, saved and removed a character, opened `character.html` with a bad id, a letter id and no id, and retried after an Offline test.
**Found:** no errors or warnings. The only message is the `[Intervention]` info line about lazy-loaded images, which does not appear under the Warnings filter in Chrome (see README).
**Fixed:** nothing needed at this stage. Earlier in the build I found a red 404 in the console whenever a search had no results. The REST API returns a 404 for "no matches", and the browser logs it where JavaScript cannot suppress it. I fixed it by moving to the API's GraphQL endpoint, which returns a normal 200 with an empty list.

## 3. Keyboard
**Tested:** Tab and Shift+Tab through every page, the skip link on each page, search with Enter, the Status select with arrow keys, Retry in the offline state, the note form with Space and Enter, Remove, and 200% zoom.
**Found:**
1. Focus ring visible and tab order correct throughout.
2. Only the character name was a link, so clicking a card's image did nothing.
3. No pagination: the page showed the first 20 of 826 characters and the rest were unreachable by mouse or keyboard.
4. After adding pagination, images on later pages briefly showed as placeholders. I could not reproduce it on retest, so I left the code unchanged. Likely causes are native lazy loading deferring below-the-fold images or a slow response from the image resize service; the `error` handler already falls back to the original image URL if that service fails.

**Fixed:**
- (2) The whole card is now one click target (a stretched link), with a single focus ring around the card.
- (3) Added Previous / Next with "Page X of Y". The page resets to 1 on a new search or filter, and focus moves to the results heading after a page change.

## 4. Slow 3G
**Tested:** live site in Chrome Incognito with DevTools Slow 3G and cache disabled. Hard reload of Browse, scrolling, a fast `rick` then `morty` search, Next and Previous, Offline during a slow load, and the Detail and Saved pages.
**Found:** the skeleton appeared after about __ s and cards with text after about __ s. No layout jumps, blank flashes or collapsed cards. The fast `rick` then `morty` search ended on Morty's results, so the request-id guard works.
**Fixed:** nothing needed.

## 5. Lighthouse
**Tested:** live site, Chrome Incognito. Browse (mobile and desktop), Detail (desktop) and the not-found page (mobile), re-run after adding pagination and clickable cards.
**Found:** all four categories were 90+ on every run.

| Run | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Browse, mobile | 99 | 100 | 100 | 100 |
| Browse, desktop | 97 | 100 | 100 | 100 |
| Detail, desktop | 95 | 100 | 100 | 100 |
| Not-found page, mobile | 100 | 100 | 100 | 100 |

The stretched-link cards did not affect accessibility. Desktop browse has a small CLS of 0.048, well under the 0.1 limit.
**Fixed:** earlier in the build, the first Lighthouse run on the Detail page showed a layout shift of 0.089 caused by the footer jumping down when data arrived. I reserved the page's height (`.detail { min-height: 100vh }`) and the re-run showed 0.

## 6. View source
**Tested:** Ctrl+U on all three pages of the live site, then a project-wide search for `console.log`, `TODO`, `debugger`, `test` and HTML comments. Checked ids for duplicates, `alt`, `width` and `height` on images, labels on every control, heading order, a distinct `<title>` and description per page, and `lang="en"`.
**Found:** nothing left over.
**Fixed:** nothing needed.