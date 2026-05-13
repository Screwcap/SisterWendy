'use client';

import { TileData, BoardState, canPlay, boardIsEmpty } from '@/lib/game';
import DominoTile from './DominoTile';

interface HandProps {
  tiles: TileData[];
  selectedTile: TileData | null;
  board: BoardState;
  isPlayerTurn: boolean;
  onTileClick: (tile: TileData) => void;
  onHoverFact: (fact: string) => void;
  showHints: boolean;
}

export default function Hand({
  tiles,
  selectedTile,
  board,
  isPlayerTurn,
  onTileClick,
  onHoverFact,
  showHints,
}: HandProps) {
  return (
    <div className="w-full">
      <div
        className="flex flex-wrap justify-center gap-2 p-3 rounded-xl"
        style={{
          background: 'rgba(26,20,8,0.7)',
          border: '1px solid rgba(196,144,32,0.2)',
          minHeight: 80,
        }}
      >
        {tiles.length === 0 ? (
          <span style={{ fontFamily: 'var(--font-garamond)', color: 'rgba(196,144,32,0.4)', fontStyle: 'italic', fontSize: '0.85rem', alignSelf: 'center' }}>
            Empty hand.
          </span>
        ) : (
          tiles.map(tile => {
            const playable = isPlayerTurn && (boardIsEmpty(board) || canPlay(board, tile));
            const selected = selectedTile?.id === tile.id;
            return (
              <DominoTile
                key={tile.id}
                tile={tile}
                isSelected={selected}
                isPlayable={showHints ? playable : false}
                isDisabled={!isPlayerTurn}
                onClick={isPlayerTurn ? () => onTileClick(tile) : undefined}
                onHover={onHoverFact}
                size="md"
              />
            );
          })
        )}
      </div>

      {/* Tile count */}
      <div className="flex justify-center mt-1">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.18em', color: 'rgba(196,144,32,0.45)' }}>
          {tiles.length} TILE{tiles.length !== 1 ? 'S' : ''} IN HAND
        </span>
      </div>
    </div>
  );
}
