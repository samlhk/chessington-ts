import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Knight extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);
        
        const validMoves = [];

        const dirs = [-2, -1, 1, 2];

        for (const rowDir of dirs) {
            for (const colDir of dirs) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    validMoves.push(...this.getValidMovesInDirection(board, currentSquare, rowDir, colDir, true));
                }
            }
        }

        return validMoves;
    }
}
