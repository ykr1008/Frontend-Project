import { fetchCharacter } from './api.js';
import { isSaved, saveCharacter, removeCharacter } from './storage.js';

const message = document.getElementById('status-message');
const article = document.getElementById('character');
const saveBtn = document.getElementById('save-btn');

const id = new URLSearchParams(location.search).get('id');

function showError() {
  article.hidden = true;
  message.textContent = 'Something went wrong loading this character. ';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Retry';
  retry.addEventListener('click', load);
  message.append(retry);
}

function showNotFound() {
  article.hidden = true;
  message.textContent = 'Character not found. Head back to browse and pick another one.';
  document.title = 'Not found | Rick and Morty Explorer';
}

function updateSaveButton(saved) {
  saveBtn.setAttribute('aria-pressed', String(saved));
  saveBtn.textContent = saved ? 'Saved ✓ (click to remove)' : 'Save character';
}

function showCharacter(c) {
  message.textContent = '';
  document.title = `${c.name} | Rick and Morty Explorer`;
  document.getElementById('char-name').textContent = c.name;
  const img = document.getElementById('char-image');
  img.src = c.image;
  img.alt = `Portrait of ${c.name}`;
  document.getElementById('char-status').textContent = c.status;
  document.getElementById('char-species').textContent = c.type ? `${c.species} (${c.type})` : c.species;
  document.getElementById('char-gender').textContent = c.gender;
  document.getElementById('char-origin').textContent = c.origin.name;
  document.getElementById('char-location').textContent = c.location.name;
  document.getElementById('char-episodes').textContent = `Appears in ${c.episode.length} episodes`;
  updateSaveButton(isSaved(c.id));
  article.hidden = false;

  saveBtn.onclick = () => {
    if (isSaved(c.id)) {
      removeCharacter(c.id);
      updateSaveButton(false);
    } else {
      saveCharacter(c);
      updateSaveButton(true);
    }
  };
}

async function load() {
  if (!/^\d+$/.test(id ?? '')) return showNotFound();
  article.hidden = true;
  message.textContent = 'Loading character…';
  try {
    const character = await fetchCharacter(id);
    character ? showCharacter(character) : showNotFound();
  } catch {
    showError();
  }
}

load();