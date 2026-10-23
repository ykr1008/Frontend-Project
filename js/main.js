import { fetchCharacters } from "./api.js";
import { optimisedSrc } from "./images.js";

const form = document.getElementById("filters");
const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");
const list = document.getElementById("character-list");
const message = document.getElementById("status-message");
const template = document.getElementById("card-template");

let requestId = 0;

function showLoading() {
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
  list.setAttribute("aria-busy", "false");
  list.replaceChildren();
  message.textContent =
    "No characters match your search. Try a different name or status.";
}

function showError() {
  list.setAttribute("aria-busy", "false");
  list.replaceChildren();
  message.textContent = "Something went wrong loading characters. ";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.textContent = "Retry";
  retry.addEventListener("click", load);
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
}

async function load() {
  const id = ++requestId;
  showLoading();
  try {
    const data = await fetchCharacters({
      name: searchInput.value.trim(),
      status: statusSelect.value,
    });
    if (id !== requestId) return;
    data.results.length ? showSuccess(data) : showEmpty();
  } catch {
    if (id !== requestId) return;
    showError();
  }
}

let timer;
searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(load, 300);
});
statusSelect.addEventListener("change", load);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  load();
});

load();
