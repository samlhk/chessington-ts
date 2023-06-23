import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Queen extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const cardinalDirs = [-1, 0, 1];
        for (const rowDir of cardinalDirs) {
            for (const colDir of cardinalDirs) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    validMoves.push(...this.getValidMovesInDirection(board, currentSquare, rowDir, colDir));
                }
            }
        }

        const diagonalDirs = [-1, 1];
        for (const rowDir of diagonalDirs) {
            for (const colDir of diagonalDirs) {
                validMoves.push(...this.getValidMovesInDirection(board, currentSquare, rowDir, colDir));
            }
        }

        return validMoves;
    }
}
