import { fetchCharacters } from "./api.js";
import { optimisedSrc } from "./images.js";

const form = document.getElementById("filters");
const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");
const list = document.getElementById("character-list");
const message = document.getElementById("status-message");
const template = document.getElementById("card-template");
const pager = document.getElementById("pager");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageInfo = document.getElementById("page-info");
const resultsHeading = document.getElementById("results-heading");

let requestId = 0;
let page = 1;

function showLoading() {
  pager.hidden = true;
  list.setAttribute("aria-busy", "true");
  message.textContent = "Loading characters…";
  const skeletons = Array.from({ length: 8 }, () => {
    const li = document.createElement("li");
    li.className = "skeleton";
    li.setAttribute("aria-hidden", "true");
    return li;
  });
  list.replaceChildren(...skeletons);
}

function showEmpty() {
  pager.hidden = true;
  list.setAttribute("aria-busy", "false");
  list.replaceChildren();
  message.textContent =
    "No characters match your search. Try a different name or status.";
}

function showError() {
  pager.hidden = true;
  list.setAttribute("aria-busy", "false");
  list.replaceChildren();
  message.textContent = "Something went wrong loading characters. ";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.textContent = "Retry";
  retry.addEventListener("click", () => load());
  message.append(retry);
}

function showSuccess({ results, info }) {
  list.setAttribute("aria-busy", "false");
  message.textContent = `Showing ${results.length} of ${info.count} characters.`;
  const cards = results.map((c, i) => {
    const card = template.content.cloneNode(true);
    const img = card.querySelector("img");
    img.src = optimisedSrc(c.image, 240);
    img.addEventListener(
      "error",
      () => {
        img.src = c.image;
      },
      { once: true },
    );
    if (i < 4) {
      img.loading = "eager";
      if (i === 0) img.fetchPriority = "high";
    }
    img.alt = `Portrait of ${c.name}`;
    const link = card.querySelector("a");
    link.href = `character.html?id=${c.id}`;
    link.textContent = c.name;
    card.querySelector(".meta").textContent = `${c.status} · ${c.species}`;
    return card;
  });
  list.replaceChildren(...cards);

  pager.hidden = info.pages <= 1;
  pageInfo.textContent = `Page ${page} of ${info.pages}`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= info.pages;
}

async function load({ focusResults = false } = {}) {
  const id = ++requestId;
  showLoading();
  try {
    const data = await fetchCharacters({
      name: searchInput.value.trim(),
      status: statusSelect.value,
      page,
    });
    if (id !== requestId) return;
    if (data.results.length) {
      showSuccess(data);
      if (focusResults) resultsHeading.focus();
    } else {
      showEmpty();
    }
  } catch {
    if (id !== requestId) return;
    showError();
  }
}

function newSearch() {
  page = 1;
  load();
}

let timer;
searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(newSearch, 300);
});
statusSelect.addEventListener("change", newSearch);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  newSearch();
});

prevBtn.addEventListener("click", () => {
  page -= 1;
  load({ focusResults: true });
});
nextBtn.addEventListener("click", () => {
  page += 1;
  load({ focusResults: true });
});

load();
