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
  shakeTileId?: string;
}

export default function Hand({
  tiles,
  selectedTile,
  board,
  isPlayerTurn,
  onTileClick,
  onHoverFact,
  showHints,
  shakeTileId,
}: HandProps) {
  return (
    <div className="w-full">
      <div
        className="flex flex-wrap justify-center gap-2 p-3 rounded-xl"
        style={{
          background: 'rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.07)',
          minHeight: 80,
        }}
      >
        {tiles.length === 0 ? (
          <span style={{ fontFamily: 'var(--font-garamond)', color: 'rgba(196,144,32,0.4)', fontStyle: 'italic', fontSize: '1rem', alignSelf: 'center' }}>
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
                flipId={`tile-${tile.id}`}
                isSelected={selected}
                isPlayable={showHints ? playable : false}
                isDisabled={!isPlayerTurn}
                isShaking={shakeTileId === tile.id}
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'rgba(230,192,102,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {tiles.length} TILE{tiles.length !== 1 ? 'S' : ''} IN HAND
        </span>
      </div>
    </div>
  );
}
