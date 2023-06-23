import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Bishop extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const dirs = [-1, 1];
        for (const rowDir of dirs) {
            for (const colDir of dirs) {
                validMoves.push(...this.getValidMovesInDirection(board, currentSquare, rowDir, colDir));
            }
        }

        return validMoves;
    }
}
