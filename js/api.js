const ENDPOINT = "https://rickandmortyapi.com/graphql";

const QUERY = `
  query ($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info { count pages next prev }
      results { id name status species image }
    }
  }`;

export async function fetchCharacters({
  name = "",
  status = "",
  page = 1,
} = {}) {
  const filter = {};
  if (name) filter.name = name;
  if (status) filter.status = status;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { page, filter } }),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data.characters;
}
const CHARACTER_QUERY = `
  query ($id: ID!) {
    character(id: $id) {
      id name status species type gender image
      origin { name }
      location { name }
      episode { id }
    }
  }`;

export async function fetchCharacter(id) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: CHARACTER_QUERY, variables: { id } }),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) {
    if (json.errors.some((e) => e.message.includes("404"))) return null;
    throw new Error(json.errors[0].message);
  }
  return json.data.character;
}
