import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import PieceType from '../pieceType';
import Rook from './rook';

export default class King extends Piece {
    public hasMoved = false;
    
    public constructor(player: Player) {
        super(player);
        this.pieceType = PieceType.KING;
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);

        const validMoves: Square[] = [];

        const directions = [-1, 0, 1];

        for (const rowDir of directions) {
            for (const colDir of directions) {
                if (rowDir === 0 && colDir === 0) continue;
                validMoves.push(...this.getValidMovesInDirectionForOneStep(board, currentSquare, rowDir, colDir));
            }
        }

        if (!this.hasMoved) {
            const possibleRookLeft = board.getPiece(Square.at(currentSquare.row, 0));
            if (
                possibleRookLeft?.pieceType === PieceType.ROOK
                && !(possibleRookLeft as Rook).hasMoved
                && [3, 2, 1].every((col) => board.getPiece(Square.at(currentSquare.row, col)) === undefined)
            ) {
                validMoves.push(Square.at(currentSquare.row, 2));
            }

            const possibleRookRight = board.getPiece(Square.at(currentSquare.row, 7));
            if (
                possibleRookRight?.pieceType === PieceType.ROOK
                && !(possibleRookRight as Rook).hasMoved
                && [5, 6].every((col) => board.getPiece(Square.at(currentSquare.row, col)) === undefined)
            ) {
                validMoves.push(Square.at(currentSquare.row, 6));
            }
        }

        return validMoves;
    }
}
