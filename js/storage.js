const KEY = 'rm-saved';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: fail quietly */
  }
}

export function getSaved() {
  return Object.values(read());
}

export function isSaved(id) {
  return String(id) in read();
}

export function saveCharacter({ id, name, image, status, species }) {
  const data = read();
  data[id] = { id, name, image, status, species, note: data[id]?.note ?? '' };
  write(data);
}

export function removeCharacter(id) {
  const data = read();
  delete data[id];
  write(data);
}

export function setNote(id, note) {
  const data = read();
  if (data[id]) {
    data[id].note = note;
    write(data);
  }
}