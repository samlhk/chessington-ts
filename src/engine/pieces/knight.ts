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

        const directions = [-2, -1, 1, 2];

        for (const rowDir of directions) {
            for (const colDir of directions) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    validMoves.push(...this.getValidMovesInDirectionForOneStep(board, currentSquare, rowDir, colDir));
                }
            }
        }

        return validMoves;
    }
}
