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

        const directions = [-1, 0, 1];

        for (const rowDir of directions) {
            for (const colDir of directions) {
                if (rowDir === 0 && colDir === 0) continue;
                validMoves.push(...this.getValidMovesInDirectionForOneStep(board, currentSquare, rowDir, colDir));
            }
        }

        return validMoves;
    }
}
