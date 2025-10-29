export function parseGameRoute(path?: string): { lang?: string; gameId?: string; category?: string } {
  if (!path) {
    path = window.location.pathname;
  }
  const parts = path.split('/').filter(Boolean);
  return {
    lang: parts[0],
    category: parts[1],
    gameId: parts[2]
  };
}
