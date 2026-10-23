# Self-review

Tested on the live site: https://frontend-project-zh5b.onrender.com/

## 1. Resize
**Tested:** dragged the width slowly from 1440 down to about 280px on Browse, Detail and Saved (with saved characters), plus 200% and 300% browser zoom and landscape phone (844 x 390) on all three pages.
**Found:** no horizontal scrollbar, clipped text or broken layout at any width.
**Fixed:** nothing needed.

## 2. Console
**Tested:** on the live site in Chrome Incognito, with Preserve log on. Loaded all three pages, searched (including `zzzzzz`, a long string, spaces and `<script>alert(1)</script>`), cycled the Status filter, saved and removed a character, opened `character.html` with a bad id, a letter id and no id, and retried after an Offline test.
**Found:** no errors or warnings. The only message is the `[Intervention]` info line about lazy-loaded images, which does not appear under the Warnings filter in Chrome (see README).
**Fixed:** nothing needed at this stage. Earlier in the build I found a red 404 in the console whenever a search had no results. The REST API returns a 404 for "no matches", and the browser logs it where JavaScript can't suppress it. I fixed it by moving to the API's GraphQL endpoint, which returns a normal 200 with an empty list.

## 3. Keyboard
**Tested:** Tab and Shift+Tab through every page, skip link on each page, search with Enter, Status select with arrow keys, Retry in the offline state, note form with Space/Enter, Remove, 200% zoom.
**Found:** (1) Focus ring visible and order correct throughout. (2) Only the character name was a link, so clicking a card's image did nothing. (3) No pagination: the page showed the first 20 of 826 characters, and the rest were unreachable by mouse or keyboard.
**Fixed:** (2) the whole card is now one click target, with a single focus ring around the card. (3) added Previous/Next with "Page X of Y"; the page resets to 1 on a new search or filter, and focus moves to the results heading after a page change.

## 4. Slow 3G
**Found:**
**Fixed:**

## 5. Lighthouse
**Found:**
**Fixed:**

## 6. View source
**Found:**
**Fixed:**