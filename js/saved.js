import { getSaved, removeCharacter, setNote } from "./storage.js";
import { optimisedSrc } from "./images.js";

const list = document.getElementById("saved-list");
const message = document.getElementById("status-message");
const heading = document.getElementById("page-heading");
const template = document.getElementById("saved-template");

function showEmpty() {
  list.replaceChildren();
  message.textContent = "You have not saved any characters yet. ";
  const link = document.createElement("a");
  link.href = "index.html";
  link.textContent = "Browse characters";
  message.append(link);
}

function render() {
  const saved = getSaved();
  if (saved.length === 0) return showEmpty();

  message.textContent = `${saved.length} saved ${saved.length === 1 ? "character" : "characters"}.`;

  const items = saved.map((c) => {
    const item = template.content.cloneNode(true);
    const img = item.querySelector("img");
    img.src = optimisedSrc(c.image, 300);
    img.addEventListener(
      "error",
      () => {
        img.src = c.image;
      },
      { once: true },
    );
    img.alt = `Portrait of ${c.name}`;
    const link = item.querySelector("h2 a");
    link.href = `character.html?id=${c.id}`;
    link.textContent = c.name;
    item.querySelector(".meta").textContent = `${c.status} · ${c.species}`;

    const form = item.querySelector("form");
    form.dataset.id = c.id;
    form.dataset.name = c.name;
    const label = form.querySelector("label");
    const textarea = form.querySelector("textarea");
    textarea.id = `note-${c.id}`;
    label.htmlFor = textarea.id;
    label.textContent = `Your note about ${c.name}`;
    textarea.value = c.note;
    form.querySelector(".remove").dataset.id = c.id;
    return item;
  });
  list.replaceChildren(...items);
}

list.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  setNote(form.dataset.id, form.elements.note.value.trim());
  message.textContent = `Note saved for ${form.dataset.name}.`;
});

list.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  removeCharacter(btn.dataset.id);
  render();
  heading.focus();
});

render();
