import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const dirs = [-1, 0, 1];

        for (const rowDir of dirs) {
            for (const colDir of dirs) {
                if (rowDir === 0 && colDir === 0) continue;
                validMoves.push(...this.getValidMovesInDirection(board, currentSquare, rowDir, colDir, true));
            }
        }

        return validMoves;
    }
}
