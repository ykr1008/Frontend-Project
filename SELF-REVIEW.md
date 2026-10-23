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
**Found:**
**Fixed:**

## 4. Slow 3G
**Found:**
**Fixed:**

## 5. Lighthouse
**Found:**
**Fixed:**

## 6. View source
**Found:**
**Fixed:**