# Rick and Morty Explorer

A small, dependency-free frontend that consumes the public [Rick and Morty API](https://rickandmortyapi.com/). Browse and search characters, open a detail page, save favourites, and attach a personal note to each saved character.

- **Live site:** https://frontend-project-zh5b.onrender.com/
- **Repository:** https://github.com/ykr1008/Frontend-Project

Built with plain HTML, CSS and vanilla JavaScript (ES modules). No framework and no build step, so **View Source on every page shows the real page structure**.

## The three views

| View | File | What it does |
|---|---|---|
| Browse | `index.html` | Grid of character cards, name search, status filter |
| Detail | `character.html?id=1` | One character's details, with a Save / Remove toggle |
| Saved | `saved.html` | Saved characters, with a per-character notes form and Remove |

Saved characters and notes persist in `localStorage` (key `rm-saved`), so they survive a refresh.

## Run it locally

ES modules do not work from `file://`, so serve the folder over HTTP:

```bash
npx serve .
```

or use the VS Code **Live Server** extension. No install step and no API key.

## Project structure

```
index.html, character.html, saved.html
css/styles.css
js/api.js        GraphQL client (list + single character)
js/images.js     builds the resized WebP image URL
js/storage.js    localStorage helpers, wrapped in try/catch
js/main.js       browse page: states, search, filter
js/character.js detail page
js/saved.js      saved page: notes form, remove
screenshots/     responsive screenshots
media/           screen recordings
reports/         Lighthouse reports (HTML)
```

## Requirement checklist

| # | Requirement | How it is met |
|---|---|---|
| 1 | Semantic HTML | Landmarks (`header`, `nav`, `main`, `footer`), skip link, `<label for>` on every control, `role="search"`, ordered headings (h1, h2, h3), `<ul>` of `<article>` cards, `<dl>` for label/value pairs, `<template>` for card markup, `role="status"` live region |
| 2 | Four states | Loading (skeleton cards), empty, error with Retry, success. Recording: [`media/states.mp4`](media/states.mp4) |
| 3 | Responsive | Mobile-first CSS, tested at 320, 768, 1024, 1440 and landscape phone (see below) |
| 4 | Keyboard only | Real `<button>`/`<a>` elements, `:focus-visible` outline on everything, focus moved to the page heading after Remove. Recording: [`media/keyboard-navigation.mp4`](media/keyboard-navigation.mp4) |
| 5 | Lighthouse 90+ | See the table below. Reports are in `reports/` |
| 6 | Zero console errors/warnings | See "Console notes" below |
| 7 | Images | Resized WebP, `width`/`height` set, lazy loading below the fold. Before/after numbers below |
| 8 | API key | No key is needed (see the API section) |

## The four states

On the Browse and Detail pages:

| State | How it is triggered | What the user sees |
|---|---|---|
| Loading | Request in flight | Skeleton cards and a "Loading characters..." message. The list is marked `aria-busy` |
| Success | Results returned | Cards plus "Showing 20 of 826 characters." |
| Empty | Search matches nothing (try `zzzzzz`) | "No characters match your search" |
| Error | Network failure or non-2xx response | Message with a **Retry** button |

The Saved page reads from `localStorage`, which is local and instant, so it has only empty ("You have not saved any characters yet") and success states. Loading and error do not apply to it.

## Responsive screenshots

Browse page at each size (taken in Chrome DevTools device mode):

| Size | Screenshot |
|---|---|
| 320 x 568 | [`screenshots/browse-320.png`](screenshots/browse-320.png) |
| 768 x 1024 | [`screenshots/browse-768.png`](screenshots/browse-768.png) |
| 1024 x 768 | [`screenshots/browse-1024.png`](screenshots/browse-1024.png) |
| 1440 x 900 | [`screenshots/browse-1440.png`](screenshots/browse-1440.png) |
| Landscape phone, 844 x 390 | [`screenshots/browse-landscape.png`](screenshots/browse-landscape.png) |

The card grid uses `repeat(auto-fill, minmax(min(100%, 10rem), 1fr))`, so it adds or removes columns without needing a breakpoint for each width, and the `min(100%, ...)` stops a card ever being wider than a 320px screen. A separate rule matches short landscape viewports (`max-height: 30em`) and tightens the header so content gets the space.

## Lighthouse

Run on the deployed site (not on a local dev server), in a Chrome Incognito window, **Mobile** preset with simulated throttling, Lighthouse 13.4.1.

| Page | Performance | Accessibility | Best Practices | SEO | Report |
|---|---|---|---|---|---|
| Browse | 98 | 100 | 100 | 100 | [`reports/lighthouse-browse-mobile.html`](reports/lighthouse-browse-mobile.html) |
| Detail | 96 | 100 | 100 | 100 | [`reports/lighthouse-detail-mobile.html`](reports/lighthouse-detail-mobile.html) |
| Saved (empty state) | 100 | 100 | 100 | 100 | [`reports/lighthouse-saved-empty-mobile.html`](reports/lighthouse-saved-empty-mobile.html) |

No score is below 90, so there is nothing to explain for the requirement. Two honest notes:

- **The Saved page was audited in its empty state.** Lighthouse starts each run with a clean browser profile and clears `localStorage`, so it can never see saved characters.
- **Detail page layout shift: fixed, 0.089 to 0.** The first audit showed a Cumulative Layout Shift of 0.089 (under Google's 0.1 threshold, but close). Lighthouse named the footer as the only shifting element: it sat near the top while the page loaded, then jumped down when the character data arrived. Giving the detail page's `<main>` a `min-height` of `100vh` (class `detail`) reserves the space up front, and the re-run reports a CLS of 0. Performance stayed at 96.

Key timings on the Browse page: First Contentful Paint 0.9 s, Largest Contentful Paint 2.1 s, Total Blocking Time 0 ms, Cumulative Layout Shift 0.

## Image optimisation and page weight

Measured on the Browse page in Chrome DevTools, Network tab: cache disabled, no throttling, same window size, first load.

| Metric | Before | After | Change |
|---|---|---|---|
| Total transferred | 666 kB | 158 kB | -76% |
| Images only | 650 kB (20 requests) | 140 kB (20 requests) | -78% |
| Total requests | 27 | 28 | +1 (the new `images.js` module) |
| Finish time | 1.79 s | 1.29 s | -0.5 s |
| DOMContentLoaded | 175 ms | 143 ms | -32 ms |

About 98% of the original page weight was images (about 32 kB each for a card that displays at roughly 160 to 200px wide). What changed:

1. **Resized WebP.** Images are requested through [images.weserv.nl](https://images.weserv.nl/) at 240px wide (300px on the detail and saved pages) in WebP at quality 75. A test image dropped from 39.9 kB (JPEG) to 8.5 kB (WebP), about 79% smaller.
2. **A fallback to the original URL.** If the resize service fails, an `error` handler loads the original image once, so images never break.
3. **Load order.** The first four cards load eagerly and the first one has `fetchpriority="high"`, since they are above the fold. The rest use `loading="lazy"`. Every image has `width` and `height`, which reserves space and prevents layout shift.
4. **`preconnect` hints** to the API and the image host, so connections open early.

**Trade-off:** routing images through a third-party service adds a dependency. The API serves fixed 300px JPEGs that cannot be recompressed from the front end. A small backend of my own (planned later in the course) would remove the third party.

## API choice and the "no key" note

The app uses the Rick and Morty API because it needs **no API key**, has CORS enabled, and supports server-side search and filtering. Because there is no key, nothing secret ships in the front-end code.

If an API did need a key, a key placed in front-end JavaScript is **public**: anyone can read it from View Source or the Network tab, and a leaked key can be abused or run up costs. The fix is a small backend proxy (which I will build later in the course). The browser calls my own endpoint, the server adds the key from an environment variable and forwards the request, and the key never reaches the browser. The proxy can also rate-limit and cache requests.

**Why GraphQL, not REST?** The REST endpoint returns an HTTP 404 when a search matches nothing. The browser itself logs a red console error for every 404, and JavaScript cannot suppress it. Since a search with no results is a normal event, I used the same API's GraphQL endpoint, which answers "no matches" with a normal `200` and an empty list. The empty state is therefore just `results.length === 0`, and the console stays clean.

## Console notes

On a normal load and while using the app, the console shows no errors. Two things can appear:

- **`ERR_INTERNET_DISCONNECTED` / `Failed to fetch`** appear only while I deliberately simulate the **Offline** network condition to demonstrate the error state. They are the browser reporting a genuine network failure, and JavaScript cannot suppress them. The error state handles them and offers Retry.
- **`[Intervention] Images loaded lazily and replaced with placeholders.`** This is the browser noting that below-the-fold images were deferred. It comes from `loading="lazy"`, which the assignment requires. In Chrome, with the Console filtered to Warnings only, the message does not appear, so it is not logged as a warning or error. It is only visible at the default or Info/Verbose levels.

## Accessibility details

- Skip link as the first focusable element, hidden until focused
- `aria-current="page"` on the active nav link
- `role="status"` live region announces loading, empty, error and "Note saved" messages without moving focus
- `aria-pressed` on the Save toggle
- Each note textarea has its own label ("Your note about Rick Sanchez") via a unique id
- After Remove deletes the focused button, focus moves to the page heading so keyboard users do not lose their place
- 44px minimum touch targets, and focus outlines on every interactive element
- `prefers-reduced-motion` turns off the skeleton shimmer
- All API and user text is written with `textContent`, never `innerHTML`, which prevents HTML injection

## Race conditions and input handling

- Search input is debounced (300 ms)
- Every request gets an id, and a response is ignored if a newer request has started, so a slow earlier response can never overwrite a newer result
- All `localStorage` reads and writes are wrapped in `try/catch` and fall back safely if storage is full, blocked or corrupted