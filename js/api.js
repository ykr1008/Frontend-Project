const ENDPOINT = 'https://rickandmortyapi.com/graphql';

const QUERY = `
  query ($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info { count pages next prev }
      results { id name status species image }
    }
  }`;

export async function fetchCharacters({ name = '', status = '', page = 1 } = {}) {
  const filter = {};
  if (name) filter.name = name;
  if (status) filter.status = status;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { page, filter } })
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data.characters;
}