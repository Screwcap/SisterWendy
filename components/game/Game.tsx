'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);
import {
  GameState, GameMode, TileData, BoardEnd,
  initGame, nextRound, validEnds, canPlay, playOnBoard, scoreValue,
  boardIsEmpty, aiPickPlay, difficultyForMode,
  calcRoundBonus, TARGET_SCORE, isDouble,
} from '@/lib/game';
import { randQuote } from '@/lib/wendy';
import type { WendyMood } from '@/lib/game';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import { audio } from '@/lib/audio';
import Board from './Board';
import Hand from './Hand';
import WendyPortrait from './WendyPortrait';
import ScorePanel from './ScorePanel';
import EndScreen from './EndScreen';
import GameSetup from './GameSetup';
import IntroScreen from './IntroScreen';
import { ScrewcapGamesStrip, SponsorBanner } from './ScrewcapPromo';

const SCREWCAP_FOOTER_GAMES = [
  { id: 'double-fives', name: 'DOUBLE FIVES', color: '#d4507a', href: 'https://screwcap.games' },
  { id: 'the-chair',   name: 'THE CHAIR',    color: '#4a9a8f', href: 'https://thechair.vercel.app' },
  { id: 'fly-macro',   name: 'FLYMACROPILOT',color: '#c49020', href: 'https://flymacropilot.vercel.app' },
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
  const gameWon = current.score >= TARGET_SCORE;
  const roundWon = current.hand.length === 0;

  if (gameWon || roundWon) {
    // Award pip bonus: sum opponents' remaining tile pips, round to nearest 5
    const pipBonus = roundWon ? calcRoundBonus(updatedPlayers, playerIdx) : 0;
    const scoredPlayers = pipBonus > 0
      ? updatedPlayers.map((p, i) => i === playerIdx ? { ...p, score: p.score + pipBonus } : p)
      : updatedPlayers;
    const finalWinner = scoredPlayers[playerIdx];
    const gameWonFinal = finalWinner.score >= TARGET_SCORE;
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

  // Only doubles grant a replay — scoring alone does not
  const bonus = isDouble(tile);
  const speech = buildSpeech(current.isHuman, scored, isDouble(tile), bonus, state.players.find(p => !p.isHuman)?.personalityId);
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

function buildSpeech(isHuman: boolean, scored: number, double_: boolean, bonus: boolean, pid?: string): string {
  if (isHuman) {
    if (scored >= 20) return randQuote('playerBigScore', pid);
    if (scored > 0)   return randQuote('playerScores', pid) + (bonus ? " Play again." : "");
    if (double_)      return randQuote('playerDouble', pid) + " Play again.";
    return randQuote('herTurn', pid);
  } else {
    if (scored >= 20) return randQuote('wendyBigScore', pid);
    if (scored > 0)   return randQuote('wendyScores', pid);
    if (double_)      return randQuote('wendyDouble', pid);
    return randQuote('commentary', pid);
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
  const [gs, setGs] = useState<GameState | null>(loadSavedGame);
  const [artFact, setArtFact] = useState<string | undefined>(undefined);
  const [latestTileId, setLatestTileId] = useState<string | undefined>(undefined);
  const [shakeTileId, setShakeTileId] = useState<string | undefined>(undefined);
  const [isMuted, setIsMuted] = useState(false);
  const [undoable, setUndoable] = useState<GameState | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('sw-intro-seen');
  });
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync mute button state with audio singleton on mount
  useEffect(() => { setIsMuted(audio.muted); }, []);

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
    // Tile placed
    if (boardLen > prevBoardLen.current) {
      audio.play('place');
    }
    // Scored
    if (gs.lastScore > 0 && gs.lastScore !== prevLastScore.current) {
      setTimeout(() => audio.play('score'), 180);
    }
    // Round or game over
    if ((gs.phase === 'roundOver' || gs.phase === 'gameOver') && prevPhase.current !== gs.phase) {
      setTimeout(() => audio.play('clear'), 300);
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
          const gameWon = current.score >= TARGET_SCORE;
          const roundWon = current.hand.length === 0;
          const bonus = isDouble(play.tile);
          const speech = buildSpeech(false, scored, isDouble(play.tile), bonus);
          const mood = getMood(false, scored, isDouble(play.tile));

          if (gameWon) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'gameOver', gameWinnerId: current.id,
            wendySpeech: randQuote('wendyWins'), wendyMood: 'triumphant',
          };
          if (roundWon) {
            const pipBonus = calcRoundBonus(updatedPlayers, prev.currentPlayerIndex);
            const scoredPlayers = pipBonus > 0
              ? updatedPlayers.map((p, i) => i === prev.currentPlayerIndex ? { ...p, score: p.score + pipBonus } : p)
              : updatedPlayers;
            const gameWonFinal = scoredPlayers[prev.currentPlayerIndex].score >= TARGET_SCORE;
            return {
              ...prev, board: newBoard, players: scoredPlayers,
              phase: gameWonFinal ? 'gameOver' : 'roundOver',
              gameWinnerId: gameWonFinal ? current.id : null,
              roundWinnerId: current.id,
              wendySpeech: gameWonFinal ? randQuote('wendyWins') : `${speech} (+${pipBonus} pip bonus)`,
              wendyMood: gameWonFinal ? 'triumphant' : mood,
            };
          }
          // Only doubles grant a replay
          if (bonus) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'aiThinking', lastScore: scored, wendySpeech: speech, wendyMood: mood,
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
            // Stay in aiThinking; next tick will find the play
            return { ...prev, players: updatedPlayers, boneyard, wendySpeech: randQuote('herTurn') };
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
  }, [gs?.phase, gs?.currentPlayerIndex, gs?.turnCount]);

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

  if (!gs) return <GameSetup onStart={(m, daily) => setGs(initGame(m, daily))} />;

  if (gs.phase === 'gameOver' && gs.gameWinnerId) {
    return (
      <>
        <GameUI gs={gs} dispatch={dispatch} artFact={artFact} setArtFact={setArtFact} latestTileId={latestTileId} setLatestTileId={setLatestTileId} shakeTileId={shakeTileId} setShakeTileId={setShakeTileId} isMuted={isMuted} onToggleMute={() => { setIsMuted(audio.toggleMute()); }} undoable={undoable} setUndoable={setUndoable} onNewGame={() => setGs(initGame(gs.mode))} onReturnToMenu={() => setGs(null)} />
        <EndScreen
          players={gs.players}
          gameWinnerId={gs.gameWinnerId}
          mode={gs.mode}
          hintsUsed={gs.hintsUsed}
          onPlayAgain={() => setGs(initGame(gs.mode))}
          onChangeDifficulty={() => setGs(null)}
        />
      </>
    );
  }

  if (gs.phase === 'roundOver' && gs.roundWinnerId) {
    return (
      <>
        <GameUI gs={gs} dispatch={dispatch} artFact={artFact} setArtFact={setArtFact} latestTileId={latestTileId} setLatestTileId={setLatestTileId} shakeTileId={shakeTileId} setShakeTileId={setShakeTileId} isMuted={isMuted} onToggleMute={() => { setIsMuted(audio.toggleMute()); }} undoable={undoable} setUndoable={setUndoable} onNewGame={() => setGs(initGame(gs.mode))} onReturnToMenu={() => setGs(null)} />
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
      onNewGame={() => setGs(initGame(gs.mode))}
      onReturnToMenu={() => setGs(null)}
    />
  );
}

// ── GameUI ──────────────────────────────────────────────────────────────────

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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.45)' }}>
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: 'rgba(196,144,32,0.4)' }}>
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
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.35)',
          minHeight: '60vh',
        }}
      >
        {/* Felt texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 8px)',
        }} />

        <div className="relative flex flex-col md:flex-row h-full" style={{ minHeight: '60vh' }}>

          {/* LEFT PANEL: Wendy + scores — sits on the felt */}
          <div className="flex flex-col gap-3 p-3 md:w-[200px] flex-shrink-0">
            <WendyPortrait mood={gs.wendyMood} speech={gs.wendySpeech} artFact={artFact} personalityId={oppPersonality(gs)} />
            <ScorePanel
              players={gs.players}
              currentPlayerIndex={gs.currentPlayerIndex}
              boneyard={gs.boneyard.length}
              round={gs.roundCount}
              lastScore={gs.lastScore}
              lastScoringPlayerId={gs.lastScoringPlayerId}
            />
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
              <div className="text-center py-3 rounded-lg"
                style={{ background: 'rgba(232,184,64,0.08)', border: '1px solid rgba(232,184,64,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#e8b840' }}>
                ⚡ BONUS TURN — PLAY AGAIN
              </div>
            )}

            {/* Player hand — overlaid on felt at bottom */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(200,240,200,0.45)', marginBottom: 6, textAlign: 'center' }}>
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
        {showHints && isPlayerTurn && (
          <button onClick={handleHint}
            title={hintSponsor ? `Ask Sister Wendy's Patron — ${hintSponsor.name}` : 'Ask for a hint'}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', background: 'rgba(74,154,143,0.1)', border: '1px solid rgba(74,154,143,0.25)', color: '#4a9a8f', cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}>
            {hintSponsor ? `ASK ${hintSponsor.name.toUpperCase().slice(0, 8)}` : '💡 HINT'}
          </button>
        )}
        {gs.mode === 'forgiving' && undoable && isPlayerTurn && onUndo && (
          <button onClick={onUndo}
            title="Take back your last move — Sister Wendy will pretend she didn't see."
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', background: 'rgba(196,144,32,0.1)', border: '1px solid rgba(196,144,32,0.3)', color: '#c49020', cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}>
            ↩ UNDO
          </button>
        )}

        <div className="flex-1" />

        {/* Sponsor / other-games ad slot */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                color: `${g.color}88`,
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
                (e.currentTarget as HTMLElement).style.color = `${g.color}88`;
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
