// lib/sponsor.ts — Sister Wendy sponsorship config
// All sponsor placements are opt-in, thematic, and non-intrusive.
// Fill in values to activate a placement; null = hook hidden.

export interface TileBackSponsor {
  name: string;
  logoUrl: string;
  label: string;        // e.g. "Luxury Edition by Sotheby's"
}

export interface ScoreBadgeSponsor {
  name: string;
  label: string;        // e.g. "Data & insights by Refinitiv"
}

export interface PostGameSponsor {
  name: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface HintSponsor {
  name: string;
  quipPrefix: string;   // e.g. "Hint courtesy of Art Basel:"
}

export interface TournamentSponsor {
  name: string;
  trophyLabel: string;  // e.g. "Sister Wendy's Art History Cup — Presented by Sotheby's"
}

// SPONSOR_CONFIG: single source of truth for all in-game placements.
// Wire new sponsors here — the components read this at runtime.
export const SPONSOR_CONFIG = {
  // SPONSOR_HOOK: branded tile backs — sponsor logo replaces default pip art
  tileBack: null as TileBackSponsor | null,

  // SPONSOR_HOOK: score panel badge — "Data & insights provided by [name]"
  scoreBadge: null as ScoreBadgeSponsor | null,

  // SPONSOR_HOOK: post-game screen — "Thank you to our partner [name]"
  postGame: null as PostGameSponsor | null,

  // SPONSOR_HOOK: hint button — "Ask Sister Wendy's Patron" shows sponsor credit
  hint: null as HintSponsor | null,

  // SPONSOR_HOOK: monthly tournament — trophy and leaderboard title sponsor
  tournament: null as TournamentSponsor | null,
} as const;
