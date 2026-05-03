export interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  department: string;
  primaryImage: string;
  primaryImageSmall: string;
  artistNationality: string;
  creditLine: string;
  objectURL: string;
}

// A curated list of great paintings in the Met's public domain collection.
// These are among the most celebrated works — each one worth contemplating.
const CURATED_IDS = [
  436535,  // Vermeer, Young Woman with a Water Pitcher
  437984,  // Van Gogh, Self-Portrait with a Straw Hat
  437654,  // Monet, La Grenouillère
  459055,  // El Greco, View of Toledo
  436121,  // Botticelli, Portrait of a Young Man
  438817,  // Rembrandt, Portrait of a Man
  436955,  // Winslow Homer, Northeaster
  436965,  // Winslow Homer, The Blue Boat
  11417,   // Édouard Manet, Boating
  436532,  // Vermeer, Woman with a Lute
  10547,   // Georges Seurat, Landscape at Saint-Denis
  437112,  // Van Gogh, Wheat Field with Cypresses
  436121,  // Botticelli
  459193,  // El Greco, The Vision of Saint John
  437329,  // Monet, Water Lilies
  436483,  // Jan Steen, Merry Company on a Terrace
  436954,  // Winslow Homer, Snap the Whip
  335877,  // Jean-Baptiste-Siméon Chardin, Boy Blowing Bubbles
  459055,  // El Greco
  436121,  // Botticelli young man
  10363,   // Pieter Bruegel the Elder, The Harvesters
  437394,  // Degas, The Dancing Class
  436955,  // Homer, Northeaster
  22228,   // Édouard Manet, Young Lady in 1866
  437654,  // Monet
  437984,  // Van Gogh straw hat
  436532,  // Vermeer lute
  334,     // Washington Crossing the Delaware (Emanuel Leutze)
  44929,   // Portrait of a Young Woman (Rogier van der Weyden)
  436122,  // Botticelli, The Annunciation
];

// Remove duplicates
const PAINTING_IDS = [...new Set(CURATED_IDS)];

export function getDailyPaintingId(): number {
  const today = new Date();
  const dayIndex = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return PAINTING_IDS[dayIndex % PAINTING_IDS.length];
}

export async function fetchMetObject(objectID: number): Promise<MetObject | null> {
  try {
    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.primaryImage) return null;
    return data as MetObject;
  } catch {
    return null;
  }
}
