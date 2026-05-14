interface AlbumTheme {
  accent: string;
  accentStrong: string;
  paper: string;
  paperSoft: string;
  ink: string;
  muted: string;
  line: string;
}

const DEFAULT_ALBUM_THEME: AlbumTheme = {
  accent: "oklch(69% 0.19 286deg)",
  accentStrong: "oklch(66% 0.174 252deg)",
  paper: "oklch(14% 0.036 252deg)",
  paperSoft: "oklch(19% 0.046 258deg)",
  ink: "oklch(97% 0.01 76deg)",
  muted: "oklch(84% 0.026 258deg)",
  line: "oklch(70% 0.07 260deg / 0.34)",
};

const GENRE_ALBUM_THEMES: Record<string, AlbumTheme> = {
  "afro-cuban jazz": {
    accent: "oklch(74% 0.15 58deg)",
    accentStrong: "oklch(67% 0.18 34deg)",
    paper: "oklch(15% 0.035 38deg)",
    paperSoft: "oklch(21% 0.052 42deg)",
    ink: "oklch(97% 0.016 78deg)",
    muted: "oklch(84% 0.04 70deg)",
    line: "oklch(74% 0.11 48deg / 0.34)",
  },
  "art pop": {
    accent: "oklch(72% 0.15 318deg)",
    accentStrong: "oklch(70% 0.13 205deg)",
    paper: "oklch(14% 0.034 286deg)",
    paperSoft: "oklch(20% 0.046 296deg)",
    ink: "oklch(97% 0.012 320deg)",
    muted: "oklch(85% 0.026 306deg)",
    line: "oklch(72% 0.1 318deg / 0.34)",
  },
  "chanson-pop": {
    accent: "oklch(76% 0.12 52deg)",
    accentStrong: "oklch(65% 0.11 18deg)",
    paper: "oklch(15% 0.025 245deg)",
    paperSoft: "oklch(20% 0.036 250deg)",
    ink: "oklch(97% 0.012 76deg)",
    muted: "oklch(84% 0.026 252deg)",
    line: "oklch(76% 0.08 52deg / 0.32)",
  },
  "dark cabaret": {
    accent: "oklch(70% 0.17 23deg)",
    accentStrong: "oklch(74% 0.12 340deg)",
    paper: "oklch(12% 0.035 18deg)",
    paperSoft: "oklch(18% 0.05 20deg)",
    ink: "oklch(96% 0.014 70deg)",
    muted: "oklch(82% 0.04 32deg)",
    line: "oklch(70% 0.13 23deg / 0.35)",
  },
  "dream pop": {
    accent: "oklch(75% 0.13 330deg)",
    accentStrong: "oklch(75% 0.1 210deg)",
    paper: "oklch(16% 0.035 278deg)",
    paperSoft: "oklch(22% 0.046 286deg)",
    ink: "oklch(97% 0.012 320deg)",
    muted: "oklch(85% 0.032 295deg)",
    line: "oklch(75% 0.09 330deg / 0.34)",
  },
  "folk-rock": {
    accent: "oklch(73% 0.15 58deg)",
    accentStrong: "oklch(62% 0.14 138deg)",
    paper: "oklch(14% 0.034 105deg)",
    paperSoft: "oklch(20% 0.046 96deg)",
    ink: "oklch(97% 0.016 80deg)",
    muted: "oklch(83% 0.036 92deg)",
    line: "oklch(73% 0.1 58deg / 0.34)",
  },
  gothic: {
    accent: "oklch(69% 0.11 350deg)",
    accentStrong: "oklch(76% 0.06 82deg)",
    paper: "oklch(12% 0.026 270deg)",
    paperSoft: "oklch(18% 0.034 276deg)",
    ink: "oklch(96% 0.012 80deg)",
    muted: "oklch(82% 0.026 286deg)",
    line: "oklch(69% 0.08 350deg / 0.32)",
  },
  "german rap": {
    accent: "oklch(72% 0.14 88deg)",
    accentStrong: "oklch(66% 0.12 25deg)",
    paper: "oklch(13% 0.025 235deg)",
    paperSoft: "oklch(19% 0.036 230deg)",
    ink: "oklch(96% 0.012 82deg)",
    muted: "oklch(82% 0.028 235deg)",
    line: "oklch(72% 0.09 88deg / 0.34)",
  },
  "j-metal": {
    accent: "oklch(68% 0.2 20deg)",
    accentStrong: "oklch(72% 0.18 336deg)",
    paper: "oklch(12% 0.038 258deg)",
    paperSoft: "oklch(18% 0.052 264deg)",
    ink: "oklch(97% 0.012 76deg)",
    muted: "oklch(83% 0.028 270deg)",
    line: "oklch(68% 0.14 20deg / 0.36)",
  },
  "k-pop": {
    accent: "oklch(73% 0.24 342deg)",
    accentStrong: "oklch(76% 0.2 286deg)",
    paper: "oklch(12% 0.044 257deg)",
    paperSoft: "oklch(18% 0.065 270deg)",
    ink: "oklch(98% 0.01 300deg)",
    muted: "oklch(86% 0.038 286deg)",
    line: "oklch(73% 0.16 342deg / 0.36)",
  },
  "mariachi-pop": {
    accent: "oklch(74% 0.16 44deg)",
    accentStrong: "oklch(67% 0.16 142deg)",
    paper: "oklch(14% 0.034 48deg)",
    paperSoft: "oklch(20% 0.046 42deg)",
    ink: "oklch(97% 0.016 76deg)",
    muted: "oklch(84% 0.036 62deg)",
    line: "oklch(74% 0.1 44deg / 0.34)",
  },
  "metal opera": {
    accent: "oklch(70% 0.16 34deg)",
    accentStrong: "oklch(74% 0.11 82deg)",
    paper: "oklch(12% 0.032 250deg)",
    paperSoft: "oklch(18% 0.044 254deg)",
    ink: "oklch(97% 0.012 76deg)",
    muted: "oklch(83% 0.028 260deg)",
    line: "oklch(70% 0.1 34deg / 0.35)",
  },
  "neo-classical": {
    accent: "oklch(76% 0.08 86deg)",
    accentStrong: "oklch(72% 0.07 218deg)",
    paper: "oklch(15% 0.026 245deg)",
    paperSoft: "oklch(21% 0.032 250deg)",
    ink: "oklch(97% 0.012 78deg)",
    muted: "oklch(84% 0.024 250deg)",
    line: "oklch(76% 0.06 86deg / 0.3)",
  },
  punk: {
    accent: "oklch(69% 0.2 27deg)",
    accentStrong: "oklch(76% 0.16 92deg)",
    paper: "oklch(11% 0.032 245deg)",
    paperSoft: "oklch(17% 0.042 250deg)",
    ink: "oklch(97% 0.012 82deg)",
    muted: "oklch(82% 0.032 74deg)",
    line: "oklch(69% 0.14 27deg / 0.36)",
  },
  "rock opera": {
    accent: "oklch(72% 0.15 72deg)",
    accentStrong: "oklch(66% 0.14 242deg)",
    paper: "oklch(12% 0.036 244deg)",
    paperSoft: "oklch(18% 0.048 250deg)",
    ink: "oklch(97% 0.012 80deg)",
    muted: "oklch(83% 0.028 252deg)",
    line: "oklch(72% 0.1 72deg / 0.34)",
  },
  soundtrack: {
    accent: "oklch(76% 0.13 72deg)",
    accentStrong: "oklch(69% 0.12 218deg)",
    paper: "oklch(13% 0.035 238deg)",
    paperSoft: "oklch(20% 0.046 244deg)",
    ink: "oklch(97% 0.012 80deg)",
    muted: "oklch(84% 0.026 245deg)",
    line: "oklch(76% 0.08 72deg / 0.34)",
  },
  "viking metal": {
    accent: "oklch(72% 0.14 54deg)",
    accentStrong: "oklch(66% 0.12 210deg)",
    paper: "oklch(12% 0.03 228deg)",
    paperSoft: "oklch(18% 0.04 222deg)",
    ink: "oklch(97% 0.012 78deg)",
    muted: "oklch(83% 0.03 220deg)",
    line: "oklch(72% 0.09 54deg / 0.34)",
  },
};

const ALBUM_THEME_OVERRIDES: Record<string, Partial<AlbumTheme>> = {
  "neon-hearts": {
    accent: "oklch(74% 0.27 343deg)",
    accentStrong: "oklch(78% 0.24 294deg)",
    paper: "oklch(11% 0.052 254deg)",
    paperSoft: "oklch(17% 0.078 274deg)",
    ink: "oklch(98% 0.012 304deg)",
    muted: "oklch(86% 0.044 292deg)",
    line: "oklch(74% 0.18 343deg / 0.38)",
  },
  "neon-shogun": {
    accent: "oklch(69% 0.23 24deg)",
    accentStrong: "oklch(75% 0.2 330deg)",
  },
};

function normalizeThemeKey(value?: string): string {
  return value?.trim().toLowerCase() || "";
}

export function buildAlbumThemeStyle(albumId: string, genre?: string): string {
  const genreTheme = GENRE_ALBUM_THEMES[normalizeThemeKey(genre)] ?? DEFAULT_ALBUM_THEME;
  const theme = {
    ...genreTheme,
    ...ALBUM_THEME_OVERRIDES[normalizeThemeKey(albumId)],
  };

  return [
    `--music-album-accent: ${theme.accent}`,
    `--music-album-accent-strong: ${theme.accentStrong}`,
    `--music-album-paper: ${theme.paper}`,
    `--music-album-paper-soft: ${theme.paperSoft}`,
    `--music-album-ink: ${theme.ink}`,
    `--music-album-muted: ${theme.muted}`,
    `--music-album-line: ${theme.line}`,
  ].join("; ");
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
