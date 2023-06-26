import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Rook extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);

        const validMoves: Square[] = [];

        const directions = [-1, 0, 1];
        for (const rowDir of directions) {
            for (const colDir of directions) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    validMoves.push(...this.getValidMovesInDirectionUntilBoundary(board, currentSquare, rowDir, colDir));
                }
            }
        }

        return validMoves;
    }
}
