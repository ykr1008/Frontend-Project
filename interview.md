# Interview simulation

Live site: https://frontend-project-zh5b.onrender.com/

## 1. What does it do?

It lets you search and filter Rick and Morty characters, open any one for details, and save your favourites with a personal note that is still there when you come back.

## 2. Walk me through the structure. Why these components?

There are three real HTML pages: Browse (`index.html`), Detail (`character.html`) and Saved (`saved.html`). I used plain HTML, CSS and ES modules with no framework, because the brief said a reviewer should understand the page from View Source, and a framework would show an empty `<div id="root">`.

Each module has one job. `api.js` is the only file that talks to the network. `storage.js` is the only file that touches `localStorage`. `images.js` builds the resized image URLs. Each page has one script that controls it. Inside those scripts every UI state is its own function (`showLoading`, `showEmpty`, `showError`, `showSuccess`), and each one replaces what's on screen, so two states can never show at once. Cards come from a `<template>`, so the card markup is readable in View Source even though JavaScript fills it in.

## 3. Why those breakpoints?

I only have two width breakpoints, because I only added one where the layout actually changes. At 48em (768px) the detail page goes from one column to image-plus-details. At 80em (1280px) the browse cards get a larger minimum width. There is also a height-based rule for short landscape phones, which tightens the header.

The card grid needs no breakpoints, because `auto-fill` with `minmax(min(100%, 10rem), 1fr)` adds and removes columns by itself. I tested at 320, 768, 1024, 1440 and landscape (844 x 390), but those are the widths I checked, not the breakpoints.

## 4. What happens on a slow connection? Show me.

On Slow 3G the page shows grey skeleton cards straight away, and the list is marked `aria-busy`. Typing is debounced by 300 ms. Each request gets an id, and an older response is ignored if a newer one has started, so typing `rick` then quickly `morty` always ends on Morty. If the request fails, the user gets an error message with a Retry button.

On images, the first four cards load immediately and the rest are lazy. They are resized WebP, and every image has width and height, so nothing jumps. On Slow 3G the skeleton appeared after about [FILL IN] s and the first cards after about [FILL IN] s.

## 5. Tab through it and talk me through the screen-reader experience.

The first Tab stop is a skip link that jumps past the navigation. Then comes the nav, where the current page is marked `aria-current`. Next are the search box and the status select, each with a real `<label>`. Results are a list of articles, with one link per card, the character's name. When results change, a `role="status"` message announces something like "Showing 20 of 826 characters" without moving focus. After using Next or Previous, focus moves to the Results heading, because the button you pressed disappears during loading.

On the detail page, the Save button is a toggle that uses `aria-pressed`. On the Saved page, each note field has its own label ("Your note about Rick Sanchez"), and after Remove, focus goes to the page heading so you don't lose your place.

[FILL IN: after testing with Narrator or NVDA, say what you actually heard. Until then this is what the markup is designed to produce, not a test result.]

## 6. Where is your API key?

There isn't one. The Rick and Morty API is open and has CORS enabled, so nothing secret ships in the front end. If an API did need a key, a key in browser JavaScript is public, because anyone can read it in View Source or the Network tab. The fix is a small backend proxy: the browser calls my endpoint, the server adds the key from an environment variable, and the key never reaches the browser. I'll build that later in the course.

## 7. What is the largest asset on the page, and what did you do about it?

Images. Of the original 666 kB, 650 kB was images, about 32 kB each for cards shown at roughly 160 to 200px wide. I resized them to 240px and converted them to WebP through a resizing service, which brought each one to about 7 kB. Images dropped from 650 kB to 140 kB, and the whole page from 666 kB to 158 kB, which is 76% lighter. If the resizer fails, the image falls back to the original URL. The largest single request now is [FILL IN: name and size from the Network tab, sorted by Size]. The trade-off is a third-party dependency, which my own backend would replace.

## 8. What was the hardest layout or state problem, and how did you solve it?

A layout shift on the detail page. Lighthouse reported a Cumulative Layout Shift of 0.089, which passes but only just. The report named the footer as the only element moving. The page starts with the article hidden, so the footer sat near the top, then jumped down when the data arrived. I gave the detail page's main area a minimum height of one screen so the footer starts out below the content. I re-ran Lighthouse and CLS was 0.

## 9. What would you change with another week?

First, put the search, filter and page in the URL. Right now, opening a character and pressing Back drops you on page 1 with the search cleared, and that is the biggest real UX flaw. Second, add automated tests, for example Playwright for the four states and the keyboard journey. Third, replace the third-party image resizer with my own small proxy that also caches. Fourth, use `AbortController` so stale requests are cancelled, not just ignored.