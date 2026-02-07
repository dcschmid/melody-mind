import type { ArtistEntry } from "../../types/artist";

type InfluenceDirection = "influencedBy" | "influenced";

interface UnknownArtistReference {
  artistId: string;
  relation: InfluenceDirection;
  reference: string;
}

const REFERENCE_EXT_RE = /\.mdx?$/i;

export const normalizeArtistReference = (value: string): string =>
  value.trim().replace(REFERENCE_EXT_RE, "").toLowerCase();

export const artistSlugFromId = (id: string): string => id.replace(REFERENCE_EXT_RE, "");

export const buildArtistLookup = (artists: ArtistEntry[]): Map<string, ArtistEntry> => {
  const lookup = new Map<string, ArtistEntry>();
  artists.forEach((artist) => {
    const normalizedId = normalizeArtistReference(artist.id);
    lookup.set(normalizedId, artist);
  });
  return lookup;
};

export const findUnknownArtistReferences = (
  artists: ArtistEntry[]
): UnknownArtistReference[] => {
  const artistLookup = buildArtistLookup(artists);
  const unknown: UnknownArtistReference[] = [];

  artists.forEach((artist) => {
    (["influencedBy", "influenced"] as const).forEach((relation) => {
      (artist.data[relation] || []).forEach((reference) => {
        const normalizedReference = normalizeArtistReference(reference);
        if (!normalizedReference) {
          return;
        }
        if (!artistLookup.has(normalizedReference)) {
          unknown.push({
            artistId: artist.id,
            relation,
            reference,
          });
        }
      });
    });
  });

  return unknown;
};

export const formatArtistReferenceWarnings = (
  unknownReferences: UnknownArtistReference[]
): string[] =>
  unknownReferences.map(
    (item) => `- ${item.artistId} (${item.relation}) -> ${item.reference}`
  );
