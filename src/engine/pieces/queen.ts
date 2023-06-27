import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import PieceType from '../pieceType';

export default class Queen extends Piece {
    public constructor(player: Player) {
        super(player);
        this.pieceType = PieceType.QUEEN;
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const cardinalDirections = [-1, 0, 1];
        for (const rowDir of cardinalDirections) {
            for (const colDir of cardinalDirections) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    validMoves.push(...this.getValidMovesInDirectionUntilBoundary(board, currentSquare, rowDir, colDir));
                }
            }
        }

        const diagonalDirections = [-1, 1];
        for (const rowDir of diagonalDirections) {
            for (const colDir of diagonalDirections) {
                validMoves.push(...this.getValidMovesInDirectionUntilBoundary(board, currentSquare, rowDir, colDir));
            }
        }

        return validMoves;
    }
}
