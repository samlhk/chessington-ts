import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import PieceType from '../pieceType';

export default class Bishop extends Piece {
    public constructor(player: Player) {
        super(player);
        this.pieceType = PieceType.BISHOP;
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const directions = [-1, 1];
        for (const rowDir of directions) {
            for (const colDir of directions) {
                validMoves.push(...this.getValidMovesInDirectionUntilBoundary(board, currentSquare, rowDir, colDir));
            }
        }

        return validMoves;
    }
}
