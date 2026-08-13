'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);
import {
  GameState, GameMode, TileData, BoardEnd,
  initGame, nextRound, validEnds, canPlay, playOnBoard, scoreValue,
  boardIsEmpty, aiPickPlay, difficultyForMode,
  calcRoundBonus, isDouble, grantsGoAgain, scoreBreakdown,
} from '@/lib/game';
import { randQuote, wendyCommentary } from '@/lib/wendy';
import { getStats } from '@/lib/stats';
import ScoringExplainer, { type ExplainerData } from './ScoringExplainer';
import type { WendyMood } from '@/lib/game';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import { audio, rateForTile } from '@/lib/audio';
import Board from './Board';
import Hand from './Hand';
import WendyPortrait from './WendyPortrait';
import ScorePanel from './ScorePanel';
import EndScreen from './EndScreen';
import GameSetup from './GameSetup';
import IntroScreen from './IntroScreen';
import { ScrewcapGamesStrip, SponsorBanner } from './ScrewcapPromo';

// Lightened from each game's brand colour: at 0.8rem on the near-black HUD the
// source hues read at ~2:1. Same hue, legible as type.
// Andrew, 4 Aug: the full offering belongs down here, with the house link and
// About pinned far left and the games ranged right.
const SCREWCAP_FOOTER_GAMES = [
  { id: 'double-fives', name: 'DOUBLE FIVES', color: '#e8809f', href: 'https://doublefives-next.vercel.app' },
  { id: 'the-chair',    name: 'THE CHAIR',    color: '#74c7bb', href: 'https://thechair.vercel.app' },
  { id: 'kitchen-table',name: 'KITCHEN TABLE',color: '#e8b840', href: 'https://kitchen-table-tau.vercel.app' },
  { id: 'dttau',        name: 'DTTAU',        color: '#7cc0ee', href: 'https://dttau.app' },
  { id: 'sutda',        name: 'SUTDA',        color: '#e8809f', href: 'https://www.sutda.games' },
  { id: 'gold-digger',  name: 'GOLD DIGGER',  color: '#e8b840', href: 'https://golddigger.trading' },
] as const;

// ── State machine actions ───────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_TILE'; tile: TileData }
  | { type: 'CHOOSE_END';  end: BoardEnd }
  | { type: 'DRAW' }
  | { type: 'PASS' }
  | { type: 'SPEECH'; text: string; mood?: WendyMood }
  | { type: 'CANCEL_SELECTION' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'SELECT_TILE': {
      const tile = action.tile;
      const human = state.players[0];
      if (state.phase !== 'selecting' || state.currentPlayerIndex !== 0) return state;
      if (!human.hand.find(t => t.id === tile.id)) return state;

      const ends = boardIsEmpty(state.board)
        ? (['first'] as BoardEnd[])
        : validEnds(state.board, tile);

      if (ends.length === 0) {
        return { ...state, wendySpeech: "That tile doesn't fit. Try another — or draw." };
      }

      if (ends.length === 1) {
        return commitPlay(state, tile, ends[0]);
      }

      return {
        ...state,
        phase: 'choosingEnd',
        selectedTile: tile,
        validEndsForSelected: ends,
        wendySpeech: "Choose a side — left or right.",
      };
    }

    case 'CHOOSE_END': {
      if (state.phase !== 'choosingEnd' || !state.selectedTile) return state;
      return commitPlay(state, state.selectedTile, action.end);
    }

    case 'DRAW': {
      if (state.phase !== 'selecting' || state.currentPlayerIndex !== 0) return state;
      if (state.boneyard.length === 0) return { ...state, wendySpeech: "The boneyard is empty. You must pass." };

      const human = state.players[0];
      const hasMove = human.hand.some(t => boardIsEmpty(state.board) || canPlay(state.board, t));
      if (hasMove) return { ...state, wendySpeech: "You have playable tiles — play one first." };

      const [drawn, ...restBoneyard] = state.boneyard;
      const updatedPlayers = state.players.map((p, i) =>
        i === 0 ? { ...p, hand: [...p.hand, drawn] } : p
      );
      const canPlayDrawn = boardIsEmpty(state.board) || canPlay(state.board, drawn);

      return {
        ...state,
        players: updatedPlayers,
        boneyard: restBoneyard,
        wendySpeech: canPlayDrawn
          ? `Drew [${drawn.a}|${drawn.b}] — you can play it.`
          : restBoneyard.length > 0
          ? `Drew [${drawn.a}|${drawn.b}] — no match yet. Draw again?`
          : "Boneyard empty. No moves — you must pass.",
      };
    }

    case 'PASS': {
      return advanceTurn(state);
    }

    case 'SPEECH': {
      return { ...state, wendySpeech: action.text, wendyMood: action.mood ?? state.wendyMood };
    }

    case 'CANCEL_SELECTION': {
      return { ...state, phase: 'selecting', selectedTile: null, validEndsForSelected: [] };
    }

    default:
      return state;
  }
}

// ── Pure helpers ────────────────────────────────────────────────────────────

function commitPlay(state: GameState, tile: TileData, end: BoardEnd): GameState {
  const playerIdx = state.currentPlayerIndex;
  const newBoard = playOnBoard(state.board, tile, end);
  const scored = scoreValue(newBoard);

  const updatedPlayers = state.players.map((p, i) => {
    if (i !== playerIdx) return p;
    return { ...p, hand: p.hand.filter(t => t.id !== tile.id), score: p.score + scored };
  });

  const current = updatedPlayers[playerIdx];
  const gameWon = current.score >= state.targetScore;
  const roundWon = current.hand.length === 0;

  if (gameWon || roundWon) {
    // Award pip bonus: sum opponents' remaining tile pips, round to nearest 5
    const pipBonus = roundWon ? calcRoundBonus(updatedPlayers, playerIdx) : 0;
    const scoredPlayers = pipBonus > 0
      ? updatedPlayers.map((p, i) => i === playerIdx ? { ...p, score: p.score + pipBonus } : p)
      : updatedPlayers;
    const finalWinner = scoredPlayers[playerIdx];
    const gameWonFinal = finalWinner.score >= state.targetScore;
    const phase: GameState['phase'] = gameWonFinal ? 'gameOver' : 'roundOver';
    const pid = state.players.find(p => !p.isHuman)?.personalityId;
    const oppName = state.players.find(p => !p.isHuman)?.name ?? 'Sister Wendy';
    const speech = finalWinner.isHuman
      ? gameWonFinal ? randQuote('playerWins', pid) : `Your hand is empty — round over! (+${pipBonus} pip bonus)`
      : gameWonFinal ? randQuote('wendyWins', pid) : `${oppName} is out of tiles. (+${pipBonus} pip bonus)`;
    return {
      ...state,
      board: newBoard,
      players: scoredPlayers,
      selectedTile: null,
      validEndsForSelected: [],
      phase,
      gameWinnerId: gameWonFinal ? finalWinner.id : null,
      roundWinnerId: finalWinner.id,
      lastScore: scored,
      lastScoringPlayerId: scored > 0 ? finalWinner.id : state.lastScoringPlayerId,
      wendySpeech: speech,
      wendyMood: finalWinner.isHuman ? 'disappointed' : 'triumphant',
      bonusTurn: false,
    };
  }

  const bonus = grantsGoAgain(tile, scored);
  const speech = buildSpeech(current.isHuman, scored, isDouble(tile), bonus, state.players.find(p => !p.isHuman)?.personalityId, updatedPlayers[0].score, updatedPlayers.find(p => !p.isHuman)?.score ?? 0);
  const mood = getMood(current.isHuman, scored, isDouble(tile));

  return {
    ...state,
    board: newBoard,
    players: updatedPlayers,
    selectedTile: null,
    validEndsForSelected: [],
    phase: bonus ? 'selecting' : 'aiThinking',
    currentPlayerIndex: bonus ? playerIdx : (playerIdx + 1) % state.players.length,
    lastScore: scored,
    lastScoringPlayerId: scored > 0 ? current.id : state.lastScoringPlayerId,
    wendySpeech: speech,
    wendyMood: mood,
    bonusTurn: bonus && current.isHuman,
    turnCount: state.turnCount + 1,
  };
}

function advanceTurn(state: GameState): GameState {
  const nextIdx = (state.currentPlayerIndex + 1) % state.players.length;
  const nextPlayer = state.players[nextIdx];
  const phase: GameState['phase'] = nextPlayer.isHuman ? 'selecting' : 'aiThinking';
  return {
    ...state,
    currentPlayerIndex: nextIdx,
    phase,
    bonusTurn: false,
    selectedTile: null,
    validEndsForSelected: [],
    wendySpeech: nextPlayer.isHuman ? "Your turn." : randQuote('herTurn', nextPlayer.personalityId),
    wendyMood: 'neutral',
  };
}

function oppPersonality(state: GameState): string | undefined {
  return state.players.find(p => !p.isHuman)?.personalityId ?? 'wendy';
}

function buildSpeech(isHuman: boolean, scored: number, double_: boolean, bonus: boolean, pid?: string, humanScore = 0, oppScore = 0): string {
  if (isHuman) {
    if (scored >= 15) return randQuote('playerBigScore', pid);
    if (scored > 0)   return randQuote('playerScores', pid) + (bonus ? " Play again." : "");
    if (double_)      return randQuote('playerDouble', pid) + " Play again.";
    return randQuote('herTurn', pid);
  } else {
    if (scored >= 15) return randQuote('wendyBigScore', pid);
    if (scored > 0)   return randQuote('wendyScores', pid);
    if (double_)      return randQuote('wendyDouble', pid);
    return wendyCommentary(humanScore, oppScore, pid); // context-aware: blowout / nail-biter / rare
  }
}

function getMood(isHuman: boolean, scored: number, double_: boolean): WendyMood {
  if (!isHuman && scored >= 20) return 'triumphant';
  if (!isHuman && scored > 0)   return 'pleased';
  if (isHuman && scored >= 20)  return 'suspicious';
  if (isHuman && scored > 0)    return 'disappointed';
  if (double_)                  return 'amused';
  return 'neutral';
}

// ── Main Game component ─────────────────────────────────────────────────────

const AI_DELAY_MS = 750;

const SAVE_KEY = 'sw-game';

function loadSavedGame(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Don't restore terminal phases
    if (parsed.phase === 'gameOver' || parsed.phase === 'roundOver') return null;
    return parsed;
  } catch { return null; }
}

export default function Game() {
  // NOTE: initialise localStorage-derived state to the SERVER value (null/false) so
  // the first client render matches the server HTML, then hydrate the real values in
  // an effect after mount. Reading localStorage in a useState initialiser renders
  // differently server vs client → React #418 hydration mismatch.
  const [gs, setGs] = useState<GameState | null>(null);
  const [artFact, setArtFact] = useState<string | undefined>(undefined);
  const [latestTileId, setLatestTileId] = useState<string | undefined>(undefined);
  const [shakeTileId, setShakeTileId] = useState<string | undefined>(undefined);
  const [isMuted, setIsMuted] = useState(false);
  const [undoable, setUndoable] = useState<GameState | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate client-only state after mount (keeps SSR/CSR first render identical)
  useEffect(() => {
    setIsMuted(audio.muted);
    const saved = loadSavedGame();
    if (saved) setGs(saved);
    try { setShowIntro(!localStorage.getItem('sw-intro-seen')); } catch { /* */ }
  }, []);

  // Persist game state to localStorage
  useEffect(() => {
    if (!gs) return;
    if (gs.phase === 'gameOver') {
      localStorage.removeItem(SAVE_KEY);
      return;
    }
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(gs)); } catch { /* quota */ }
  }, [gs]);

  const dispatch = useCallback((action: Action) => {
    setGs(prev => prev ? reducer(prev, action) : prev);
  }, []);

  // Sound effects — react to board changes and phase transitions
  const prevBoardLen = useRef(0);
  const prevPhase = useRef<string>('');
  const prevLastScore = useRef(0);
  useEffect(() => {
    if (!gs) return;
    const boardLen = gs.board.chain.length;
    // Tile placed — Wendy's tiles sound heavier/deliberate (idx 0 = her turn now ⇒ she just played)
    if (boardLen > prevBoardLen.current) {
      const landed = gs.board.chain[gs.board.chain.length - 1];
      const hers = gs.currentPlayerIndex === 0;
      audio.play(hers ? 'place-wendy' : 'place', {
        rate: landed ? rateForTile(landed.a, landed.b) : undefined,
        pan: hers ? -0.35 : 0,   // her tiles come from her side of the table
      });
      // Near-miss: landed one off a multiple of 5 without scoring
      if (gs.lastScore === 0 && scoreBreakdown(gs.board).nearMissOf) setTimeout(() => audio.play('near-miss'), 180);
    }
    // Scored — big chime for a 15+ play
    if (gs.lastScore > 0 && gs.lastScore !== prevLastScore.current) {
      setTimeout(() => audio.play(gs.lastScore >= 15 ? 'score-big' : 'score'), 180);
    }
    // Game over → win/lose; round over → clear sweep
    if ((gs.phase === 'roundOver' || gs.phase === 'gameOver') && prevPhase.current !== gs.phase) {
      if (gs.phase === 'gameOver') setTimeout(() => audio.play(gs.gameWinnerId === 'human' ? 'win' : 'lose'), 350);
      else setTimeout(() => audio.play('clear'), 300);
    }
    prevBoardLen.current = boardLen;
    prevPhase.current = gs.phase;
    prevLastScore.current = gs.lastScore;
  }, [gs]);

  // AI turn
  useEffect(() => {
    if (!gs || gs.phase !== 'aiThinking') return;

    aiTimerRef.current = setTimeout(() => {
      const aiPlayer = gs.players[gs.currentPlayerIndex];
      if (!aiPlayer || aiPlayer.isHuman) return;

      const difficulty = difficultyForMode(gs.mode);
      const humanHand = gs.players.find(p => p.isHuman)?.hand;
      const play = aiPickPlay(aiPlayer.hand, gs.board, difficulty, humanHand);

      if (play) {
        setLatestTileId(play.tile.id);
        setGs(prev => {
          if (!prev) return prev;
          const newBoard = playOnBoard(prev.board, play.tile, play.end);
          const scored = scoreValue(newBoard);
          const updatedPlayers = prev.players.map((p, i) =>
            i === prev.currentPlayerIndex
              ? { ...p, hand: p.hand.filter(t => t.id !== play.tile.id), score: p.score + scored }
              : p
          );
          const current = updatedPlayers[prev.currentPlayerIndex];
          const gameWon = current.score >= prev.targetScore;
          const roundWon = current.hand.length === 0;
          const bonus = grantsGoAgain(play.tile, scored);
          const speech = buildSpeech(false, scored, isDouble(play.tile), bonus, current.personalityId, updatedPlayers[0].score, updatedPlayers.find(p => !p.isHuman)?.score ?? 0);
          const mood = getMood(false, scored, isDouble(play.tile));

          if (gameWon) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'gameOver', gameWinnerId: current.id,
            wendySpeech: randQuote('wendyWins', current.personalityId), wendyMood: 'triumphant',
          };
          if (roundWon) {
            const pipBonus = calcRoundBonus(updatedPlayers, prev.currentPlayerIndex);
            const scoredPlayers = pipBonus > 0
              ? updatedPlayers.map((p, i) => i === prev.currentPlayerIndex ? { ...p, score: p.score + pipBonus } : p)
              : updatedPlayers;
            const gameWonFinal = scoredPlayers[prev.currentPlayerIndex].score >= prev.targetScore;
            return {
              ...prev, board: newBoard, players: scoredPlayers,
              phase: gameWonFinal ? 'gameOver' : 'roundOver',
              gameWinnerId: gameWonFinal ? current.id : null,
              roundWinnerId: current.id,
              wendySpeech: gameWonFinal ? randQuote('wendyWins', current.personalityId) : `${speech} (+${pipBonus} pip bonus)`,
              wendyMood: gameWonFinal ? 'triumphant' : mood,
            };
          }
          // RaceHorse: double OR score → she plays again (same seat, still aiThinking)
          if (bonus) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'aiThinking', lastScore: scored,
            lastScoringPlayerId: scored > 0 ? current.id : prev.lastScoringPlayerId,
            wendySpeech: speech, wendyMood: mood,
            turnCount: prev.turnCount + 1,
          };

          const nextIdx = (prev.currentPlayerIndex + 1) % prev.players.length;
          const nextPlayer = updatedPlayers[nextIdx];
          return {
            ...prev,
            board: newBoard,
            players: updatedPlayers,
            currentPlayerIndex: nextIdx,
            phase: nextPlayer.isHuman ? 'selecting' : 'aiThinking',
            lastScore: scored,
            lastScoringPlayerId: scored > 0 ? current.id : prev.lastScoringPlayerId,
            wendySpeech: nextPlayer.isHuman ? "Your turn." : speech,
            wendyMood: nextPlayer.isHuman ? 'neutral' : mood,
            bonusTurn: false,
            turnCount: prev.turnCount + 1,
          };
        });
      } else {
        // AI can't play — draw until playable or boneyard empty, then pass
        setGs(prev => {
          if (!prev) return prev;

          // Draw tiles one by one until we find a playable tile or run out
          let boneyard = [...prev.boneyard];
          let hand = [...prev.players[prev.currentPlayerIndex].hand];
          while (boneyard.length > 0) {
            const [drawn, ...rest] = boneyard;
            boneyard = rest;
            hand = [...hand, drawn];
            if (boardIsEmpty(prev.board) || canPlay(prev.board, drawn)) break;
          }

          const updatedPlayers = prev.players.map((p, i) =>
            i === prev.currentPlayerIndex ? { ...p, hand } : p
          );
          const canPlayNow = hand.some(t => boardIsEmpty(prev.board) || canPlay(prev.board, t));

          if (canPlayNow) {
            // Stay in aiThinking; next tick will find the play. aiNudge is what
            // re-arms this effect — phase, player and turnCount are all
            // deliberately unchanged here, so without it nothing re-runs and
            // the game hangs on her turn forever.
            return {
              ...prev,
              players: updatedPlayers,
              boneyard,
              aiNudge: (prev.aiNudge ?? 0) + 1,
              wendySpeech: randQuote('herTurn', prev.players.find(p => !p.isHuman)?.personalityId),
            };
          }

          // Truly stuck — pass
          const nextIdx = (prev.currentPlayerIndex + 1) % prev.players.length;
          const nextPlayer = updatedPlayers[nextIdx];
          return {
            ...prev,
            players: updatedPlayers,
            boneyard,
            currentPlayerIndex: nextIdx,
            phase: nextPlayer.isHuman ? 'selecting' : 'aiThinking',
            wendySpeech: nextPlayer.isHuman ? "Your turn." : randQuote('herTurn', nextPlayer.personalityId),
            wendyMood: 'neutral',
          };
        });
      }
    }, AI_DELAY_MS);

    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [gs?.phase, gs?.currentPlayerIndex, gs?.turnCount, gs?.aiNudge]);

  // Clear the Undo snapshot at round/game transitions — no undoing across rounds.
  // (Within a round the snapshot persists through Sister Wendy's reply so you can take back your move.)
  useEffect(() => {
    setUndoable(null);
  }, [gs?.roundCount]);

  if (showIntro) {
    return (
      <IntroScreen onDone={() => {
        try { localStorage.setItem('sw-intro-seen', '1'); } catch { /* */ }
        setShowIntro(false);
      }} />
    );
  }

  if (!gs) return <GameSetup onStart={(m, daily, pid, target) => setGs(initGame(m, daily, pid, target))} />;

  if (gs.phase === 'gameOver' && gs.gameWinnerId) {
    return (
      <>
        <GameUI gs={gs} dispatch={dispatch} artFact={artFact} setArtFact={setArtFact} latestTileId={latestTileId} setLatestTileId={setLatestTileId} shakeTileId={shakeTileId} setShakeTileId={setShakeTileId} isMuted={isMuted} onToggleMute={() => { setIsMuted(audio.toggleMute()); }} undoable={undoable} setUndoable={setUndoable} onNewGame={() => setGs(initGame(gs.mode, false, oppPersonality(gs), gs.targetScore))} onReturnToMenu={() => setGs(null)} />
        <EndScreen
          players={gs.players}
          gameWinnerId={gs.gameWinnerId}
          mode={gs.mode}
          hintsUsed={gs.hintsUsed}
          onPlayAgain={() => setGs(initGame(gs.mode, false, oppPersonality(gs), gs.targetScore))}
          onChangeDifficulty={() => setGs(null)}
        />
      </>
    );
  }

  if (gs.phase === 'roundOver' && gs.roundWinnerId) {
    return (
      <>
        <GameUI gs={gs} dispatch={dispatch} artFact={artFact} setArtFact={setArtFact} latestTileId={latestTileId} setLatestTileId={setLatestTileId} shakeTileId={shakeTileId} setShakeTileId={setShakeTileId} isMuted={isMuted} onToggleMute={() => { setIsMuted(audio.toggleMute()); }} undoable={undoable} setUndoable={setUndoable} onNewGame={() => setGs(initGame(gs.mode, false, oppPersonality(gs), gs.targetScore))} onReturnToMenu={() => setGs(null)} />
        <RoundOverScreen
          players={gs.players}
          roundWinnerId={gs.roundWinnerId}
          roundCount={gs.roundCount}
          onNextRound={() => setGs(nextRound(gs))}
        />
      </>
    );
  }

  return (
    <GameUI
      gs={gs}
      dispatch={dispatch}
      artFact={artFact}
      setArtFact={setArtFact}
      latestTileId={latestTileId}
      setLatestTileId={setLatestTileId}
      shakeTileId={shakeTileId}
      setShakeTileId={setShakeTileId}
      isMuted={isMuted}
      onToggleMute={() => { setIsMuted(audio.toggleMute()); }}
      undoable={undoable}
      setUndoable={setUndoable}
      onUndo={() => { if (undoable) { setGs(undoable); setUndoable(null); } }}
      onNewGame={() => setGs(initGame(gs.mode, false, oppPersonality(gs), gs.targetScore))}
      onReturnToMenu={() => setGs(null)}
    />
  );
}

// ── GameUI ──────────────────────────────────────────────────────────────────

/**
 * Gold bloom over the tile that just landed. Fixed-positioned against the
 * viewport so it needs no positioned ancestor and can never disturb the
 * board's flex layout, and it removes itself when the animation ends.
 */
function flashWhereTileLanded(tileId?: string) {
  if (!tileId || typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.querySelector(`[data-flip-id="tile-${tileId}"]`);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const flash = document.createElement('div');
  flash.style.cssText = [
    'position:fixed',
    `left:${r.left + r.width / 2}px`,
    `top:${r.top + r.height / 2}px`,
    'width:64px', 'height:64px', 'border-radius:50%',
    'background:radial-gradient(circle, rgba(232,184,64,0.55) 0%, rgba(232,184,64,0) 70%)',
    'pointer-events:none', 'z-index:40',
    'animation:endFlash 320ms ease-out forwards',
  ].join(';');
  document.body.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove(), { once: true });
}

interface GameUIProps {
  onNewGame: () => void;
  onReturnToMenu: () => void;
  gs: GameState;
  dispatch: (a: Action) => void;
  artFact?: string;
  setArtFact: (f: string | undefined) => void;
  latestTileId?: string;
  setLatestTileId: (id: string | undefined) => void;
  shakeTileId?: string;
  setShakeTileId: (id: string | undefined) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  undoable: GameState | null;
  setUndoable: (s: GameState | null) => void;
  onUndo?: () => void;
}

function GameUI({ gs, dispatch, artFact, setArtFact, latestTileId, setLatestTileId, shakeTileId, setShakeTileId, isMuted, onToggleMute, undoable, setUndoable, onUndo, onNewGame, onReturnToMenu }: GameUIProps) {
  const [showMenuModal, setShowMenuModal] = useState(false);
  const human = gs.players[0];
  const isPlayerTurn = gs.currentPlayerIndex === 0 && (gs.phase === 'selecting' || gs.phase === 'choosingEnd');
  const showHints = gs.mode === 'forgiving';
  const hintSponsor = SPONSOR_CONFIG.hint;
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  // ── Floating score flash (juice): pops the All-Fives math above the board on a scoring play ──
  const [scoreFlash, setScoreFlash] = useState<{ id: number; text: string; sub: string } | null>(null);
  const scoreFlashRef = useRef<HTMLDivElement>(null);
  const prevFlashScore = useRef(gs.lastScore);
  useEffect(() => {
    if (gs.lastScore > 0 && gs.lastScore !== prevFlashScore.current) {
      const a = gs.board.leftEnd ?? 0;
      const b = gs.board.rightEnd ?? 0;
      // Show the literal math when the two open ends add up to the score; else just the points.
      const sub = a + b === gs.lastScore ? `${a} + ${b} = ${gs.lastScore}` : 'ALL-FIVES';
      setScoreFlash({ id: Date.now(), text: `+${gs.lastScore}`, sub });
    }
    prevFlashScore.current = gs.lastScore;
  }, [gs.lastScore, gs.board.leftEnd, gs.board.rightEnd]);
  useEffect(() => {
    if (!scoreFlash || !scoreFlashRef.current) return;
    const el = scoreFlashRef.current;
    gsap.killTweensOf(el);
    gsap.fromTo(el,
      { opacity: 0, y: 24, scale: 0.7 },
      { opacity: 1, y: -8, scale: 1, duration: 0.38, ease: 'back.out(2)' });
    gsap.to(el, { opacity: 0, y: -48, duration: 0.55, delay: 0.95, ease: 'power1.in' });
  }, [scoreFlash]);

  // ── CARL_SPEC §4 — scoring explainer (corner widget) ──
  const [explainer, setExplainer] = useState<ExplainerData | null>(null);
  const prevChainLen = useRef(gs.board.chain.length);
  useEffect(() => {
    const len = gs.board.chain.length;
    const grew = len > prevChainLen.current;
    prevChainLen.current = len;
    if (!grew) return;                       // only when a new tile is placed
    try { if (localStorage.getItem('sw-scoring-help') === 'off') return; } catch { /* */ }
    const played = getStats().played;
    if (played >= 10) return;                // after game 10: only via the "?" button
    const bd = scoreBreakdown(gs.board);
    if (gs.lastScore > 0) {
      const scorerHuman = gs.lastScoringPlayerId === 'human';
      if (played < 3 || scorerHuman) setExplainer({ kind: 'score', ends: bd.ends, sum: bd.sum, points: bd.points, nearMissOf: 0 });
    } else if (played < 3 && gs.phase === 'aiThinking' && bd.nearMissOf) {
      setExplainer({ kind: 'near', ends: bd.ends, sum: bd.sum, points: 0, nearMissOf: bd.nearMissOf });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.board.chain.length]);
  useEffect(() => {
    if (!explainer) return;
    const t = setTimeout(() => setExplainer(null), 7000);
    return () => clearTimeout(t);
  }, [explainer]);
  // Manual summon (the "?" — always available, esp. after game 10)
  function summonExplainer() {
    const bd = scoreBreakdown(gs.board);
    if (bd.sum <= 0) {
      // Empty/early board — show a canonical worked example of how scoring works.
      setExplainer({ kind: 'score', ends: [10, 5], sum: 15, points: 15, nearMissOf: 0 });
    } else if (bd.points > 0) {
      setExplainer({ kind: 'score', ends: bd.ends, sum: bd.sum, points: bd.points, nearMissOf: 0 });
    } else {
      setExplainer({ kind: 'near', ends: bd.ends, sum: bd.sum, points: 0, nearMissOf: bd.nearMissOf ?? (bd.sum + (5 - (bd.sum % 5 || 5))) });
    }
    try { localStorage.removeItem('sw-scoring-help'); } catch { /* */ }
  }

  // Run FLIP animation after board chain grows (human or AI play)
  useLayoutEffect(() => {
    if (!flipStateRef.current) return;
    const state = flipStateRef.current;
    flipStateRef.current = null;
    Flip.from(state, {
      duration: 0.42,
      ease: 'power2.inOut',
      absolute: true,
      scale: true,
      nested: true,
      // A tile landing should be felt, not just seen — bloom where it settled.
      onComplete: () => flashWhereTileLanded(latestTileId),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gs.board.chain.length]);

  function handleTileClick(tile: TileData) {
    const ends = boardIsEmpty(gs.board) ? (['first'] as BoardEnd[]) : validEnds(gs.board, tile);
    if (ends.length === 0) {
      // Tile can't be played — shake it and play error sound
      audio.play('error');
      setShakeTileId(tile.id);
      setTimeout(() => setShakeTileId(undefined), 600);
      dispatch({ type: 'SELECT_TILE', tile }); // updates wendySpeech feedback
      return;
    }
    if (ends.length === 1) {
      flipStateRef.current = Flip.getState('[data-flip-id]');
      setLatestTileId(tile.id);
    }
    dispatch({ type: 'SELECT_TILE', tile });
  }

  function handleEndClick(end: BoardEnd) {
    if (gs.selectedTile) {
      flipStateRef.current = Flip.getState('[data-flip-id]');
      setLatestTileId(gs.selectedTile.id);
    }
    // Snapshot the pre-move state for Undo (Forgiving only) — restores the board + hand
    // before this play, reverting Sister Wendy's reply too.
    if (gs.mode === 'forgiving') {
      setUndoable({ ...gs, selectedTile: null, validEndsForSelected: [], phase: 'selecting' });
    }
    dispatch({ type: 'CHOOSE_END', end });
  }

  function handleHint() {
    if (!isPlayerTurn || gs.mode !== 'forgiving') return;
    let best: { score: number; a: number; b: number } | null = null;
    for (const t of human.hand) {
      for (const end of validEnds(gs.board, t)) {
        const sim = playOnBoard(gs.board, t, end);
        const sc = scoreValue(sim);
        if (!best || sc > best.score) best = { score: sc, a: t.a, b: t.b };
      }
    }
    const hintText = best && best.score > 0
      ? `${hintSponsor ? hintSponsor.quipPrefix + ' ' : ''}The [${best.a}|${best.b}] scores ${best.score} points.`
      : `${hintSponsor ? hintSponsor.quipPrefix + ' ' : ''}No scoring play available. Draw if you can't play.`;
    dispatch({ type: 'SPEECH', text: hintText, mood: 'amused' });
  }

  const canDraw = isPlayerTurn && gs.boneyard.length > 0 &&
    !human.hand.some(t => boardIsEmpty(gs.board) || canPlay(gs.board, t));
  const canPass = isPlayerTurn && gs.boneyard.length === 0 &&
    !human.hand.some(t => boardIsEmpty(gs.board) || canPlay(gs.board, t));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0a06', color: '#f5ead8' }}>
      {/* CARL_SPEC §4 — scoring explainer. The "?" that summons it used to be
          fixed at bottom-left, directly on top of the HINT button; it now lives
          in the action stack under the scorecard (Andrew, 4 Aug). */}
      {explainer && (
        <ScoringExplainer data={explainer} onClose={() => setExplainer(null)}
          onDisable={() => { try { localStorage.setItem('sw-scoring-help', 'off'); } catch { /* */ } setExplainer(null); }} />
      )}


      {/* Gear background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <svg className="absolute top-[-8%] right-[-6%] opacity-[0.025]" width="480" height="480" viewBox="0 0 100 100"
          style={{ animation: 'gear-cw 55s linear infinite' }}>
          <GearPath />
        </svg>
        <svg className="absolute bottom-[5%] left-[-5%] opacity-[0.018]" width="300" height="300" viewBox="0 0 100 100"
          style={{ animation: 'gear-ccw 40s linear infinite' }}>
          <GearPath />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-center"
        style={{ borderBottom: '1px solid rgba(196,144,32,0.15)' }}>
        {/* Menu button */}
        <div className="absolute left-4">
          <button
            onClick={() => setShowMenuModal(true)}
            style={{ background: 'none', border: '1px solid rgba(196,144,32,0.25)', borderRadius: 6, cursor: 'pointer', fontSize: '0.72rem', padding: '4px 8px', color: 'rgba(196,144,32,0.55)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
          >
            ☰ MENU
          </button>
        </div>
        <div className="text-center">
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', letterSpacing: '0.1em', color: '#e8b840', lineHeight: 1 }}>
            SISTER WENDY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'rgba(226,188,96,0.82)' }}>
            {gs.mode.toUpperCase()} MODE · ROUND {gs.roundCount} · TURN {gs.turnCount}
          </div>
        </div>
        <div className="absolute right-4 flex items-center gap-3">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.55, lineHeight: 1 }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <span className={isPlayerTurn ? 'turn-live' : undefined}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', color: 'rgba(232,184,64,0.92)' }}>
            {isPlayerTurn ? '▶ YOUR TURN' : `⏳ ${gs.players.find(p => !p.isHuman)?.name?.split(' ')[1] ?? 'WENDY'}`}
          </span>
        </div>
      </header>

      {/* Menu Modal */}
      {showMenuModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowMenuModal(false)}
        >
          <div
            className="rounded-2xl p-8 flex flex-col gap-4 w-full max-w-xs"
            style={{ background: '#0d0a06', border: '1px solid rgba(196,144,32,0.3)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', letterSpacing: '0.12em', color: '#e8b840', textAlign: 'center' }}>
              PAUSED
            </div>
            <button
              onClick={() => setShowMenuModal(false)}
              style={{ background: 'rgba(196,144,32,0.12)', border: '1px solid rgba(196,144,32,0.3)', borderRadius: 10, padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em', color: '#e8b840', cursor: 'pointer' }}
            >
              ▶ RESUME GAME
            </button>
            <button
              onClick={() => { onNewGame(); setShowMenuModal(false); }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              ↺ NEW GAME
            </button>
            <button
              onClick={() => { onReturnToMenu(); setShowMenuModal(false); }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              ← RETURN TO MENU
            </button>
          </div>
        </div>
      )}

      {/* ── FELT TABLE ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 w-full"
        style={{
          background: 'linear-gradient(160deg, #1e5c2e 0%, #174d25 60%, #123f1e 100%)',
          // last inset = vignette, so the empty middle of the table isn't flat
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.35), inset 0 0 140px 50px rgba(0,0,0,0.30)',
          minHeight: '60vh',
        }}
      >
        {/* Felt grain (see globals.css) */}
        <div className="absolute inset-0 pointer-events-none felt-grain" />

        <div className="relative flex flex-col md:flex-row h-full" style={{ minHeight: '60vh' }}>

          {/* LEFT PANEL: Wendy + scores — sits on the felt */}
          <div className="flex flex-col gap-3 p-3 md:w-[224px] flex-shrink-0">
            <WendyPortrait mood={gs.wendyMood} speech={gs.wendySpeech} artFact={artFact} personalityId={oppPersonality(gs)} />
            <ScorePanel
              players={gs.players}
              currentPlayerIndex={gs.currentPlayerIndex}
              boneyard={gs.boneyard.length}
              round={gs.roundCount}
              lastScore={gs.lastScore}
              lastScoringPlayerId={gs.lastScoringPlayerId}
              targetScore={gs.targetScore}
            />

            {/* Your tools, under your scorecard — HINT, UNDO and the scoring
                "?" together, out of the footer where they collided. */}
            <div className="flex flex-wrap gap-2">
              {showHints && isPlayerTurn && (
                <button onClick={handleHint}
                  title={hintSponsor ? `Ask Sister Wendy's Patron — ${hintSponsor.name}` : 'Ask for a hint'}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', background: 'rgba(74,154,143,0.14)', border: '1px solid rgba(74,154,143,0.45)', color: '#74c7bb', cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}>
                  {hintSponsor ? `ASK ${hintSponsor.name.toUpperCase().slice(0, 8)}` : '💡 HINT'}
                </button>
              )}
              {gs.mode === 'forgiving' && undoable && isPlayerTurn && onUndo && (
                <button onClick={onUndo}
                  title="Take back your last move — Sister Wendy will pretend she didn't see."
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', background: 'rgba(196,144,32,0.12)', border: '1px solid rgba(196,144,32,0.4)', color: '#e8b840', cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}>
                  ↩ UNDO
                </button>
              )}
              {!explainer && (
                <button onClick={summonExplainer} aria-label="How does scoring work?"
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(21,17,10,0.85)', border: '1px solid rgba(196,144,32,0.4)', color: '#e8b840', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-mono), monospace' }}>
                  ?
                </button>
              )}
            </div>
          </div>

          {/* Subtle divider */}
          <div className="hidden md:block flex-shrink-0" style={{ width: 1, background: 'rgba(0,0,0,0.25)', margin: '16px 0' }} />

          {/* MAIN TABLE SURFACE: board + hand */}
          <div className="flex flex-col flex-1 min-w-0 px-3 pt-3 pb-3 gap-3">

            {/* Board chain — centred in available space */}
            <div className="flex-1 flex items-center relative">
              {scoreFlash && (
                <div ref={scoreFlashRef} key={scoreFlash.id}
                  style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 30, pointerEvents: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.6rem', lineHeight: 1, color: '#C9A84C', textShadow: '0 2px 14px rgba(201,168,76,0.65)' }}>
                    {scoreFlash.text} <span style={{ fontSize: '1.5rem' }}>✦</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.18em', color: 'rgba(245,234,216,0.65)', marginTop: 3 }}>
                    {scoreFlash.sub}
                  </div>
                </div>
              )}
              <div className="w-full">
                <Board
                  board={gs.board}
                  validEnds={gs.validEndsForSelected}
                  awaitingEnd={gs.phase === 'choosingEnd'}
                  onEndClick={handleEndClick}
                  latestTileId={latestTileId}
                  sponsorLogoUrl={SPONSOR_CONFIG.tileBack?.logoUrl}
                />
              </div>
            </div>

            {/* Status banners */}
            {gs.phase === 'choosingEnd' && (
              <div className="text-center py-3 rounded-lg"
                style={{ background: 'rgba(74,154,143,0.12)', border: '1px solid rgba(74,154,143,0.35)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#4a9a8f' }}>
                ← CLICK LEFT OR RIGHT END TO PLACE →
              </div>
            )}
            {gs.bonusTurn && gs.phase === 'selecting' && (
              <div className="text-center py-3 rounded-lg fade-up"
                style={{ background: 'rgba(232,184,64,0.1)', border: '1px solid rgba(232,184,64,0.45)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 22px rgba(232,184,64,0.14)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.15em', color: '#f0cf6a' }}>
                ⚡ BONUS TURN — PLAY AGAIN
              </div>
            )}

            {/* Player hand — overlaid on felt at bottom */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', letterSpacing: '0.18em', color: 'rgba(222,247,224,0.88)', textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginBottom: 6, textAlign: 'center' }}>
                YOUR HAND
              </div>
              <Hand
                tiles={human.hand}
                selectedTile={gs.selectedTile}
                board={gs.board}
                isPlayerTurn={isPlayerTurn}
                onTileClick={handleTileClick}
                onHoverFact={setArtFact}
                showHints={showHints}
                shakeTileId={shakeTileId}
              />

              {/* Mobile-only speech — shown near the hand, not as a fixed overlay */}
              <div className="md:hidden mt-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(13,10,6,0.88)', border: '1px solid rgba(196,144,32,0.15)' }}>
                <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.88rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.82)', lineHeight: 1.4, textAlign: 'center' }}>
                  &ldquo;{gs.wendySpeech}&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER: actions + ad spot ───────────────────────────────────────── */}
      <div
        className="relative z-10 w-full px-4 py-2 flex items-center gap-2 flex-wrap justify-center"
        style={{ background: '#0d0a06', borderTop: '1px solid rgba(196,144,32,0.15)', minHeight: 64 }}
      >
        {canDraw && (
          <button onClick={() => { audio.play('draw'); dispatch({ type: 'DRAW' }); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', letterSpacing: '0.14em', background: 'rgba(196,144,32,0.15)', border: '1px solid rgba(196,144,32,0.4)', color: '#e8b840', cursor: 'pointer', padding: '6px 16px', borderRadius: 10 }}>
            DRAW ({gs.boneyard.length})
          </button>
        )}
        {canPass && (
          <button onClick={() => dispatch({ type: 'PASS' })}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', letterSpacing: '0.14em', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.35)', color: '#ef4444', cursor: 'pointer', padding: '6px 16px', borderRadius: 10 }}>
            PASS
          </button>
        )}
        {gs.phase === 'choosingEnd' && (
          <button onClick={() => dispatch({ type: 'CANCEL_SELECTION' })}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', background: 'transparent', border: '1px solid rgba(196,144,32,0.2)', color: 'rgba(245,234,216,0.5)', cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}>
            CANCEL
          </button>
        )}
        {/* HINT and UNDO now live under the scorecard — see the left panel. */}

        {/* House links, pinned far left */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginRight: 4 }}>
          <a href="https://screwcap.games" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.85rem', letterSpacing: '0.1em', color: '#e8b840', textDecoration: 'none' }}>
            SCREWCAP.GAMES
          </a>
          <span style={{ color: 'rgba(196,144,32,0.45)' }}>|</span>
          <a href="/research"
            style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(232,184,64,0.8)', textDecoration: 'none' }}>
            ABOUT
          </a>
        </div>

        <div className="flex-1" />

        {/* The rest of the offering, ranged right */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {SCREWCAP_FOOTER_GAMES.map(g => (
            <a
              key={g.id}
              href={g.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: g.color,
                textDecoration: 'none',
                border: `1px solid ${g.color}22`,
                borderRadius: 6,
                padding: '4px 10px',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = g.color;
                (e.currentTarget as HTMLElement).style.borderColor = `${g.color}66`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = g.color;
                (e.currentTarget as HTMLElement).style.borderColor = `${g.color}22`;
              }}
            >
              {g.name}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Round Over overlay ──────────────────────────────────────────────────────

function RoundOverScreen({
  players,
  roundWinnerId,
  roundCount,
  onNextRound,
}: {
  players: GameState['players'];
  roundWinnerId: string;
  roundCount: number;
  onNextRound: () => void;
}) {
  const winner = players.find(p => p.id === roundWinnerId)!;
  const humanWon = winner.isHuman;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,10,6,0.93)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-md rounded-2xl p-9"
        style={{
          background: 'linear-gradient(180deg, #1a1408 0%, #0d0a06 100%)',
          border: '1px solid rgba(196,144,32,0.3)',
          boxShadow: '0 0 50px rgba(196,144,32,0.08)',
        }}
      >
        <div className="text-center mb-5">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.28em', color: 'rgba(196,144,32,0.5)', marginBottom: 6 }}>
            ROUND {roundCount} COMPLETE
          </div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '0.08em', color: humanWon ? '#e8b840' : '#f5ead8', lineHeight: 1 }}>
            {humanWon ? 'ROUND WON' : winner.name.toUpperCase() + ' WINS THE ROUND'}
          </div>
        </div>

        <div className="grid gap-2 mb-5" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
          {players.map(p => (
            <div key={p.id} className="rounded-xl p-4 text-center"
              style={{
                background: p.id === roundWinnerId ? 'rgba(196,144,32,0.1)' : 'rgba(26,20,8,0.6)',
                border: `1px solid ${p.id === roundWinnerId ? 'rgba(232,184,64,0.35)' : 'rgba(196,144,32,0.1)'}`,
              }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.12em', color: 'rgba(196,144,32,0.55)', marginBottom: 3 }}>
                {p.name.toUpperCase()}{p.id === roundWinnerId ? ' ★' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#f5ead8', lineHeight: 1 }}>
                {p.score}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(196,144,32,0.3)' }}>/ 61</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-5 mb-5 text-center"
          style={{ background: 'rgba(26,20,8,0.6)', border: '1px solid rgba(196,144,32,0.12)' }}>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.95rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.75)', lineHeight: 1.5 }}>
            "{humanWon
              ? "Well done. Don't celebrate too long — we're going again."
              : "The tiles don't lie. On to the next round. The habit stays on."}"
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(196,144,32,0.35)', marginTop: 6 }}>
            — SISTER WENDY
          </div>
        </div>

        {/* Cross-promo between rounds */}
        <div className="mb-5">
          <ScrewcapGamesStrip compact />
        </div>

        {/* Paid mid-game sponsor banner */}
        <div className="mb-5">
          <SponsorBanner />
        </div>

        <button
          onClick={onNextRound}
          className="w-full py-3 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.1em',
            background: '#c49020', color: '#0d0a06',
            border: 'none', cursor: 'pointer',
          }}
        >
          NEXT ROUND →
        </button>
      </div>
    </div>
  );
}

function GearPath() {
  const teeth = 12;
  const cx = 50, cy = 50;
  const rOuter = 46, rInner = 36, rHub = 12;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return (
    <>
      <polygon points={pts.join(' ')} fill="#c49020" />
      <circle cx={cx} cy={cy} r={rHub} fill="#0d0a06" />
    </>
  );
}
