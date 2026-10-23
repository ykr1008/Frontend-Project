export function optimisedSrc(url, width) {
  const bare = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(bare)}&w=${width}&output=webp&q=75`;
}