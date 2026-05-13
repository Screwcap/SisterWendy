'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GameState, GameMode, TileData, BoardEnd,
  initGame, validEnds, canPlay, playOnBoard, scoreValue,
  boardIsEmpty, aiPickPlay, difficultyForMode,
  TARGET_SCORE, isDouble,
} from '@/lib/game';
import { randQuote } from '@/lib/wendy';
import type { WendyMood } from '@/lib/game';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import Board from './Board';
import Hand from './Hand';
import WendyPortrait from './WendyPortrait';
import ScorePanel from './ScorePanel';
import EndScreen from './EndScreen';
import GameSetup from './GameSetup';

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
    const phase: GameState['phase'] = gameWon ? 'gameOver' : 'roundOver';
    const speech = current.isHuman
      ? gameWon ? randQuote('playerWins') : "Your hand is empty — round over!"
      : gameWon ? randQuote('wendyWins') : "Sister Wendy is out of tiles.";
    return {
      ...state,
      board: newBoard,
      players: updatedPlayers,
      selectedTile: null,
      validEndsForSelected: [],
      phase,
      gameWinnerId: gameWon ? current.id : null,
      roundWinnerId: current.id,
      lastScore: scored,
      lastScoringPlayerId: scored > 0 ? current.id : state.lastScoringPlayerId,
      wendySpeech: speech,
      wendyMood: current.isHuman ? 'disappointed' : 'triumphant',
      bonusTurn: false,
    };
  }

  const bonus = scored > 0 || isDouble(tile);
  const speech = buildSpeech(current.isHuman, scored, isDouble(tile), bonus);
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
    wendySpeech: nextPlayer.isHuman ? "Your turn." : randQuote('herTurn'),
    wendyMood: 'neutral',
  };
}

function buildSpeech(isHuman: boolean, scored: number, double_: boolean, bonus: boolean): string {
  if (isHuman) {
    if (scored >= 20) return randQuote('playerBigScore');
    if (scored > 0)   return randQuote('playerScores') + (bonus ? " Play again." : "");
    if (double_)      return randQuote('playerDouble') + " Play again.";
    return randQuote('herTurn');
  } else {
    if (scored >= 20) return randQuote('wendyBigScore');
    if (scored > 0)   return randQuote('wendyScores');
    if (double_)      return randQuote('wendyDouble');
    return randQuote('commentary');
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

export default function Game() {
  const [gs, setGs] = useState<GameState | null>(null);
  const [artFact, setArtFact] = useState<string | undefined>(undefined);
  const [latestTileId, setLatestTileId] = useState<string | undefined>(undefined);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useCallback((action: Action) => {
    setGs(prev => prev ? reducer(prev, action) : prev);
  }, []);

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
          const bonus = scored > 0 || isDouble(play.tile);
          const speech = buildSpeech(false, scored, isDouble(play.tile), bonus);
          const mood = getMood(false, scored, isDouble(play.tile));

          if (gameWon) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'gameOver', gameWinnerId: current.id,
            wendySpeech: randQuote('wendyWins'), wendyMood: 'triumphant',
          };
          if (roundWon) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'roundOver', roundWinnerId: current.id, wendySpeech: speech, wendyMood: mood,
          };
          if (bonus) return {
            ...prev, board: newBoard, players: updatedPlayers,
            phase: 'aiThinking', lastScore: scored, wendySpeech: speech, wendyMood: mood,
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
        // AI can't play — draw or pass
        setGs(prev => {
          if (!prev) return prev;
          if (prev.boneyard.length === 0) {
            const nextIdx = (prev.currentPlayerIndex + 1) % prev.players.length;
            const nextPlayer = prev.players[nextIdx];
            return {
              ...prev,
              currentPlayerIndex: nextIdx,
              phase: nextPlayer.isHuman ? 'selecting' : 'aiThinking',
              wendySpeech: nextPlayer.isHuman ? "Your turn." : randQuote('herTurn'),
              wendyMood: 'neutral',
            };
          }
          const [drawn, ...rest] = prev.boneyard;
          const updatedPlayers = prev.players.map((p, i) =>
            i === prev.currentPlayerIndex ? { ...p, hand: [...p.hand, drawn] } : p
          );
          const canPlayDrawn = boardIsEmpty(prev.board) || canPlay(prev.board, drawn);
          if (canPlayDrawn) {
            return { ...prev, players: updatedPlayers, boneyard: rest, phase: 'aiThinking', wendySpeech: randQuote('herTurn') };
          }
          const nextIdx = (prev.currentPlayerIndex + 1) % prev.players.length;
          const nextPlayer = updatedPlayers[nextIdx];
          return {
            ...prev,
            players: updatedPlayers,
            boneyard: rest,
            currentPlayerIndex: nextIdx,
            phase: nextPlayer.isHuman ? 'selecting' : 'aiThinking',
            wendySpeech: nextPlayer.isHuman ? "Your turn." : randQuote('herTurn'),
          };
        });
      }
    }, AI_DELAY_MS);

    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [gs?.phase, gs?.currentPlayerIndex, gs?.turnCount]);

  if (!gs) return <GameSetup onStart={m => setGs(initGame(m))} />;

  if (gs.phase === 'gameOver' && gs.gameWinnerId) {
    return (
      <>
        <GameUI gs={gs} dispatch={dispatch} artFact={artFact} setArtFact={setArtFact} latestTileId={latestTileId} />
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

  return (
    <GameUI
      gs={gs}
      dispatch={dispatch}
      artFact={artFact}
      setArtFact={setArtFact}
      latestTileId={latestTileId}
    />
  );
}

// ── GameUI ──────────────────────────────────────────────────────────────────

interface GameUIProps {
  gs: GameState;
  dispatch: (a: Action) => void;
  artFact?: string;
  setArtFact: (f: string | undefined) => void;
  latestTileId?: string;
}

function GameUI({ gs, dispatch, artFact, setArtFact, latestTileId }: GameUIProps) {
  const human = gs.players[0];
  const isPlayerTurn = gs.currentPlayerIndex === 0 && (gs.phase === 'selecting' || gs.phase === 'choosingEnd');
  const showHints = gs.mode === 'forgiving';
  const hintSponsor = SPONSOR_CONFIG.hint;

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
    <div className="min-h-screen" style={{ background: '#0d0a06', color: '#f5ead8' }}>

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
      <header className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(196,144,32,0.15)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', letterSpacing: '0.1em', color: '#e8b840', lineHeight: 1 }}>
            SISTER WENDY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.45)' }}>
            {gs.mode.toUpperCase()} MODE · ROUND {gs.roundCount} · TURN {gs.turnCount}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', color: 'rgba(196,144,32,0.4)' }}>
          {isPlayerTurn ? '▶ YOUR TURN' : '⏳ WENDY PLAYS'}
        </div>
      </header>

      {/* Main layout */}
      <main className="relative z-10 max-w-6xl mx-auto px-3 py-4 grid gap-4"
        style={{ gridTemplateColumns: 'minmax(0,1fr) 200px' }}>

        {/* Left column */}
        <div className="flex flex-col gap-4">

          <Board
            board={gs.board}
            validEnds={gs.validEndsForSelected}
            awaitingEnd={gs.phase === 'choosingEnd'}
            onEndClick={end => dispatch({ type: 'CHOOSE_END', end })}
            latestTileId={latestTileId}
            sponsorLogoUrl={SPONSOR_CONFIG.tileBack?.logoUrl}
          />

          {gs.phase === 'choosingEnd' && (
            <div className="text-center py-2 rounded-lg"
              style={{ background: 'rgba(74,154,143,0.12)', border: '1px solid rgba(74,154,143,0.35)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#4a9a8f' }}>
              ← CLICK LEFT OR RIGHT END TO PLACE →
            </div>
          )}
          {gs.bonusTurn && gs.phase === 'selecting' && (
            <div className="text-center py-2 rounded-lg"
              style={{ background: 'rgba(232,184,64,0.08)', border: '1px solid rgba(232,184,64,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#e8b840' }}>
              ⚡ BONUS TURN — PLAY AGAIN
            </div>
          )}

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.45)', marginBottom: 6 }}>
              YOUR HAND
            </div>
            <Hand
              tiles={human.hand}
              selectedTile={gs.selectedTile}
              board={gs.board}
              isPlayerTurn={isPlayerTurn}
              onTileClick={tile => dispatch({ type: 'SELECT_TILE', tile })}
              onHoverFact={setArtFact}
              showHints={showHints}
            />
          </div>

          {/* AI hands (Merciless) */}
          {gs.mode === 'merciless' && gs.players.slice(1).map(p => (
            <div key={p.id}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.35)', marginBottom: 4 }}>
                {p.name.toUpperCase()} · {p.hand.length} TILES
              </div>
              <div className="flex gap-1 p-2 rounded-lg" style={{ background: 'rgba(26,20,8,0.5)', border: '1px solid rgba(196,144,32,0.1)' }}>
                {p.hand.map(t => (
                  <div key={t.id} style={{ width: 24, height: 48, background: '#1a1408', borderRadius: 3, border: '1px solid rgba(196,144,32,0.2)' }} />
                ))}
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex gap-2">
            {canDraw && (
              <button onClick={() => dispatch({ type: 'DRAW' })} className="flex-1 py-2 rounded-xl transition-all"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', background: 'rgba(196,144,32,0.15)', border: '1px solid rgba(196,144,32,0.4)', color: '#e8b840', cursor: 'pointer' }}>
                DRAW FROM BONEYARD ({gs.boneyard.length})
              </button>
            )}
            {canPass && (
              <button onClick={() => dispatch({ type: 'PASS' })} className="flex-1 py-2 rounded-xl transition-all"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.35)', color: '#ef4444', cursor: 'pointer' }}>
                PASS
              </button>
            )}
            {gs.phase === 'choosingEnd' && (
              <button onClick={() => dispatch({ type: 'CANCEL_SELECTION' })} className="py-2 px-4 rounded-xl"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', background: 'transparent', border: '1px solid rgba(196,144,32,0.2)', color: 'rgba(245,234,216,0.5)', cursor: 'pointer' }}>
                CANCEL
              </button>
            )}
            {showHints && isPlayerTurn && (
              <button onClick={handleHint} className="py-2 px-3 rounded-xl"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', background: 'rgba(74,154,143,0.1)', border: '1px solid rgba(74,154,143,0.25)', color: '#4a9a8f', cursor: 'pointer' }}
                title={hintSponsor ? `Ask Sister Wendy's Patron — ${hintSponsor.name}` : 'Ask for a hint'}>
                {/* SPONSOR_HOOK: hint button */}
                {hintSponsor ? `ASK ${hintSponsor.name.toUpperCase().slice(0, 8)}` : '💡 HINT'}
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <WendyPortrait mood={gs.wendyMood} speech={gs.wendySpeech} artFact={artFact} />
          <ScorePanel
            players={gs.players}
            currentPlayerIndex={gs.currentPlayerIndex}
            boneyard={gs.boneyard.length}
            round={gs.roundCount}
            lastScore={gs.lastScore}
            lastScoringPlayerId={gs.lastScoringPlayerId}
          />
        </div>
      </main>

      {/* Mobile speech bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-20 px-3 pb-safe"
        style={{ background: 'rgba(13,10,6,0.96)', borderTop: '1px solid rgba(196,144,32,0.2)' }}>
        <div className="py-2" style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.78rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.85)', lineHeight: 1.4 }}>
          "{gs.wendySpeech}"
        </div>
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
